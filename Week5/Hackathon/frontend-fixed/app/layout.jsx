import './globals.css';
import Providers from '../src/providers/Providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toaster from '../components/Toaster';
// import Toaster from '../components/Toaster';
import ClientWrapper from '../components/ClientWrapper';

export const metadata = { title: 'Car Auction' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="min-h-[70vh]">{children}
                    <ClientWrapper>
          <Toaster />  {/* Now the Toaster runs fully as a client component */}
        </ClientWrapper>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
