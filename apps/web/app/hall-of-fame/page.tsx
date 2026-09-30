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
    name: "김성범",
    title: "제1회 체스닷컴\n아레나 나잇 우승자\n\nThe 1st Chess.com\nArena Night Winner",
    date: "2026.03.13",
    image: "/image/hall-of-fame/hf_1.png",
  },
  {
    id: 2,
    name: "서명교",
    title: "제1회 래피드 토너먼트\n오픈 부문 우승자\n\nThe 1st Rapid Tournament\nOpen Section Winner",
    date: "2026.03.28",
    image: "/image/hall-of-fame/hf_2.png",
  },
  {
    id: 3,
    name: "한찬희",
    title: "제1회 래피드 토너먼트\nU1500 부문 우승자\n\nThe 1st Rapid Tournament\nU1500 Section Winner",
    date: "2026.03.28",
    image: "/image/hall-of-fame/hf_3.png",
  },
  {
    id: 4,
    name: "서명교",
    title: "제2회 래피드 토너먼트\n오픈 부문 우승자\n\nThe 2nd Rapid Tournament\nOpen Section Winner",
    date: "2026.09.19",
    image: "/image/hall-of-fame/hf_2.png",
  },
  {
    id: 5,
    name: "정윤석",
    title: "제2회 래피드 토너먼트\nU1500 부문 우승자\n\nThe 2nd Rapid Tournament\nU1500 Section Winner",
    date: "2026.09.19",
    image: "/image/hall-of-fame/_.png",
  }
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