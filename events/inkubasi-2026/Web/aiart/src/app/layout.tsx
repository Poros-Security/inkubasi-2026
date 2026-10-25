import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Art",
  description: "Your AI Art, Crafted and Framed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
