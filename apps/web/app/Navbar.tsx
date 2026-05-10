'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiInstagram, SiKakaotalk } from 'react-icons/si';
import { FiMenu, FiX } from 'react-icons/fi';
import Image from "next/image"

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // ESC로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <nav className="border-b border-gray-300 px-4 py-3 relative z-50">
        <div className="text-white grid grid-cols-[33%_33%_34%] items-center">
          {/* 로고 */}
          <div className="grid grid-cols-[55%_1fr]">
            <Link href="/" className="flex flex-row justify-start md:hover:brightness-50 transition-all duration-300 cursor-pointer
              active:brightness-50">
              <Image 
              src="/image/svg_logo.svg"
              alt="ChessClub Logo"
              width={24}
              height={18}
              className="rounded-sm mr-1"
              ></Image>
              <div className="font-noto font-semibold text-lg">
                ChessClub
              </div>
            </Link>

            <div>{}</div>
          </div>

          {/* 데스크탑 메뉴 */}
          <div className="invisible md:visible md:flex justify-center gap-8 font-normal font-notoSerif transition-all duration-300">
            <Link href="/hall-of-fame" className="inline-block md:hover:brightness-50">Hall of Fame</Link>
            <Link href="/ratings" className="inline-block md:hover:brightness-50">Ratings</Link>
          </div>

          {/* 데스크탑 소셜 아이콘 */}
          <div className="flex flex-row justify-end gap-4 mr-2">
            <a href="https://www.instagram.com/chessclubsnu/"
                target="_blank"
                rel="noreferrer" 
                aria-label="Instagram"
                style={{ color: "#E1306C" }}
                className="hidden md:flex flex-row md:hover:brightness-50 transition-all duration-300 cursor-pointer">
              <SiInstagram size={26} />
            </a>
            <a href="http://pf.kakao.com/_bsqzX/chat"
                target="_blank"
                rel="noreferrer" 
                aria-label="카톡채널" 
                style={{ color: "#FEE500", backgroundColor: "#3C1E1E", 
                    borderRadius: "4px", padding: "2px" }} 
                className="hidden md:flex flex-row md:hover:brightness-50 transition-all duration-300 cursor-pointer">
              <SiKakaotalk size={22} />
            </a>

            {/* 모바일 햄버거 버튼 */}
            <button
              className="md:hidden relative w-10 h-10 flex items-center justify-end cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <span
                className={`absolute transition-all duration-300 ${
                  open ? 'rotate-45' : '-translate-y-2'
                } w-6 h-0.5 bg-white`}
              />
              <span
                className={`absolute transition-all duration-300 ${
                  open ? 'opacity-0' : ''
                } w-6 h-0.5 bg-white`}
              />
              <span
                className={`absolute transition-all duration-300 ${
                  open ? '-rotate-45' : 'translate-y-2'
                } w-6 h-0.5 bg-white`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* 배경 dim */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* 슬라이드 메뉴 */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black z-50 shadow-lg
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 flex flex-col gap-6 font-medium">

          {/* 닫기 버튼 */}
          <button
            className="text-white self-end text-2xl cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <FiX />
          </button>

          <Link href="/" onClick={() => setOpen(false)} className="text-white active:text-gray-500 font-notoSerif">
            Home
          </Link>
          <Link href="/hall-of-fame" onClick={() => setOpen(false)} className="text-white active:text-gray-500 font-notoSerif">
            Hall of Fame
          </Link>
          <Link href="/ratings" onClick={() => setOpen(false)} className="text-white active:text-gray-500 font-notoSerif">
            Ratings
          </Link>

          <div className="flex gap-4 mt-4">
            <a href="https://www.instagram.com/chessclubsnu/"
                target="_blank"
                rel="noreferrer" 
                aria-label="Instagram"
                className="transition-all duration-300 active:brightness-50"
                style={{ color: "#E1306C", display: "flex" }}>
              <SiInstagram size={26} />
            </a>
            <a href="http://pf.kakao.com/_bsqzX/chat"
                target="_blank"
                rel="noreferrer" 
                aria-label="카톡채널" 
                className="transition-all duration-300 active:brightness-50"
                style={{ color: "#FEE500", display: "flex", backgroundColor: "#3C1E1E", 
                    borderRadius: "4px", padding: "2px" }} >
              <SiKakaotalk size={22} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}