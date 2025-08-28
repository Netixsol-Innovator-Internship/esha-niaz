import './globals.css';
import Providers from './../components/Providers';
import Header from '../components/Header';

export const metadata = {
  title: 'Real-time Comments',
  description: 'Comment system with RTK Query + Socket.IO',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
