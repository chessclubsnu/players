import styles from "./page.module.css"

type Player = {
  id: number
  name: string
  title: string
  date: string
  image: string
}

const winners: Player[] = [
  {
    id: 1,
    name: "???",
    title: "제1회 아레나 나잇 우승자\nArena Night Winner",
    date: "2026.3.13",
    image: "/image/hikaru.png",
  },
  {
    id: 2,
    name: "서명교",
    title: "서울대 체스 오픈 우승자\nSNU CHESS OPEN Winner",
    date: "2026.03.28",
    image: "/image/magnus.png",
  },
  {
    id: 3,
    name: "한찬희",
    title: "서울대 체스 U1500 우승자\nSNU CHESS U1500 Winner",
    date: "2026.03.28",
    image: "/image/magnus.png",
  },
]

export default function Page() {
  return (
    <main className={styles.main}>
      <h1 className="flex flex-col items-center text-white leading-tight font-normal text-3xl mb-12">
        Hall of Fame
        <span className="text-lg font-light text-[#aaa] mb-lg">
          체스클럽 명예의 전당
        </span>
      </h1>

      <div className={styles.container}>
        {winners.map((player) => (
          <div key={player.id} className={styles.player}>
            <div
              className={styles.photocard}
              style={{ backgroundImage: `url(${player.image})` }}
            />

            <div className={styles.description_block}>
              <div className={styles.name}>{player.name}</div>
              <div className={styles.info}>
                {player.title.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
              <div className={styles.info}>
                {player.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}