import { promises as fs } from 'fs';
import Leaderboard from './Leaderboard'; // 위에서 만든 컴포넌트
import path from 'path'
import styles from "./page.module.css"

export default async function Page() {
  async function loadJsonFile(filePath: string) {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent)
  }
  
  const periodFile = await loadJsonFile(path.join(process.cwd(), "public", "processed", "period.json"))
  const currentPeriod: string = periodFile[0].current_period
  const lastPeriod: string = periodFile[0].last_period

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function formatPeriod(period: string): string {
    const year = period.slice(0, 4);
    const month = months[Number(period.slice(4, 6)) - 1];
    const half = period[6] === "A" ? "1st Half" : "2nd Half";

    return `${half}, ${month} ${year}`;
  }

  const currentRankingAll = await loadJsonFile(path.join(process.cwd(), "public", "processed", "rankings", "PUBLIC__ranking_" + currentPeriod + "_all.json"));
  const currentRankingActive = await loadJsonFile(path.join(process.cwd(), "public", "processed", "rankings", "PUBLIC__ranking_" + currentPeriod + "_active.json"));
  const lastRankingAll = await loadJsonFile(path.join(process.cwd(), "public", "processed", "rankings", "PUBLIC__ranking_" + lastPeriod + "_all.json"))
  const lastRankingActive = await loadJsonFile(path.join(process.cwd(), "public", "processed", "rankings", "PUBLIC__ranking_" + lastPeriod + "_active.json"))

  const playersProgress = await loadJsonFile(path.join(process.cwd(), "public", "processed", "PUBLIC__players_progress_by_period.json"))
  
  const playersBio = await loadJsonFile(path.join(process.cwd(), "public", "processed", "PUBLIC__bio.json"))

  return (
    <main className={styles.main}>
      <h1 className="flex flex-col leading-tight text-white font-notoSerif font-normal text-3xl mb-12">
        Leaderboard
        <span className="text-lg font-light text-[#aaa] font-notoSerif -mt-lg">
          {/* 위의 currentPeriod와 동일한 period */}
          {formatPeriod(currentPeriod)}
        </span>
        {/* 읽어온 데이터를 Props로 전달 */}
        <Leaderboard currentPeriod = {currentPeriod} lastPeriod = {lastPeriod} 
          currentRankingAll={currentRankingAll} currentRankingActive={currentRankingActive}
          lastRankingAll={lastRankingAll} lastRankingActive={lastRankingActive}
          playersProgress={playersProgress} playersBio={playersBio}/>
      </h1>
    </main>
  );
}