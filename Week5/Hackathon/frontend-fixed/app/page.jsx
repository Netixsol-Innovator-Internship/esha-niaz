'use client';
import Filters from '../components/Filters';
import AuctionCard from '../components/AuctionCard';
import { useLiveAuctionsQuery } from '../src/redux/api';

export default function HomePage() {
  const { data, isFetching } = useLiveAuctionsQuery();
  return (
    <div>
      <div className="h-[360px] bg-[url('/hero-car.jpg')] bg-cover bg-center flex items-center">
        <div className="container text-black">
          <h1 className="text-4xl font-bold">Find your dream car</h1>
          <p className="mt-2">Live auctions, real-time bids</p>
          <div className="mt-6"><Filters onApply={()=>{}} /></div>
        </div>
      </div>
      <section className="container -mt-6">
        <div className="bg-white p-6 rounded-b-2xl">
          <h2 className="text-2xl font-semibold mb-4">Live Auction</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(data||[]).map(a=> <AuctionCard key={a._id||a.id} auction={a} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
