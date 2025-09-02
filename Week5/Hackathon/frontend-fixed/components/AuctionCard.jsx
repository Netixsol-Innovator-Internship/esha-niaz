// 'use client';
// import Link from 'next/link';
// import useCountdown from '../src/utils/useCountdown';
// import { currency } from '../src/utils/format';

// export default function AuctionCard({ auction }) {
//   const { text, isEnded } = useCountdown(auction?.endTime);
//   return (
//     <div className="card p-4">
//       <div className="flex items-center justify-between mb-2">
//         <span className={`text-xs px-2 py-1 rounded ${isEnded ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{isEnded ? 'ENDED' : 'LIVE'}</span>
//       </div>
//       <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-3">
//         <img src={auction?.imageUrl || '/placeholder-car.jpg'} alt={auction?.title || 'Car'} className="w-full h-full object-cover" />
//       </div>
//       <h3 className="font-semibold text-lg">{auction?.title || `${auction?.make || ''} ${auction?.model || ''}`}</h3>
//       <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
//         <div className="p-2 rounded-lg bg-gray-50">
//           <div className="text-gray-500">Current Bid</div>
//           <div className="font-semibold">{currency(auction?.currentBid || auction?.startingBid)}</div>
//         </div>
//         <div className="p-2 rounded-lg bg-gray-50">
//           <div className="text-gray-500">Ends In</div>
//           <div className="font-semibold">{text}</div>
//         </div>
//       </div>
//       <Link href={`/bids/${auction?._id || auction?.id}`} className="btn btn-primary w-full mt-4">Submit a Bid</Link>
//     </div>
//   );
// }


// 'use client';

// import Link from 'next/link';
// import useCountdown from '../src/utils/useCountdown';
// import { currency } from '../src/utils/format';

// // ✅ Import Swiper correctly
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';

// // ✅ Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// export default function AuctionCard({ auction }) {
//   const { text, isEnded } = useCountdown(auction?.endTime);

//   return (
//     <div className="card p-4">
//       {/* Status */}
//       <div className="flex items-center justify-between mb-2">
//         <span
//           className={`text-xs px-2 py-1 rounded ${
//             isEnded ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//           }`}
//         >
//           {isEnded ? 'ENDED' : 'LIVE'}
//         </span>
//       </div>

//       {/* Car Images with Swiper */}
//       <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-3">
//         {auction?.photos?.length > 0 ? (
//           <Swiper
//             modules={[Navigation, Pagination]}
//             navigation
//             pagination={{ clickable: true }}
//             className="w-full h-full"
//           >
//             {auction.photos.map((photo, idx) => (
//               <SwiperSlide key={idx}>
//                 <img
//                   src={photo}
//                   alt={`Car Image ${idx + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         ) : (
//           <img
//             src="/placeholder-car.jpg"
//             alt="Car"
//             className="w-full h-full object-cover"
//           />
//         )}
//       </div>

//       {/* Car Info */}
//       <h3 className="font-semibold text-lg">
//         {auction?.make} {auction?.carModel} ({auction?.year})
//       </h3>
//       <p className="text-gray-600 text-sm">{auction?.description}</p>

//       {/* Bidding Info */}
//       <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
//         <div className="p-2 rounded-lg bg-gray-50">
//           <div className="text-gray-500">Current Bid</div>
//           <div className="font-semibold">{currency(auction?.currentBid)}</div>
//         </div>
//         <div className="p-2 rounded-lg bg-gray-50">
//           <div className="text-gray-500">Max Bid</div>
//           <div className="font-semibold">{currency(auction?.maxBid)}</div>
//         </div>
//         <div className="p-2 rounded-lg bg-gray-50">
//           <div className="text-gray-500">Total Bids</div>
//           <div className="font-semibold">{auction?.totalBids}</div>
//         </div>
//         <div className="p-2 rounded-lg bg-gray-50">
//           <div className="text-gray-500">Ends In</div>
//           <div className="font-semibold">{text}</div>
//         </div>
//       </div>

//       {/* Bid Button */}
//       <Link
//         href={`/bids/${auction?._id}`}
//         className="btn btn-primary w-full mt-4"
//       >
//         Submit a Bid
//       </Link>
//     </div>
//   );
// }





'use client';

import Link from 'next/link';
import useCountdown from '../src/utils/useCountdown';
import { currency } from '../src/utils/format';

// ✅ Import Swiper correctly
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// ✅ Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function AuctionCard({ auction, showYourBid = false }) {
  const { text, isEnded } = useCountdown(auction?.endTime);

  return (
    <div className="card p-4">
      {/* Status */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xs px-2 py-1 rounded ${
            isEnded ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {isEnded ? 'ENDED' : 'LIVE'}
        </span>
      </div>

      {/* Car Images with Swiper */}
      <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-3">
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
            alt="Car"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Car Info */}
      <h3 className="font-semibold text-lg">
        {auction?.make} {auction?.carModel} ({auction?.year})
      </h3>
      <p className="text-gray-600 text-sm">{auction?.description}</p>

      {/* Bidding Info */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="text-gray-500">Current Bid</div>
          <div className="font-semibold">{currency(auction?.currentBid)}</div>
        </div>
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="text-gray-500">Max Bid</div>
          <div className="font-semibold">{currency(auction?.maxBid)}</div>
        </div>
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="text-gray-500">Total Bids</div>
          <div className="font-semibold">{auction?.totalBids}</div>
        </div>
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="text-gray-500">Ends In</div>
          <div className="font-semibold">{text}</div>
        </div>

        {/* ✅ Extra block only if showYourBid is true */}
        {showYourBid && auction?.yourBid && (
          <div className="col-span-2 p-2 rounded-lg bg-blue-50">
            <div className="text-blue-600">Your Latest Bid</div>
            <div className="font-semibold text-blue-800">
              {currency(auction?.yourBid)}
            </div>
          </div>
        )}
      </div>

      {/* Bid Button */}
      <Link
        href={`/bids/${auction?._id}`}
        className="btn btn-primary w-full mt-4"
      >
        Submit a Bid
      </Link>
    </div>
  );
}
