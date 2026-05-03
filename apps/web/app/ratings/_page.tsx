"use client"

import { useState } from "react"
import styles from "./page.module.css"

type Player = {
  id: number
  name: string
  rating: number
}

const players: Player[] = [
  { id: 1, name: "Hikaru", rating: 2850 },
  { id: 2, name: "Magnus", rating: 2830 },
  { id: 3, name: "Ding", rating: 2810 },
  { id: 4, name: "Fabiano", rating: 2795 },
]

export default function Page() {
  const [openId, setOpenId] = useState<number | null>(null)

  const handleClick = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Leaderboard <span>1st Half, May 2026</span>
      </h1>

      <div className={styles.container}>
        {players.map((player, index) => (
          <div key={player.id} className={styles.block}>
            {/* 기본 row */}
            <div
              className={`${styles.row} ${
                openId === player.id ? styles.active : ""
              }`}
              onClick={() => handleClick(player.id)}
            >
              <div className={styles.rank}>#{index + 1}</div>
              <div className={styles.name}>{player.name}</div>
              <div className={styles.rating}>{player.rating}</div>
            </div>

            {/* 확장 영역 */}
            <div
              className={`${styles.detail} ${
                openId === player.id ? styles.open : ""
              }`}
            >
              <div className={styles.detailContent}>
                상세 정보 (추후 구현)
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}