'use client';

import styles from './renderbar.module.css';
import { useState, useRef, useEffect, useCallback } from 'react';

type ProgressRow = {
  period: string;
  rating: number;
  white: { win: number; draw: number; loss: number };
  black: { win: number; draw: number; loss: number };
};

type Props = {
  data: ProgressRow[];
};

// #region Process Periods
function sortPeriod(a: string, b: string) {
  const parse = (p: string) => {
    const yearMonth = p.slice(0, 6);
    const half = p.slice(6);
    return Number(yearMonth) * 10 + (half === 'A' ? 0 : 1);
  };
  return parse(a) - parse(b);
}

function formatPeriod(value: string) {
  const year = value.slice(0, 4);
  const month = value.slice(4, 6);
  const half = value.slice(6);

  const monthLabel = new Date(Number(year), Number(month) - 1)
    .toLocaleString('en-US', { month: 'short' });

  const halfLabel = half === 'A' ? '1st Half' : '2nd Half';

  return {
    text: `${monthLabel} ${year}, ${halfLabel}`,
    month: Number(month),
    monthLabel,
    year,
    halfLabel,
  };
}

function fillMissingPeriods(data: any[]) {
  function parsePeriod(p: string) {
    const year = Number(p.slice(0, 4));
    const month = Number(p.slice(4, 6));
    const half = p.slice(6) === 'A' ? 0 : 1;
    return year * 100 + month * 10 + half;
  }

  function formatPeriodCode(v: number) {
    const year = Math.floor(v / 100);
    const month = Math.floor((v % 100) / 10);
    const half = v % 10 === 0 ? 'A' : 'B';
    return `${year}${String(month).padStart(2, '0')}${half}`;
  }

  function nextPeriod(p: number) {
    const year = Math.floor(p / 100);
    const monthHalf = p % 100;
    let month = Math.floor(monthHalf / 10);
    let half = monthHalf % 10;

    if (half === 0) return year * 100 + month * 10 + 1;

    month += 1;
    half = 0;

    if (month > 12) return (year + 1) * 100 + 1 * 10 + 0;
    return year * 100 + month * 10 + 0;
  }

  const sorted = [...data].sort(
    (a, b) => parsePeriod(a.period) - parsePeriod(b.period)
  );

  const result: any[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = sorted[i];
    const next = sorted[i + 1];
    const currCode = parsePeriod(curr.period);
    const nextCode = parsePeriod(next.period);

    result.push(curr);

    let cursor = currCode;

    while (nextCode > nextPeriod(cursor)) {
      cursor = nextPeriod(cursor);
      result.push({
        period: formatPeriodCode(cursor),
        rating: curr.rating,
        white: { win: 0, draw: 0, loss: 0 },
        black: { win: 0, draw: 0, loss: 0 },
      });
    }
  }

  result.push(sorted[sorted.length - 1]);
  return result;
}

function generateTicks(data: any[]) {
  const min = Math.min(...data.map((d) => d.rating));
  const max = Math.max(...data.map((d) => d.rating));
  const start = Math.floor(min / 50) * 50;
  const end = Math.ceil(max / 50) * 50;
  const ticks = [];
  for (let v = start; v <= end; v += 50) ticks.push(v);
  return ticks;
}
// #endregion

// #region CustomTooltip
function CustomTooltip({
  payload,
  svgX,
  svgY,
  svgWidth,
  svgHeight,
  onClose,
}: {
  payload: ProgressRow;
  svgX: number;
  svgY: number;
  svgWidth: number;
  svgHeight: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  // dot의 SVG 좌표 → 컨테이너 내 % 위치로 변환 후 툴팁 위치 결정
  useEffect(() => {
    if (!ref.current) return;

    const tw = ref.current.offsetWidth;
    const th = ref.current.offsetHeight;

    // SVG 내 비율 → 픽셀
    const pctX = svgX / svgWidth;
    const pctY = svgY / svgHeight;

    const parent = ref.current.parentElement;
    if (!parent) return;

    const pw = parent.clientWidth;
    const ph = parent.clientHeight;

    let left = pctX * pw - tw / 2;
    let top = pctY * ph - th - 16;

    // 경계 보정
    if (left < 4) left = 4;
    if (left + tw > pw - 4) left = pw - tw - 4;
    if (top < 4) top = pctY * ph + 16; // 위 공간 없으면 아래로

    setPos({ left, top });
  }, [svgX, svgY, svgWidth, svgHeight]);

  const period = formatPeriod(payload.period);

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: pos ? pos.left : -9999,
        top: pos ? pos.top : -9999,
        zIndex: 10,
      }}
      className="bg-white/70 text-black rounded-lg font-inter leading-normal shadow-[0_4px_12px_rgba(116,116,116,0.71)]
                 px-1.5 py-1.5 text-xs md:text-base lg:text-lg min-w-20
                 md:px-3 md:py-2.5 md:text-3 md:min-w-40"
    >
      {/* period */}
      <div className="font-semibold mb-0 md:mb-0.5">{period.text}</div>

      {/* rating */}
      <div className="font-medium">Rating: {payload.rating}</div>

      <hr className="border-black my-0.5 md:my-1" />

      {/* White */}
      <div className="mb-0">
        <div className="flex items-center gap-1 md:gap-2 mt-0">
          <div className="w-2 h-2 bg-white border-black border-1"></div>
          <span>W: {payload.white.win + ","}</span>
          <span>D: {payload.white.draw + ","}</span>
          <span>L: {payload.white.loss}</span>
        </div>
      </div>

      {/* Black */}
      <div className="mt-0 md:mt-0">
        <div className="flex items-center gap-1 md:gap-2 mt-0">
          <div className="w-2 h-2 bg-black border-black border-1"></div>
          <span>W: {payload.black.win + ","}</span>
          <span>D: {payload.black.draw + ","}</span>
          <span>L: {payload.black.loss}</span>
        </div>
      </div>
    </div>
  );
}
// #endregion

