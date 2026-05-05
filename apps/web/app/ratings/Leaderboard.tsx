'use client'; // 클라이언트 컴포넌트 선언

import React, { useState , useRef } from 'react';
import Toggle from "./Toggle";
import styles from './Leaderboard.module.css';
import WinRateBars from './renderbar';
import ProgressGraphics from './progress_graphics';


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
    student_id: number
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

      const name = playersProgress.find(
        (p) =>
            p.chessclub_id === player.chessclub_id
      )?.name

      return {
        ...player,
        name,
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

  return (
    <div className={styles.container}>
        <div className={styles.blankRow}>
            <Toggle
                isOn={showDiff}
                onToggle={handleToggle}
                label={showDiff ? "Hide Changes" : "Show Changes"}
            />
        </div>
        <div className={styles.headerRow}>
            <div className={styles.rank}>#</div>
            {/* <div className={!showDiff ? styles.hidden : ""}></div> */}
            <div className={styles.name}>Name</div>
            <div className={styles.rating} style={{ marginRight: "35px" }}>Rating</div>
            {/* <div className={!showDiff ? styles.hidden : ""}></div> */}
        </div>

        {currentAttach_progress_diff.map((player, index) => (
            <div key={player.chessclub_id} className={styles.block}>
            {/* 기본 row */}
            <div
                className={`${styles.row} ${
                openId === player.chessclub_id ? styles.active : ""
                }`}
                onClick={() => handleClick(player.chessclub_id)}
            >
                <div className={styles.rankBlock}>
                    <div className={styles.rank}>{player.rank}</div>
                    
                    <div 
                        className={`${styles.rank_diff} ${!showDiff ? styles.hidden : ""}`}
                        style={{ color: (player.rank_diff>0) ? climbColor : fallColor }}
                        >
                        {nWsign(player.rank_diff, true)}
                    </div>
                </div>

                <div className={styles.name}>{player.name}</div>

                <div className={styles.ratingBlock}>
                    <div className={styles.rating}>{Math.floor(player.rating_end)}</div>

                    <div 
                        className={`${styles.rating_diff} ${!showDiff ? styles.hidden : ""}`}
                        style={{ color: (player.rating_diff>0) ? climbColor : fallColor }}
                        >
                        {nWsign(player.rating_diff, false)}
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
  );
}