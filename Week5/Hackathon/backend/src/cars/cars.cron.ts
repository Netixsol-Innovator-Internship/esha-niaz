// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Car } from './schemas/car.schema';
// import { AppGateway } from '../gateway/app.gateway';

// @Injectable()
// export class CarsCron {
//   private readonly logger = new Logger(CarsCron.name);
//   constructor(@InjectModel(Car.name) private carModel: Model<Car>, private gateway: AppGateway) {}

//   // Check every minute for ended auctions
//   @Cron(CronExpression.EVERY_MINUTE)
//   async handleCron() {
//     const now = new Date();
//     const ended = await this.carModel.updateMany(
//       { status: 'live', endTime: { $lte: now } },
//       { $set: { status: 'ended' } },
//     );
//     if (ended.modifiedCount > 0) {
//       this.logger.log(`Ended ${ended.modifiedCount} auctions`);
//       this.gateway.broadcast('auction:end', { count: ended.modifiedCount });
//     }
//   }
// }



import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Car } from './schemas/car.schema';
import { Bid } from '../bids/schemas/bid.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { AppGateway } from '../gateway/app.gateway';

@Injectable()
export class CarsCron {
  private readonly logger = new Logger(CarsCron.name);

  constructor(
    @InjectModel(Car.name) private carModel: Model<Car>,
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    private notifications: NotificationsService,
    private gateway: AppGateway,
  ) {}

  // Check every minute for ended auctions
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();

    // Find cars that are still marked live but whose endTime has passed
    const endedCars = await this.carModel
      .find({ status: 'live', endTime: { $lte: now } })
      .exec();

    if (!endedCars.length) return;

    this.logger.log(`Found ${endedCars.length} auctions to end`);

    let processed = 0;

    // Process sequentially to avoid DB overload and to make logging clearer
    for (const car of endedCars) {
      try {
        const carIdStr = car._id.toString();
        // Mark ended and save (use document instance so hooks/triggers run)
        car.status = 'ended';
        await car.save();

        processed++;

        // Broadcast a general event with car id (frontend can react)
        this.gateway.broadcast('auction:end', {
          carId: carIdStr,
          topBid: car.currentBid,
          topBidder: car.topBidder ? car.topBidder.toString() : null,
        });

        // Build notifications:
        // - notify owner (type: 'End')
        // - notify winner (type: 'Win') if exists
        // - notify other participants (type: 'End')

        const ownerId = car.owner ? car.owner.toString() : null;
        const winnerId = car.topBidder ? car.topBidder.toString() : null;

        // Fetch distinct participant user ids (may include owner and winner)
        const participantIdsRaw: (string | Types.ObjectId)[] = await this.bidModel.distinct('user', { car: car._id });
        const participantIds = Array.from(new Set(participantIdsRaw.map(String))); // unique string ids

        // 1) Notify the owner
        if (ownerId) {
          try {
            await this.notifications.create({
              type: 'End',
              sender: winnerId || undefined,
              receiver: ownerId,
              car: carIdStr,
              comment: winnerId
                ? `Your auction ended. Winner: ${winnerId} with ${car.currentBid}`
                : `Your auction ended with no winner.`,
            });
          } catch (err) {
            this.logger.error(`Failed to notify owner ${ownerId} for car ${carIdStr}: ${err?.message || err}`);
          }
        }

        // 2) Notify the winner (if any)
        if (winnerId) {
          try {
            await this.notifications.create({
              type: 'Win',
              sender: ownerId || undefined,
              receiver: winnerId,
              car: carIdStr,
              comment: `Congratulations — you won the auction for car ${carIdStr} with ${car.currentBid}.`,
            });
          } catch (err) {
            this.logger.error(`Failed to notify winner ${winnerId} for car ${carIdStr}: ${err?.message || err}`);
          }
        }

        // 3) Notify other participants (exclude owner and winner)
        const otherParticipantIds = participantIds.filter((id) => id !== ownerId && id !== winnerId);

        if (otherParticipantIds.length) {
          const notifyPromises = otherParticipantIds.map(pid =>
            this.notifications.create({
              type: 'End',
              sender: ownerId || undefined,
              receiver: pid,
              car: carIdStr,
              comment: `Auction ended for car ${carIdStr}. Final price: ${car.currentBid}`,
            }).catch(err => {
              this.logger.error(`Failed to notify participant ${pid} for car ${carIdStr}: ${err?.message || err}`);
              // swallow so Promise.allSettled won't fail
            }),
          );

          // Wait for them but do not fail the cron if some fail
          await Promise.allSettled(notifyPromises);
        }

      } catch (e) {
        // Catch per-car errors so the cron continues for other cars
        this.logger.error(`Error ending auction for car ${car._id?.toString()}: ${e?.message || e}`);
      }
    } // end for

    this.logger.log(`Processed ${processed} ended auctions`);
  }
}
