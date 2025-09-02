// 'use client';
// import { useParams } from 'next/navigation';
// import { useAuctionByIdQuery, useBidsForAuctionQuery, usePlaceBidMutation } from '../../../src/redux/api';
// import { useState } from 'react';
// import { currency } from '../../../src/utils/format';
// import { toast } from '../../../components/Toaster';

// export default function BidDetailsPage() {
//   const { id } = useParams();
//   const { data: auction, isFetching } = useAuctionByIdQuery(id);
//   const { data: bids } = useBidsForAuctionQuery(id);
//   const [amount, setAmount] = useState('');
//   const [placeBid, { isLoading }] = usePlaceBidMutation();

//   const submitBid = async (e) => {
//     e.preventDefault();
//     try {
//       await placeBid({ carId: id, amount: Number(amount) }).unwrap();
//       setAmount('');
//       toast('Bid submitted');
//     } catch (err) {
//       toast(err?.data?.message || 'Bid failed');
//     }
//   };

//   return (
//     <div className="container py-8">
//       {isFetching && <div>Loading...</div>}
//       {auction && (
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="md:col-span-2 card overflow-hidden">
//             <div className="aspect-[16/9] bg-gray-100"><img src={auction.imageUrl||'/placeholder-car.jpg'} className="w-full h-full object-cover" /></div>
//             <div className="p-4">
//               <h1 className="text-2xl font-semibold">{auction.title}</h1>
//               <div className="text-gray-600">{auction.description}</div>
//             </div>
//           </div>
//           <div className="space-y-6">
//             <div className="card p-4">
//               <div className="text-sm text-gray-500">Current Bid</div>
//               <div className="text-2xl font-bold">{currency(auction.currentBid || auction.startingBid)}</div>
//               <form onSubmit={submitBid} className="mt-4 space-y-3">
//                 <div><label>Bid Amount</label><input className="input" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} required /></div>
//                 <button disabled={isLoading} className="btn btn-primary w-full">{isLoading ? 'Submitting...' : 'Add Bid'}</button>
//               </form>
//             </div>

//             <div className="card p-4">
//               <div className="font-semibold mb-2">Bids ({(bids||[]).length})</div>
//               <div className="max-h-80 overflow-auto divide-y">
//                 {(bids||[]).map(b=> (
//                   <div key={b._id||b.id} className="py-2 text-sm flex items-center justify-between">
//                     <div>{b.user?.fullName || b.user?.username}</div>
//                     <div className="font-semibold">{currency(b.amount)}</div>
//                     <div className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleString()}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




'use client';

import { useParams } from 'next/navigation';
import {
  useAuctionByIdQuery,
  useBidsForAuctionQuery,
  usePlaceBidMutation,
} from '../../../src/redux/api';
import { useState } from 'react';
import { currency } from '../../../src/utils/format';
import { toast } from '../../../components/Toaster';
import useCountdown from '../../../src/utils/useCountdown';

// ✅ Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BidDetailsPage() {
  
  const { id } = useParams();
  const { data: auction, isFetching } = useAuctionByIdQuery(id);
  const { data: bids } = useBidsForAuctionQuery(id);
  const [amount, setAmount] = useState('');
  const [placeBid, { isLoading }] = usePlaceBidMutation();

  const { text: countdown, isEnded } = useCountdown(auction?.endTime);

  const submitBid = async (e) => {
    e.preventDefault();
    try {
      await placeBid({ carId: id, amount: Number(amount) }).unwrap();
      setAmount('');
      toast('Bid submitted');
    } catch (err) {
      toast(err?.data?.message || 'Bid failed');
    }
  };

  return (
    <div className="container py-8">
      {isFetching && <div>Loading...</div>}

      {auction && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Car details + images */}
          <div className="md:col-span-2 card overflow-hidden">
            <div className="aspect-[16/9] bg-gray-100">
              {auction?.photos?.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="w-full h-full"
                >
                  {auction.photos.map((photo, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={photo}
                        alt={`Car Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img
                  src="/placeholder-car.jpg"
                  className="w-full h-full object-cover"
                  alt="Car"
                />
              )}
            </div>

            <div className="p-4 space-y-2">
              <h1 className="text-2xl font-semibold">
                {auction.make} {auction.carModel} ({auction.year})
              </h1>
              <p className="text-gray-600">{auction.description}</p>

              {/* Auction Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-4">
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="text-gray-500">Current Bid</div>
                  <div className="font-semibold">
                    {currency(auction?.currentBid || auction?.startingBid)}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="text-gray-500">Max Bid</div>
                  <div className="font-semibold">{currency(auction?.maxBid)}</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="text-gray-500">Total Bids</div>
                  <div className="font-semibold">{(bids || []).length}</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="text-gray-500">Ends In</div>
                  <div
                    className={`font-semibold ${
                      isEnded ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {countdown}
                  </div>
                </div>
              </div>

              {/* Top Bidder */}
{/* Top Bidder */}
{/* Top Bidder */}
<div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
  <div className="text-gray-500 text-sm">Top Bidder</div>
  <div className="font-semibold">
    {(() => {
      if (!bids || bids.length === 0) return 'No bids yet';
      // Find the bid with the highest amount
      const topBid = bids.reduce((max, b) => (b.amount > max.amount ? b : max), bids[0]);
      return topBid.user?.fullName || topBid.user?.username || 'No name';
    })()}
  </div>
</div>
            </div>
          </div>

          {/* Bidding section */}
          <div className="space-y-6">
            {/* Place Bid Form */}
            <div className="card p-4">
              <div className="text-sm text-gray-500">Current Bid</div>
              <div className="text-2xl font-bold">
                {currency(auction.currentBid || auction.startingBid)}
              </div>
              <form onSubmit={submitBid} className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium">Bid Amount</label>
                  <input
                    className="input w-full"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <button
                  disabled={isLoading || isEnded}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? 'Submitting...' : 'Add Bid'}
                </button>
              </form>
            </div>

            {/* Bidders list */}
            <div className="card p-4">
              <div className="font-semibold mb-2">
                Bids ({(bids || []).length})
              </div>
              <div className="max-h-80 overflow-auto divide-y">
                {(bids || []).map((b) => (
                  <div
                    key={b._id || b.id}
                    className="py-2 text-sm flex items-center justify-between"
                  >
                    <div>{b.user?.fullName || b.user?.username}</div>
                    <div className="font-semibold">{currency(b.amount)}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(b.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