export default function ProgressGraphics({ data }: Props) {
  const completeData = fillMissingPeriods(data);
  const ticks = generateTicks(data);

  // SVG 논리 좌표계
  const W = 400;
  const H = 400; // aspect=1 이므로 W==H
  const pad = { top: 20, right: 20, bottom: 60, left: 48 };

  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const n = completeData.length;
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];

  // 좌표 변환
  const toX = useCallback(
    (i: number) =>
      n <= 1
        ? pad.left + innerW / 2
        : pad.left + (i / (n - 1)) * innerW,
    [n, innerW, pad.left]
  );

  const toY = useCallback(
    (v: number) =>
      pad.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH,
    [innerH, yMin, yMax, pad.top]
  );

  // polyline points
  const polylinePoints = completeData
    .map((d, i) => `${toX(i)},${toY(d.rating)}`)
    .join(' ');

  // 툴팁 상태: { index, svgX, svgY }
  const [activeTooltip, setActiveTooltip] = useState<{
    index: number;
    svgX: number;
    svgY: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleDotClick = (
    e: React.MouseEvent,
    index: number,
    svgX: number,
    svgY: number
  ) => {
    e.stopPropagation();
    setActiveTooltip((prev) =>
      prev?.index === index ? null : { index, svgX, svgY }
    );
  };

  const handleChartClick = () => {
    setActiveTooltip(null);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-[full]"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        position: 'relative',
      }}
    >
      <div className="text-xl md:text-2xl font-notoSerif text-center mb-2">Progress</div>

      {/* SVG 래퍼: aspect-ratio 1/1 로 반응형 */}
      <div style={{ width: '90%', aspectRatio: '1 / 1', position: 'relative', left: '2%' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="100%"
          onClick={handleChartClick}
          style={{ display: 'block', overflow: 'visible', }}
        >
          {/* ── Grid ── */}
          {ticks.map((t) => (
            <line
              key={t}
              x1={pad.left}
              x2={W - pad.right}
              y1={toY(t)}
              y2={toY(t)}
              stroke="#555"
              strokeWidth={1}
              strokeDasharray="3 3"
              pointerEvents="none"
            />
          ))}

          {/* ── YAxis ticks ── */}
          {ticks.map((t) => (
            <text
              key={t}
              x={pad.left - 8}
              y={toY(t) + 5}
              textAnchor="end"
              fill="#ccc"
              fontSize={14}
              fontFamily="var(--font-noto)"
              pointerEvents="none"
            >
              {t}
            </text>
          ))}

          {/* ── Line ── */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#e2d849"
            strokeWidth={3}
            pointerEvents="none"
          />

          {/* ── XAxis ticks ── */}
          {completeData.map((d, i) => {
            const { year, monthLabel, halfLabel } = formatPeriod(d.period);
            return (
              <text
                key={i}
                x={toX(i)}
                y={H - pad.bottom + 28}
                textAnchor="middle"
                fill="#CCC"
                fontSize={13}
                fontFamily="var(--font-inter)"
                pointerEvents="none"
              >
                <tspan x={toX(i)} dy="0">
                  {year}-{monthLabel},
                </tspan>
                <tspan x={toX(i)} dy="20">
                  {halfLabel}
                </tspan>
              </text>
            );
          })}

          {/* ── Dots (비활성) ── */}
          {completeData.map((d, i) => (
            <circle
              key={`dot-${i}`}
              cx={toX(i)}
              cy={toY(d.rating)}
              r={4}
              fill="#e2d849"
              pointerEvents="none"
            />
          ))}

          {/* ── Active Dots (클릭 영역) ── */}
          {completeData.map((d, i) => (
            <circle
              key={`hit-${i}`}
              cx={toX(i)}
              cy={toY(d.rating)}
              r={activeTooltip?.index === i ? 8 : 12} // 12: 넓은 히트 영역
              fill={activeTooltip?.index === i ? '#e2d849' : 'transparent'}
              stroke={activeTooltip?.index === i ? 'white' : 'transparent'}
              strokeWidth={activeTooltip?.index === i ? 2 : 0}
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
              onClick={(e) => handleDotClick(e, i, toX(i), toY(d.rating))}
            />
          ))}
        </svg>

        {/* ── Tooltip (SVG 바깥, 절대 위치) ── */}
        {activeTooltip !== null && (
          <CustomTooltip
            payload={completeData[activeTooltip.index]}
            svgX={activeTooltip.svgX}
            svgY={activeTooltip.svgY}
            svgWidth={W}
            svgHeight={H}
            onClose={() => setActiveTooltip(null)}
          />
        )}
      </div>
    </div>
  );
}
