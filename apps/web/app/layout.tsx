import type { Metadata } from "next";
import localFont from "next/font/local";
import { Noto_Sans_KR, Playfair_Display, Noto_Serif_KR, Inter, Lora } from "next/font/google"
import "./globals.css";
import Navbar from "./Navbar"

// #region Fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
const futura = localFont({
  src: "./fonts/FuturaCyrillicMedium.woff",
  variable: "--font-futura"
})
const noto = Noto_Sans_KR ({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto"
});
const playfair = Playfair_Display ({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair"
})
const notoSerif = Noto_Serif_KR ({
  weight: ["400", "700"],
  variable: "--font-notoSerif"
})
const inter = Inter ({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter"
})
const lora = Lora ({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lora"
})
// #endregion

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
        ${noto.variable} ${playfair.variable} ${notoSerif.variable}
        ${futura.variable} ${inter.variable} ${lora.variable}`}>

      <Navbar/>

      {children}
      </body>
    </html>
  );
}
