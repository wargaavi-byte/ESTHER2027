export const metadata = {
  title: 'Her Name Was Esther — March 22, 2027',
  description: 'On March 22, 2027, 15 million voices unite worldwide in fasting, remembrance, and solidarity.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}


