'use client';

import React, { useState , useRef, useCallback } from 'react';
import Toggle from "./Toggle";
import styles from './Leaderboard.module.css';
import WinRateBars from './renderbar';
import ProgressGraphics from './progress_graphics';
import useRipple from './ripple';

// #region Types
// type player = {
//     name: string
//     student_id: string
//     rating: number
//     peak_rating: number
//     lowest_rating: number
//     first_game_played_on: number
//     last_game_played_on: number
//     games_played: number
//     wins: number
//     draws: number
//     losses: number
//     games_played_with_white: number
//     wins_with_white: number
//     draws_with_white: number
//     losses_with_white: number
//     games_played_with_black: number
//     wins_with_black: number
//     draws_with_black: number
//     losses_with_black: number
//     chessclub_id: string
// }

type RankingType = {
    rank: number,
    chessclub_id: string,
    rating_end: number
}

type PlayerProgressType = {
    student_id: string
    name: string
    period: string
    rating_start: number
    rating_end: number
    delta_total: number
    tournaments: number
    win_w: number
    draw_w: number
    loss_w: number
    win_b: number
    draw_b: number
    loss_b: number
    chessclub_id: string
}

type Props = {
    currentPeriod: string
    lastPeriod: string
    currentRanking: RankingType[]
    lastRanking: RankingType[]
    playersProgress: PlayerProgressType[]
}
// #endregion

