import './globals.css';
import { Cinzel, Cormorant_Garamond } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-cinzel',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
});

export const metadata = {
  title: 'HER NAME WAS ESTHER — March 22, 2027',
  description: 'On March 22, 2027, 15 million voices unite worldwide in fasting, remembrance, and solidarity.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body className="bg-gradient-to-br from-indigo-100 via-purple-100 to-amber-100 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
