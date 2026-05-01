import styles from "./page.module.css"

type Player = {
  id: number
  name: string
  title: string
  image: string
}

const winners: Player[] = [
  {
    id: 1,
    name: "히카루",
    title: "2027.3.14 아레나 나잇 우승자\nArena Night Winner",
    image: "/image/hikaru.png",
  },
  {
    id: 2,
    name: "매그너스",
    title: "2027.3.28 아레나 나잇 우승자\nArena Night Winner",
    image: "/image/magnus.png",
  },
]

export default function Page() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        명예의 전당 <span>HALL OF FAME</span>
      </h1>

      <div className={styles.logo} />

      <div className={styles.container}>
        {winners.map((player) => (
          <div key={player.id} className={styles.player}>
            <div
              className={styles.photocard}
              style={{ backgroundImage: `url(${player.image})` }}
            />

            <div className={styles.description}>
              <div className={styles.name}>{player.name}</div>
              <div className={styles.info}>
                {player.title.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}