'use client';
import { useLiveAuctionsQuery } from '../../src/redux/api';
import AuctionCard from '../../components/AuctionCard';

export default function LiveAuctions() {
  const { data, isFetching } = useLiveAuctionsQuery();
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Live Auctions</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {(data||[]).map(a=> <AuctionCard key={a._id||a.id} auction={a} />)}
      </div>
    </div>
  );
}
