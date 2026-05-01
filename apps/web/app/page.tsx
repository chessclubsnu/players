import Link from "next/link"
import styles from "./page.module.css"

export default function Page() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>My Web App</h1>
      <p className={styles.description}>
        원하는 페이지로 이동하세요
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