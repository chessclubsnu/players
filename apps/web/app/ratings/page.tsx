import { promises as fs } from 'fs';
import Leaderboard from './Leaderboard'; // 위에서 만든 컴포넌트
import path from 'path'
import styles from "./page.module.css"

export default async function Page() {
// public 폴더 내의 경로를 잡아줍니다.
  const playerDbFilePath = path.join(process.cwd(), 'public', 'json', 'PUBLIC_players_database.json');
  const playerDbfileContent = await fs.readFile(playerDbFilePath, 'utf8');
// 여기서는 문자열을 읽어온 것이므로 JSON.parse를 써야 합니다.
  const playerDbData = JSON.parse(playerDbfileContent);

  const playerHistFilePath = path.join(process.cwd(), 'public', 'json', 'PUBLIC_players_rating_history.json');
  const playerHistFileContent = await fs.readFile(playerHistFilePath, 'utf8')
  const playerHistData = JSON.parse(playerHistFileContent);
  

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Leaderboard <span>1st Half, May 2026</span>
        {/* 읽어온 데이터를 Props로 전달 */}
        <Leaderboard playerDB={playerDbData} ratingHistList={playerHistData} />
      </h1>
    </main>
  );
}