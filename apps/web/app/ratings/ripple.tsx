import { useCallback } from "react";

// #region Ripple effect
  export default function useRipple(color = "rgba(255,255,255,0.35)") {
    return useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const el = e.currentTarget;
            el.querySelectorAll(".ripple-effect").forEach((r) => r.remove());

            const rect = el.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const span = document.createElement("span");
            // Tailwind v4 유틸리티를 className으로 적용
            span.className =
                "absolute rounded-full pointer-events-none animate-ripple";
            Object.assign(span.style, {
                width: `${size}px`,
                height: `${size}px`,
                left: `${x}px`,
                top: `${y}px`,
                background: color,
                transform: "scale(0)",
                opacity: "1",
                transition: "transform 600ms ease-out",
            });

            el.appendChild(span);
            span.addEventListener("animationend", () => span.remove());

            // 다음 프레임에 scale 적용 (트랜지션 트리거)
            requestAnimationFrame(() => {
                span.style.transform = "scale(4)";
            });

            const fadeOut = () => {
                span.style.transition = "transform 400ms ease-out, opacity 200ms ease-out";
                span.style.opacity = "0";
                span.addEventListener("transitionend", () => span.remove(), { once: true });
                document.removeEventListener("mouseup", fadeOut);
                el.removeEventListener("mouseleave", fadeOut);
            };

            document.addEventListener("mouseup", fadeOut);
            el.addEventListener("mouseleave", fadeOut);  // 드래그 후 이탈 케이스도 처리
        },
        [color]
    );
    }
  // #endregion