import { ReactNode } from 'react';
import '../styles/main.scss';
import Header from './components/Header';
import Footer from './components/Footer'
import ClientProviders from './components/ClientProviders';

export const metadata = {
  title: 'Digital Heaven Store',
  description: 'Магазин техники на любой вкус',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jura:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientProviders>
          <Header />
          <main>{children}</main>
        </ClientProviders>
        <Footer />
      </body>
    </html>
  );
}
