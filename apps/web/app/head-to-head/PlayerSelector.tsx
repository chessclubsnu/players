"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { types } from "util";
import styles from "./PlayerSelector.module.css"

// region types
interface Player {
  chessclub_id: string;
  student_id: string;
  name: string;
  bio?: string;
}

/** result is stored from White's point of view */
interface Game {
  tournament_name: string;
  date: string; // "YYYY-MM-DD"
  white_id: string;
  black_id: string;
  result: string;
}

interface Tally {
  win: number;
  draw: number;
  loss: number;
}

interface Stats {
  total: Tally;
  whiteVsBlack: Tally; // games where player1 had White
  blackVsWhite: Tally; // games where player1 had Black

  player1Id: string;   // 추가: View 시점의 선수1
  player2Id: string;   // 추가: View 시점의 선수2
  startDate: string;   // 추가: View 시점의 날짜 범위
  endDate: string;
}
// endregion

// region utils 
const winColor = "#2a68af";
const drawColor = "#7a7a7a";
const lossColor = "#B23A34";

function emptyTally(): Tally {
  return { win: 0, draw: 0, loss: 0 };
}

function TallyBar({ tally }: { tally: Tally }) {
  const total = tally.win + tally.draw + tally.loss;
  const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100);
  return (
    <div>
      <div
        style={{
          display: "flex",
          height: 32,
          width: "100%",
          border: "1px solid #222",
          borderRadius: 4,
          overflow: "hidden",
        }}
        // className="select-none"
      >
        {tally.win? (<div
          title={`Win: ${tally.win} (${(tally.win / total * 100).toFixed(1)}%)`}
          style={{
            width: `${pct(tally.win)}%`,
            background: winColor,
            transition: "width .3s",
          }}
          className="flex flex-row relative h-full justify-center items-center font-inter text-white text-center 
          transition-brightness duration-50 md:hover:brightness-120"
        >
          {tally.win}
        </div>) : (null)}

        {tally.draw? (<div
          title={`Draw: ${tally.draw} (${(tally.draw / total * 100).toFixed(1)}%)`}
          style={{
            width: `${pct(tally.draw)}%`,
            background: drawColor,
            transition: "width .3s",
          }}
          className="flex flex-row relative h-full justify-center items-center font-inter text-white text-center 
          transition-brightness duration-50 md:hover:brightness-120"
        >
          {tally.draw}
        </div>) : (null)}
        
        {tally.loss? (<div
          title={`Loss: ${tally.loss} (${(tally.loss / total * 100).toFixed(1)}%)`}
          style={{
            width: `${pct(tally.loss)}%`,
            background: lossColor,
            transition: "width .3s",
          }}
          className="flex flex-row relative h-full justify-center items-center font-inter text-white text-center 
          transition-brightness duration-50 md:hover:brightness-120"
        >
          {tally.loss}
        </div>) : (null)}
      </div>

      {/* <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
        <span style={{ color: "#4B7B4E" }}>Win {tally.win}</span>
        <span style={{ color: "#6b6a66" }}>Draw {tally.draw}</span>
        <span style={{ color: "#B23A34" }}>Loss {tally.loss}</span>
      </div> */}
    </div>
  );
}