export default function Leaderboard({ currentPeriod, lastPeriod, currentRanking, lastRanking, playersProgress }: Props) {
  // #region Show/Hide Details
  const [openId, setOpenId] = useState<string | null>(null)
  const refs = useRef<Record<string, HTMLDivElement | null>>({})

  const handleClick = (id: string) => {
    const current = refs.current[id]

    if (!current) return

    // 이미 열린 것 닫기
    if (openId && refs.current[openId]) {
        refs.current[openId]!.style.height = "0px"
    }

    if (openId === id) {
        setOpenId(null)
        return
    }

    // 먼저 열림 상태로 만들어야 scrollHeight 정확
    current.style.height = "auto"
    const height = current.scrollHeight

    current.style.height = "0px"

    // force reflow (중요)
    current.offsetHeight

    current.style.height = height + "px"

    setOpenId(id)
  }
  // #endregion

  // #region Show/Hide Changes
  const [showDiff, setShowDiff] = useState(true);

  const handleToggle = () => {
    setShowDiff((prev) => !prev)
  }
  // #endregion

  // #region Process Data
  function attach$Stats$Name2Ranking(
    ranking: RankingType[],
    playersProgress: PlayerProgressType[]
  ) {
    return ranking.map((player) => {
      const stats = playersProgress
        .filter((p) => p.chessclub_id === player.chessclub_id)
        .reduce(
            (acc, p) => {
                acc.rows.push({
                    period: p.period,
                    rating: Math.floor(p.rating_end),
                    white: { win: p.win_w, draw: p.draw_w, loss: p.loss_w },
                    black: { win: p.win_b, draw: p.draw_b, loss: p.loss_b },
                });

                acc.total.win += (p.win_w ?? 0) + (p.win_b ?? 0);
                acc.total.draw += (p.draw_w ?? 0) + (p.draw_b ?? 0);
                acc.total.loss += (p.loss_w ?? 0) + (p.loss_b ?? 0);
                acc.total.win_w += (p.win_w ?? 0);
                acc.total.win_b += (p.win_b ?? 0);
                acc.total.draw_w += (p.draw_w ?? 0);
                acc.total.draw_b += (p.draw_b ?? 0);
                acc.total.loss_w += (p.loss_w ?? 0);
                acc.total.loss_b += (p.loss_b ?? 0);
                    
                return acc;
            },
            {
                rows: [] as any[],
                total: { 
                    win: 0, draw: 0, loss: 0,
                    win_w: 0, draw_w: 0, loss_w: 0,
                    win_b: 0, draw_b: 0, loss_b: 0,
                 },
            }
        );

      const target = playersProgress.find(
        (p) =>
            p.chessclub_id === player.chessclub_id
      );

      const name = target?.name
      const student_id = target?.student_id

      return {
        ...player,
        name,
        student_id,
        stats
      }
    })
  }

  const currentAttach_progress = attach$Stats$Name2Ranking(currentRanking, playersProgress)

  function attachDiff(currentAttach_progress, lastRanking) {
    const lastMap = new Map(
        lastRanking.map((p) => [p.chessclub_id, p])
    );

    return currentAttach_progress.map((curr) => {
        const last = lastMap.get(curr.chessclub_id);

        const rating_diff =
            last?.rating_end !== undefined
                ? Math.round(curr.rating_end - last.rating_end)
                : undefined;
        const rank_diff = 
            last?.rank !== undefined
                ? last.rank - curr.rank
                : undefined
        return {
            ...curr,
            rating_diff,
            rank_diff
        };
    });
  }

  const currentAttach_progress_diff = attachDiff(currentAttach_progress, lastRanking)

  // #endregion

  function nWsign(n: number, arrow: boolean) {
    const ans = 
        arrow===true ?
            n>0 ? `\u25B2${n}` :
            n<0 ? `\u25BC${-n}` :
            ''
        : 
            n>0 ? `+${n}` :
            n<0 ? `${n}` :
            ''
    return ans
  }
  
  const climbColor = "#307bd1"
  const climbColor2 = "#33ac4d"
  const fallColor = "#d84036"
  const fallColor2 = "d82d2d"

  const ripple = useRipple("rgba(255,255,255,0.35)")

  return (
    <div className="w-[95%] md:w-[70%] lg:w-[50%] max-w-[700px] mr-auto md:mx-auto mt-10 mb-16 flex flex-col select-none">
        <div className="flex flex-row ml-4 mb-8">
            <Toggle
                isOn={showDiff}
                onToggle={handleToggle}
                label={showDiff ? "Show Changes" : "Show Changes"}
                alpha={showDiff ? 0.8: 0.8}
            />
        </div>

        <div className="w-full grid grid-cols-[20%_1fr_30%] items-center max-h-10 bg-transparent">

            <div className="text-left font-notoSerif font-bold text-xl md:text-2xl ml-6">#</div>
            {/* <div className={!showDiff ? styles.hidden : ""}></div> */}
            <div className="text-center font-notoSerif font-bold text-xl md:text-2xl">Name / ID</div>
            <div className="flex">
                <div className="flex justify-start ml-[1%] md:ml-[20%] text-center font-notoSerif font-bold text-xl md:text-2xl w-full">Rating</div>
            </div>
            {/* <div className={!showDiff ? styles.hidden : ""}></div> */}
        </div>

        {/* 헤더 언더라인 */}
        <div className="bottom-0 translate-x-[5%] w-[90%] md:w-[98%] md:translate-x-[1%] h-[1.5px] mt-0.5 md:mt-1 mb-1 bg-white/90"></div>

        <div className="w-full flex flex-col gap-0">
            {currentAttach_progress_diff.map((player, index) => (
                <div key={player.chessclub_id} className="flex flex-col gap-0">

                    {/* 기본 row */}
                    <div
                        className={`relative overflow-hidden 
                            grid grid-cols-[28%_1fr_32%] md:grid-cols-[24%_1fr_34%]
                            items-center h-12 md:h-12 lg:h-16 
                            py-[0.3rem] px-0 mt-0 mb-0 rounded-lg gap-0
                            hover:cursor-pointer md:hover:bg-[#999]/50 md:hover:scale-[1.02]
                            active:translate-y-0.5
                            font-noto font-medium 
                            ${openId === player.chessclub_id ? styles.active : ""}
                        `}
                        onClick={(e) => {
                            ripple(e);
                            handleClick(player.chessclub_id);
                        }}
                    >
                        {/* 순위 */}
                        <div className="flex flex-row items-end gap-0">
                            <div className="text-left font-notoSerif font-normal text-xl md:text-2xl ml-6">{player.rank}</div>
                            
                            <div 
                                className={`text-left font-notoSerif font-light text-base md:text-xl ml-2 ${!showDiff ? styles.hidden : ""}`}
                                style={{ color: (player.rank_diff>0) ? climbColor : fallColor }}
                                >
                                {nWsign(player.rank_diff, true)}
                            </div>
                        </div>
                        
                        {/* 이름 */}
                        <div className="grid grid-cols-[50%_1fr] bg-transparent">
                            <div className="flex h-full items-center justify-end px-1 text-center font-notoSerif font-normal text-xl md:text-2xl bg-transparent">{player.name}</div>
                            <div className="flex h-full items-end justify-start leading-none px-1 text-white/30 font-inter font-normal text-sm md:text-base bg-transparent">{player.student_id}</div>
                        </div>

                        {/* 레이팅 */}
                        <div className="w-full grid grid-cols-[10%_1fr_20%] bg-transparent">
                            <div>
                                {}
                            </div>

                            <div className="grid grid-cols-[70%_30%] items-end justify-left gap-0 pl bg-transparent">
                                <div className="text-right font-notoSerif font-normal text-xl md:text-2xl mr-0 bg-transparent">
                                    {Math.floor(player.rating_end)}
                                </div>

                                <div 
                                    className={`bg-transparent text-left font-notoSerif text-base md:text-xl font-normal ml-1 md:ml-2 ${!showDiff ? styles.hidden : ""}`}
                                    style={{ color: (player.rating_diff>0) ? climbColor : fallColor }}
                                    >
                                    {nWsign(player.rating_diff, false)}
                                </div>
                            </div>
                        </div>
                    </div>
                        
                    {/* 확장 영역 */}
                    <div
                        ref={(el) => {
                            refs.current[player.chessclub_id] = el
                        }}
                        className={`${styles.detail} ${
                        openId === player.chessclub_id ? styles.open : ""
                        }`}
                    >
                        <div className={styles.detailContent}>
                            <WinRateBars white={{
                                win: player.stats.total.win_w,
                                draw: player.stats.total.draw_w,
                                loss: player.stats.total.loss_w
                            }}
                            black={{
                                win: player.stats.total.win_b,
                                draw: player.stats.total.draw_b,
                                loss: player.stats.total.loss_b
                            }}/>

                            <ProgressGraphics data={player.stats.rows} />
                        </div>
                    </div>
            </div>
            ))}
        </div>
    </div>
  );
}