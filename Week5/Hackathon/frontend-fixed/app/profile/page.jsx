'use client';
import { useState, useEffect } from 'react';
import React from "react";
import { useMeQuery, useUpdateMeMutation, useMyCarsQuery, useMyBidsQuery, useEndAuctionMutation } from '../../src/redux/api';
import { toast } from '../../components/Toaster';
import SellCarForm from '../../components/SellCarForm';
// import { useMyBidsQuery } from "../../src/redux/api";
import AuctionCard from "../../components/AuctionCard";

export default function ProfilePage() {
  const [tab, setTab] = useState('info');
    // ✅ callback for after car submission
  const handleCarSubmitted = () => {
    toast("Car listed successfully! 🎉");
    setTab("cars"); // switch back to My Cars
    
  };
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="flex gap-2 mb-6">
        <button onClick={()=>setTab('info')} className="btn btn-primary">Personal Info</button>
        <button onClick={()=>setTab('cars')} className="btn btn-primary">My Cars</button>
        <button onClick={()=>setTab('bids')} className="btn btn-primary">My Bids</button>
        <button onClick={()=>setTab('sell')} className="btn btn-primary">Sell Your Car</button> 

      </div>

      {tab === 'info' && <PersonalInfo />}
      {tab === 'cars' && <MyCars />}
      {tab === 'bids' && <MyBids />}
      {/* {tab === 'sell' && <SellCarForm onSubmitted={handleCarSubmitted} />} ✅ pass callback */}
      {tab === 'sell' && <SellCarForm onSubmitted={handleCarSubmitted} />}
    </div>
  );
}

