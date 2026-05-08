'use client';

import styles from './renderbar.module.css'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

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
    const half = p.slice(6); // A or B
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

        if (half === 0) {
            return year * 100 + month * 10 + 1; // B
        }

        month += 1;
        half = 0;

        if (month > 12) {
            return (year + 1) * 100 + 1 * 10 + 0;
        }

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
        rating: curr.rating, // forward fill
        white: { win: 0, draw: 0, loss: 0 },
        black: { win: 0, draw: 0, loss: 0 },
        });
    }
    }

    result.push(sorted[sorted.length - 1]);

    return result;
}
// #endregion

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const period = formatPeriod(data.period);

  return (
    <div className="bg-[#ccc] text-black rounded-lg font-inter leading-normal shadow-[0_4px_12px_rgba(116,116,116,0.71)]
                    /* 모바일: 크기 */
                    px-1.5 py-1.5 text-2 min-w-20
                    /* md 이상: 크기 */
                    md:px-3 md:py-2.5 md:text-3 md:min-w-40">
      
      {/* period */}
      <div className="font-semibold mb-1 md:mb-1.5">
        {period.text}
      </div>

      {/* rating */}
      <div className="font-medium">Rating: {data.rating}</div>

      <hr className="border-black my-1 md:my-1.5" />

      {/* White */}
      <div className="mb-1">
        <b className="font-bold">White</b>
        <div className="flex gap-2 md:gap-3 mt-0">
          <span>W: {data.white.win}</span>
          <span>D: {data.white.draw}</span>
          <span>L: {data.white.loss}</span>
        </div>
      </div>

      {/* Black */}
      <div className="mt-1 md:mt-1.5">
        <b className="font-bold">Black</b>
        <div className="flex gap-2 md:gap-3 mt-0">
          <span>W: {data.black.win}</span>
          <span>D: {data.black.draw}</span>
          <span>L: {data.black.loss}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProgressGraphics({ data }: Props) {
//   const sortedData = [...data].sort((a, b) =>
//     sortPeriod(a.period, b.period)
//   );
  
  const completeData = fillMissingPeriods(data)

  const generateTicks = (data: any[]) => {
    const min = Math.min(...data.map(d => d.rating));
    const max = Math.max(...data.map(d => d.rating));

    const start = Math.floor(min / 50) * 50;
    const end = Math.ceil(max / 50) * 50;

    const ticks = [];
    for (let v = start; v <= end; v += 50) {
        ticks.push(v);
    }

    return ticks;
  };

  const ticks = generateTicks(data);

  return (
    <div className={styles.container}>
        <div className="text-xl font-notoSerif text-center mb-2">
            Progress
        </div>

        <ResponsiveContainer width="100%" aspect={1} minHeight={0} minWidth={0}>
          <LineChart 
              data={completeData} 
              margin={{ top:20, bottom:0, right:20, left:0 }}              
          >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis 
                  dataKey="period"
                  tickMargin={25}
                  height={60}
                  tick={({ x, y, payload }) => {
                      const value = payload.value;

                      const { text, month, monthLabel, year, halfLabel } = formatPeriod(value)

                      return (
                          <text 
                              x={x} y={y} textAnchor="middle"
                              fill="#CCC"
                              fontSize={13}
                              fontFamily="var(--font-inter)"
                          >
                              <tspan x={x} dy="0">{year}-{monthLabel},</tspan>
                              {/* <tspan x={x} dy="14">{year}</tspan> */}
                              <tspan x={x} dy="20">{halfLabel}</tspan>
                          </text>
                      );
                  }}
              />
              <YAxis 
                  domain={[ticks[0], ticks[ticks.length - 1]]}
                  ticks={ticks}
                  tick={{ 
                    fontFamily: 'var(--font-noto)', 
                    fontSize: 14, 
                    fill: '#ccc' 
                  }}
              />

              <Tooltip 
                  cursor={ false }
                  wrapperStyle={{ outline: 'none', fontSize: 'none' }}
                  // trigger="hover"
                  content={<CustomTooltip />} 
              />

              <Line
                  type="linear"
                  dataKey="rating"
                  stroke="#e2d849"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
              />
          </LineChart>
        </ResponsiveContainer>
    </div>
  );
}