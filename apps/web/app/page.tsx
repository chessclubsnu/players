import Link from "next/link"
import styles from "./page.module.css"

export default function Page() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>ChessClub</h1>
      <p className={styles.description}>
        서울대&nbsp;&nbsp;중앙동아리&nbsp;&nbsp;체스클럽
      </p>

      <div className={styles.grid}>
        <Link href="/hall-of-fame" className={styles.card}>
          <h2>Hall of Fame</h2>
          <p>명예의 전당</p>
        </Link>

        <Link href="/ratings" className={styles.card}>
          <h2>Ratings</h2>
          <p>레이팅</p>
        </Link>
      </div>
    </main>
  )
}