
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Providers from '../lib/Providers';

export const metadata = { title: 'Auth + RTK Query (JSX)', description: 'Next.js + RTK Query auth boilerplate' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
