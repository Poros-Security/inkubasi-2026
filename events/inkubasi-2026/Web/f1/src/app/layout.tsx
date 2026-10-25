export const metadata = {
  title: 'Next.js CTF Challenge',
  description: 'Can you leak the server function?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0d0d0f", color: "#e0e0e0" }}>
        {children}
      </body>
    </html>
  )
}