function PersonalInfo() {
const { data: me, isLoading } = useMeQuery();
  const [updateMe] = useUpdateMeMutation();

  const [form, setForm] = useState({});
  const [editing, setEditing] = useState({});

  // Initialize form with required fields
  useEffect(() => {
    if (me) {
      setForm({
        fullName: me.fullName || '',
        email: me.email || '',
        phone: me.phone || '',
        mobileNumber: me.mobileNumber || '',
        nationality: me.nationality || '',
        idType: me.idType || '',
        idNo: me.idNo || '',
        address1: me.address1 || '',
        address2: me.address2 || '',
        city: me.city || '',
        country: me.country || '',
        landline: me.landline || '',
        poBox: me.poBox || '',
        trafficInfoType: me.trafficInfoType || '',
        trafficFileNo: me.trafficFileNo || '',
        plateState: me.plateState || '',
        plateCode: me.plateCode || '',
        plateNumber: me.plateNumber || '',
        driverLicenseNumber: me.driverLicenseNumber || '',
        issueCity: me.issueCity || '',
      });
    }
  }, [me]);

  const handleSave = async (field) => {
    try {
      const payload = { [field]: form[field] };
      await updateMe(payload).unwrap();
      toast(`${field} updated successfully`);
      setEditing((prev) => ({ ...prev, [field]: false }));
    } catch (err) {
      toast(err?.data?.message || 'Update failed');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const fields = [
    'fullName','email','phone','mobileNumber','nationality','idType','idNo',
    'address1','address2','city','country','landline','poBox',
    'trafficInfoType','trafficFileNo','plateState','plateCode','plateNumber',
    'driverLicenseNumber','issueCity'
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">{field}</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className={`input w-full ${editing[field] ? 'border-blue-500' : 'border-gray-300'} `}
                value={form[field]}
                disabled={!editing[field]}
                onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
              />
              {editing[field] ? (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleSave(field)}
                >
                  Save
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setEditing((prev) => ({ ...prev, [field]: true }))}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyCars() {
  const { data } = useMyCarsQuery();
  const [endAuction] = useEndAuctionMutation();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {(data || []).map(car => (
        <div key={car._id} className="card p-4">
          {/* Car Image */}
          <div className="aspect-[16/9] bg-gray-100">
            <img
              src={(car.photos && car.photos[0]) || '/placeholder-car.jpg'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Car Info */}
          <h3 className="font-semibold mt-3">
            {car.make} {car.carModel} ({car.year})
          </h3>
          <div className="mt-2 space-y-1 text-sm">
            <div>Status: {car.status}</div>
            <div>Total Bids: {car.totalBids}</div>
            <div>Current Bid: ${car.currentBid}</div>
            {car.topBidder && (
              <div>Winning: {car.topBidder.fullName}</div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-3">
            {car.status === "ended" ? (
              <button
                className="btn w-full bg-red-500 text-white cursor-not-allowed"
                disabled
              >
                SOLD
              </button>
            ) : (
              <button
                onClick={() => endAuction(car._id)}
                className="btn btn-primary w-full"
              >
                End Bid
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


// function MyBids() {
//   const { data } = useMyBidsQuery();
//   return (
//     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
//       {(data||[]).map(b=> (
//         <div key={b._id||b.id} className="card p-4">
//           <div className="aspect-[16/9] bg-gray-100"><img src={b.car?.imageUrl||'/placeholder-car.jpg'} className="w-full h-full object-cover" /></div>
//           <h3 className="font-semibold mt-3">{b.car?.title}</h3>
//           <div>Your bid: {b.amount}</div>
//         </div>
//       ))}
//     </div>
//   );
// }


function MyBids() {
 const { data: bids = [], isLoading } = useMyBidsQuery();

  // memoize grouping for performance
  const latestBidsByCar = React.useMemo(() => {
    const map = new Map();

    for (const bid of bids) {
      // bid.car is expected to be populated object; fallback to id if not
      const car = bid.car;
      const carId = car?._id || car?.id || String(bid.car);

      if (!carId) continue;

      const existing = map.get(carId);
      // choose bid with later createdAt (or fallback to ObjectId timestamp)
      const bidTime = bid.createdAt ? new Date(bid.createdAt).getTime() : 0;
      const existingTime = existing && existing.createdAt ? new Date(existing.createdAt).getTime() : 0;

      if (!existing || bidTime >= existingTime) {
        map.set(carId, bid);
      }
    }

    // return array of latest bid objects (one per car)
    return Array.from(map.values());
  }, [bids]);

  if (isLoading) return <div>Loading...</div>;

  if (!latestBidsByCar.length) {
    return <p className="text-gray-500">You haven’t placed any bids yet.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {latestBidsByCar.map((b) => {
        // It’s safe to assume b.car is populated by backend.
        // Build an auction-like object and inject your latest bid amount
        const carObj = b.car || {};
        const auction = {
          ...carObj,
  currentBid: b.currentBid || carObj.currentBid,
  maxBid: b.maxBid || carObj.maxBid,
  totalBids: b.totalBids || carObj.totalBids,
  yourBid: b.amount,
        };

        return (
          <AuctionCard
            key={carObj._id || carObj.id || b._id}
            auction={auction}
            showYourBid={true}
          />
        );
      })}
    </div>
  );
}


// function MyBids() {
//   const { data: bids = [], isLoading } = useMyBidsQuery();

//   // Memoize latest bid per car with totalBids calculation
//   const latestBidsByCar = React.useMemo(() => {
//     const map = new Map();

//     for (const bid of bids) {
//       const car = bid.car;
//       const carId = car?._id || car?.id || String(bid.car);
//       if (!carId) continue;

//       const existing = map.get(carId);
//       const bidTime = bid.createdAt ? new Date(bid.createdAt).getTime() : 0;
//       const existingTime = existing && existing.createdAt ? new Date(existing.createdAt).getTime() : 0;

//       if (!existing || bidTime >= existingTime) {
//         // Count total bids for this car
//         const totalBidsForCar = bids.filter(
//           (b2) => (b2.car?._id || String(b2.car)) === carId
//         ).length;

//         map.set(carId, { ...bid, totalBids: totalBidsForCar });
//       }
//     }

//     return Array.from(map.values());
//   }, [bids]);

//   if (isLoading) return <div>Loading...</div>;

//   if (!latestBidsByCar.length) {
//     return <p className="text-gray-500">You haven’t placed any bids yet.</p>;
//   }

//   return (
//     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
//       {latestBidsByCar.map((b) => {
//         const carObj = b.car || {};
//         const auction = {
//           ...carObj,
//           currentBid: b.currentBid || carObj.currentBid,
//           maxBid: b.maxBid || carObj.maxBid,
//           totalBids: carObj.totalBids || 0,// now correctly calculated
//           yourBid: b.amount,
//         };

//         return (
//           <AuctionCard
//             key={carObj._id || carObj.id || b._id}
//             auction={auction}
//             showYourBid={true}
//           />
//         );
//       })}
//     </div>
//   );
// }

// export default MyBids;