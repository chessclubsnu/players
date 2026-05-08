import { promises as fs } from 'fs';
import Leaderboard from './Leaderboard'; // 위에서 만든 컴포넌트
import path from 'path'
import styles from "./page.module.css"

export default async function Page() {
  async function loadJsonFile(fileName: string) {
    const filePath = path.join(process.cwd(), 'public', 'json', fileName + '.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent)
  }
  
  const periodFile = await loadJsonFile("period")
  const currentPeriod: string = periodFile[0].current_period
  const lastPeriod: string = periodFile[0].last_period

  const currentRanking = await loadJsonFile("PUBLIC__ranking_" + currentPeriod);
  const lastRanking = await loadJsonFile("PUBLIC__ranking_" + lastPeriod)

  const playersProgress = await loadJsonFile("PUBLIC__players_progress_by_period")
  
  return (
    <main className={styles.main}>
      <h1 className="flex flex-col leading-tight text-white font-notoSerif font-normal text-3xl mb-12">
        Leaderboard
        <span className="text-lg font-light text-[#aaa] font-notoSerif -mt-lg">
          1st Half, May 2026
        </span>
        {/* 읽어온 데이터를 Props로 전달 */}
        <Leaderboard currentPeriod = {currentPeriod} lastPeriod = {lastPeriod} 
          currentRanking={currentRanking} lastRanking={lastRanking} playersProgress={playersProgress} />
      </h1>
    </main>
  );
}