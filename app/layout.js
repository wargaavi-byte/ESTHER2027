import './globals.css';

export const metadata = {
  title: 'Her Name Was Esther — March 22, 2027',
  description: 'On March 22, 2027, 15 million voices unite worldwide in fasting, remembrance, and solidarity.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-100 via-purple-100 to-amber-100 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
