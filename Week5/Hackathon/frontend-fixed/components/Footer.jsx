export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-16">
      <div className="container py-8 text-sm">
        CarBid © {new Date().getFullYear()} - All rights reserved.
      </div>
    </footer>
  );
}
