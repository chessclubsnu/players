'use client'; // 클라이언트 컴포넌트 선언

import styles from './Leaderboard.module.css';
import WinRateBars from './renderbar';
import { useState } from 'react';
import { useRef } from 'react';

type player = {
    name: string
    student_id: string
    rating: number
    peak_rating: number
    lowest_rating: number
    first_game_played_on: number
    last_game_played_on: number
    games_played: number
    wins: number
    draws: number
    losses: number
    games_played_with_white: number
    wins_with_white: number
    draws_with_white: number
    losses_with_white: number
    games_played_with_black: number
    wins_with_black: number
    draws_with_black: number
    losses_with_black: number
    chessclub_id: string
}

type ratingHist = {
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
    playerDB: player[]
    ratingHistList: ratingHist[]
}

export default function Leaderboard({ playerDB, ratingHistList }: Props) {
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

  return (
    <div className={styles.container}>
        <div className={styles.headerRow}>
            <div className={styles.rank}> # </div>
            <div className={styles.name}>Name</div>
            <div className={styles.rating}>Rating</div>
        </div>
        {playerDB.map((player, index) => (
            <div key={player.chessclub_id} className={styles.block}>
            {/* 기본 row */}
            <div
                className={`${styles.row} ${
                openId === player.chessclub_id ? styles.active : ""
                }`}
                onClick={() => handleClick(player.chessclub_id)}
            >
                <div className={styles.rank}>{index + 1}</div>
                <div className={styles.name}>{player.name}</div>
                <div className={styles.rating}>{Math.round(player.rating)}</div>
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
                        win: player.wins_with_white,
                        draw: player.draws_with_white,
                        loss: player.losses_with_white
                    }}
                    black={{
                        win: player.wins_with_black,
                        draw: player.draws_with_black,
                        loss: player.losses_with_black
                    }}/>
                </div>
            </div>
            </div>
        ))}
    </div>
  );
}