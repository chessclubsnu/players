"use client"
import { useEffect, useRef, useState } from "react";

interface ScrollToTopButtonProps {
  /** 버튼이 활성화되는 최소 스크롤 거리 (px). 기본값: 300 */
  scrollThreshold?: number;
  /** 스크롤 멈춤 판정 시간 (ms). 기본값: 1000 */
  scrollIdleDelay?: number;
  /** 버튼 레이블 텍스트. 기본값: "맨 위로" */
  label?: string;
  /** 버튼 하단 여백. 기본값: "2rem" */
  bottom?: string;
}

export default function ScrollToTopButton({
  scrollThreshold = 300,
  scrollIdleDelay = 1500,
  label = "",
  bottom = "2rem",
}: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isFarEnough = window.scrollY >= scrollThreshold;

      if (isFarEnough) {
        setVisible(true);
      }

      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      scrollTimerRef.current = setTimeout(() => {
        setVisible(false);
      }, scrollIdleDelay);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [scrollThreshold, scrollIdleDelay]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="맨 위로 가기"
      style={{ bottom }}
      className={[
        "fixed left-1/2 z-50",
        "-translate-x-1/2",
        "flex items-center gap-2",
        "bg-neutral-900 text-white",
        "px-5 py-3 rounded-full",
        "text-sm font-medium",
        "shadow-lg border border-neutral-700",
        "cursor-pointer",
        "transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      {label}
    </button>
  );
}