function PlayerPicker({
  label,
  players,
  selectedId,
  onSelect,
}: {
  label: string;
  players: Player[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  // 이름 사전순 정렬 — 목록 자체는 필터링하지 않고 항상 전체를 보여줌
  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => a.name.localeCompare(b.name, "ko")),
    [players]
  );

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // selectedId가 바뀌면(다른 곳에서 바뀌는 경우 포함) 검색창 텍스트를 동기화
  useEffect(() => {
    if (selectedId) {
      const selected = players.find((p) => p.chessclub_id === selectedId);
      if (selected) setQuery(selected.name);
    }
  }, [selectedId, players]);

  // // 타이핑에 맞게 filtering
  // const filtered = players.filter((p) =>
  //   p.name.toLowerCase().includes(query.toLowerCase())
  // );

  const listRef = useRef<HTMLDivElement | null>(null);
  // 타이핑에 맞춰 일치하는 위치로 스크롤 (필터링 X)
  useEffect(() => {
    if (!query) return;
    const q = query.toLowerCase();
    // 이름이 입력값으로 시작하는 첫 항목을 우선 탐색
    let match = sortedPlayers.find((p) => p.name.toLowerCase().startsWith(q));
    // startsWith로 못 찾으면 포함 여부로 한 번 더 시도 (오타 등 완화)
    if (!match) match = sortedPlayers.find((p) => p.name.toLowerCase().includes(q));
    if (!match) match = sortedPlayers.find((p) => p.bio?.toLowerCase().includes(q))
    // if (match) {
    //   itemRefs.current[match.chessclub_id]?.scrollIntoView({
    //     block: "start",
    //     behavior: "smooth",
    //   });
    // }
    const el = match && itemRefs.current[match.chessclub_id];
    if (el && listRef.current) {
      listRef.current.scrollTop = el.offsetTop; // 리스트 최상단에 맞춤
    }
  }, [query, sortedPlayers]);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <input
        placeholder="Search player…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          w-full
          box-border
          px-2 py-1.5
          mb-1.5
          border border-[#ccc]
          rounded
        "
      />
      <div
        ref={listRef}
        className="
          relative
          border border-[#222]
          rounded
          max-h-45
          md:max-h-55
          overflow-y-auto
        "
      >
        {/* {filtered.length === 0 && (
          <div style={{ padding: 10, color: "#888", fontSize: 13 }}>No players found.</div>
        )} */}
        {sortedPlayers.map((p) => (
          <div
            key={p.chessclub_id}
            ref={(el) => (itemRefs.current[p.chessclub_id] = el)}
            onClick={() => {onSelect(p.chessclub_id); setQuery(p.name)}}
            style={{
              padding: "6px 8px",
              cursor: "pointer",
              background: selectedId === p.chessclub_id ? "#99999980" : "transparent",
              borderLeft: selectedId === p.chessclub_id ? "3px solid #B23A34" : "3px solid transparent",
              borderBottom: "1px solid #eee",
              maxHeight: 65,
              overflow: "hidden",
            }}
            className="font-notoSerif"
          >
            <div className="flex flex-row gap-1 md:gap-2">
              <div className={`${"bg-transparent"} ${selectedId === p.chessclub_id ? "font-semibold" : "font-normal" }`}>{p.name}</div>
              <div className="font-inter font-light text-[0.7rem] md:text-[0.8rem] text-[#777] justify-self-start self-center">{p.student_id}</div>
            </div>
              {p.bio && <div className="bg-transparent mt-0.5 italic font-light text-[0.7rem] md:text-[0.8rem] text-white">
                {p.bio}
            </div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// endregion

export default function PlayerSelector({
    idMap, playersBio, game_database,
}: { 
    idMap: {
        name: string;
        chessclub_id: string;
        student_id: string;
    }[],
    playersBio: {
        name: string;
        student_id: string;
        chessclub_id: string;
        bio_text: string;
    }[], 
    game_database: Game[]
}) {
    // region load data
    const player_database: Player[] = idMap.map((player: {
        chessclub_id: string;
        student_id: string;
        name: string;
    }) => {
        const bio = playersBio.find(
            (bio: {
                name: string; 
                student_id: string;
                chessclub_id: string; 
                bio_text: string;
            }) => bio.chessclub_id === player.chessclub_id
        );
        return {
            ...player,
            bio: bio?.bio_text ?? ""
        };
    });
    // endregion

    // region states
    const [players, setPlayers] = useState<Player[]>(player_database);
    const [games, setGames] = useState<Game[]>(game_database);

    const [player1, setPlayer1] = useState<string | null>(null);
    const [player2, setPlayer2] = useState<string | null>(null);

    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const [startDate, setStartDate] = useState<string>("2026-03-01");
    const [endDate, setEndDate] = useState<string>(todayString);

    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);
    // endregion

    // region visuals
    const playerName = (id: string | null) =>
        players.find((p) => p.chessclub_id === id)?.name ?? "—";

    function handleView() {
        if (!player1) return setError("Select player 1.");
        if (!player2) return setError("Select player 2.");
        if (player1 === player2) return setError("Player 1 and player 2 must be different.");
        if (!startDate) return setError("Select a start date.");
        if (!endDate) return setError("Select an end date.");
        if (startDate > endDate) return setError("Start date must be before end date.");
        setError(null);

        const filteredGames = games.filter((g) => {
        const inRange = g.date >= startDate && g.date <= endDate;
        const isMatchup =
            (g.white_id === player1 && g.black_id === player2) ||
            (g.white_id === player2 && g.black_id === player1);
        return inRange && isMatchup;
        });

        const total = emptyTally();
        const whiteVsBlack = emptyTally(); // player1 as White
        const blackVsWhite = emptyTally(); // player1 as Black

        for (const g of filteredGames) {
          if (g.white_id === player1) {
              // player1 played White
              if (Number(g.result) === 1) whiteVsBlack.win++;
              else if (Number(g.result) === 0) whiteVsBlack.loss++;
              else whiteVsBlack.draw++;
          } else {
              // player1 played Black
              if (Number(g.result) === 0) blackVsWhite.win++;
              else if (Number(g.result) === 1) blackVsWhite.loss++;
              else blackVsWhite.draw++;
          }
        }

        total.win = whiteVsBlack.win + blackVsWhite.win;
        total.draw = whiteVsBlack.draw + blackVsWhite.draw;
        total.loss = whiteVsBlack.loss + blackVsWhite.loss;

        setStats({ 
          total, 
          whiteVsBlack,
          blackVsWhite,
          player1Id: player1,
          player2Id: player2,
          startDate,
          endDate,
        });
    }
    // endregion

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "16px auto",
        padding: 24,
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#FFFFFF",
      }}
    >
      <h1 className="text-white font-notoSerif font-normal text-3xl mb-8">Head-to-Head</h1>

      {/* Player selectors */}
      <div style={{ display: "flex", gap: 20, marginBottom: 25 }}>
        <PlayerPicker label="Player 1" players={players} selectedId={player1} onSelect={setPlayer1} />
        <PlayerPicker label="Player 2" players={players} selectedId={player2} onSelect={setPlayer2} />
      </div>

      {/* Date range */}
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Date</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "start", gap: 8, marginBottom: 25 }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ border: "1px solid #ccc", borderRadius: 4, colorScheme: "dark" }}
          className="max-w-32 max-h-10 sm:max-w-40 sm:max-h-15 px-1.5 py-1.5 md:px-2 md:py-2 
          text-sm md:text-base"
        />
        <span>–</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ border: "1px solid #ccc", borderRadius: 4, colorScheme: "dark" }}
          className="max-w-32 max-h-10 sm:max-w-40 sm:max-h-15 px-1.5 py-1.5 md:px-2 md:py-2 
          text-sm md:text-base"
        />
      </div>

      {error && (
        <div style={{ color: "#B23A34", marginBottom: 12, fontSize: 14 }}>{error}</div>
      )}

      <button
        onClick={handleView}
        // style={{
        //   padding: "8px 20px",
        //   background: "#EBC628",
        //   color: "#111111",
        //   border: "none",
        //   borderRadius: 4,
        //   cursor: "pointer",
        //   fontWeight: 600,
        //   marginBottom: 28,
        // }}
        className="
          mb-7 rounded px-5 py-2 font-semibold text-black
          bg-[#EBC628]
          transition-all duration-150
          md:hover:brightness-60
          md:hover:cursor-pointer
          active:scale-[0.95]
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700
        "
      >
        View
      </button>

      {stats && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 14, color: "#888" }}>
            {playerName(stats.player1Id)} vs {playerName(stats.player2Id)} &middot; {" "}
            {stats.startDate} – {stats.endDate}
          </div>

          {/* Total/White/Black stats bar */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              Total.&nbsp;&nbsp; {stats.total.win + stats.total.draw + stats.total.loss}
            </div>
            <TallyBar tally={stats.total} />
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              W vs B.&nbsp;&nbsp;{stats.whiteVsBlack.win + stats.whiteVsBlack.draw + stats.whiteVsBlack.loss}&nbsp;&nbsp; 
              <span style={{ fontWeight: 400, color: "#888" }}>
                ({playerName(stats.player1Id)} as White)
              </span>
            </div>
            <TallyBar tally={stats.whiteVsBlack} />
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              B vs W.&nbsp;&nbsp;{stats.blackVsWhite.win + stats.blackVsWhite.draw + stats.blackVsWhite.loss}&nbsp;&nbsp;
              <span style={{ fontWeight: 400, color: "#888" }}>
                ({playerName(stats.player1Id)} as Black)
              </span>
            </div>
            <TallyBar tally={stats.blackVsWhite} />
          </div>

          {/* Legend bar */}
          {stats.total.win + stats.total.draw + stats.total.loss > 0 ? 
          (<div className="mt-5 mb-0 font-inter">
            {/* 얇은 범례 바 */}
            <div className="flex flex-row h-2 rounded border-1px] overflow-hidden border-transparent w-[65%] md:w-half mx-auto">
              <div style={{ flex: 1, background: winColor }} />
              <div style={{ flex: 1, background: drawColor }} />
              <div style={{ flex: 1, background: lossColor }} />
            </div>

            {/* 텍스트 라벨 */}
            <div className="flex flex-row text-3 lg:text-4 mt-0.5 w-[65%] md:w-half mx-auto text-center">
              <span style={{ color: winColor, width: "33.3%" }}>Win</span>
              <span style={{ color: drawColor, width: "33.4%" }}>Draw</span>
              <span style={{ color: lossColor, width: "33.4%" }}>Loss</span>
            </div>
          </div>) : 
          (<span className="text-center text-[#888] italic">No games played yet</span>)}

        </div>
      )}
    </div>
  );

}