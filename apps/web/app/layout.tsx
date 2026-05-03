import type { Metadata } from "next";
import Link from "next/link"
import localFont from "next/font/local";
import { Noto_Sans_KR } from "next/font/google"
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
const noto = Noto_Sans_KR ({
  subsets: ["latin"],
  weight: ['400'],
  variable: "--font-noto"
})

export const metadata: Metadata = {
  title: "명예의 전당",
  description: "Hall of Fame",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 0.4,
  maximumScale: 4.0,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} ${noto.variable}`}>
        <nav style={{ padding: "16px", borderBottom: "1px solid #ddd"}}>
          <Link href="/" style={{ marginRight: 16 }}>Home</Link>
          <Link href="/hall-of-fame" style={{ marginRight: 16 }}>Hall of Fame</Link>
          <Link href="/ratings">Ratings</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}
