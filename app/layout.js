export const metadata = {
  title: 'Her Name Was Esther',
  description: 'Join 15 million voices worldwide in unity and solidarity.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://tailwindcss.com"></script>
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}

