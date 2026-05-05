import type { Metadata } from "next";
import Link from "next/link"
import { SiInstagram, SiKakaotalk } from "react-icons/si";
import localFont from "next/font/local";
import { Noto_Sans_KR, Playfair_Display, Noto_Serif_KR } from "next/font/google"
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
});
const playfair = Playfair_Display ({
  subsets: ["latin"],
  weight: ['400'],
  variable: "--font-playfair"
})
const notoSerif = Noto_Serif_KR ({
  weight: ['400'],
  variable: "--font-notoSerif"
})

export const metadata: Metadata = {
  title: "체스클럽",
  description: "ChessClub",
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
      <body className={`${geistSans.variable} ${geistMono.variable} 
        ${noto.variable} ${playfair.variable} ${notoSerif.variable}`}>

        <nav style={{ 
          padding: "15px 24px", 
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-notoSans)",
        }}>
          {/* 왼쪽 메뉴 그룹 */}
          <div style={{ display: "flex", gap: "10px", fontWeight: 500 }}>
            <Link href="/" style={{ marginRight: 16 }}>Home</Link>
            <Link href="/hall-of-fame" style={{ marginRight: 16 }}>Hall of Fame</Link>
            <Link href="/ratings">Ratings</Link>
          </div>

          {/* 오른쪽 소셜 링크(icon) 그룹 */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center", marginRight: "12px" }}>
            <a 
              href="https://www.instagram.com/chessclubsnu/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              style={{ color: "#E1306C", display: "flex" }}
            >
              <SiInstagram size={26} />
            </a>
            <a 
              href="http://pf.kakao.com/_bsqzX/chat"
              target="_blank"
              rel="noreferrer"
              aria-label="카톡채널"
              style={{ color: "#FEE500", display: "flex", backgroundColor: "#3C1E1E", 
                borderRadius: "4px", padding: "2px" }}
            >
              <SiKakaotalk size={22} />
            </a>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
