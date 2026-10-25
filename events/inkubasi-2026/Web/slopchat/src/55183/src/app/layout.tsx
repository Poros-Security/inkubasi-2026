export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#d9dbd5', fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
