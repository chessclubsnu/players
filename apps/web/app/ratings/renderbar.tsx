import styles from './renderbar.module.css'

type Record = {
  win: number
  draw: number
  loss: number
}

type Props = {
  white: Record
  black: Record
}

export default function WinRateBars({ white, black }: Props) {

  const total: Record = {
    win: white.win + black.win,
    draw: white.draw + black.draw,
    loss: white.loss + black.loss,
  }

  const calcRate = (record: Record) => {
    const sum = record.win + record.draw + record.loss
    return {
      win: (record.win / sum) * 100,
      draw: (record.draw / sum) * 100,
      loss: (record.loss / sum) * 100,
    }
  }

  const renderBar = (label: string, record: Record) => {
    const rate = calcRate(record)

    return (
      <div style={{ marginBottom: "16px" }}>
        <div style={{ marginBottom: "4px" }}>{label}</div>

        {/* 메인 막대 */}
        <div style={{
          display: "flex",
          height: "24px",
          width: "100%",
          borderRadius: "6px",
          overflow: "hidden",
        }}>
          <div
            style={{
              width: `${rate.win}%`,
              background: "#4caf50",
              position: "relative"
            }}
            title={`Win: ${record.win}`}
          />
          <div
            style={{
              width: `${rate.draw}%`,
              background: "#9e9e9e",
              position: "relative"
            }}
            title={`Draw: ${record.draw}`}
          />
          <div
            style={{
              width: `${rate.loss}%`,
              background: "#f44336",
              position: "relative"
            }}
            title={`loss: ${record.loss}`}
          />
        </div>
      </div>
    )
  }

  const legendBar = () => {
    return (
      <div style={{ marginTop: "16px", marginBottom: "0px" }}>
      {/* 👇 얇은 범례 바 */}
        <div
          style={{
            display: "flex",
            height: "6px",
            marginTop: "4px",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, background: "#4caf50" }} />
          <div style={{ flex: 1, background: "#9e9e9e" }} />
          <div style={{ flex: 1, background: "#f44336" }} />
        </div>

        {/* 👇 텍스트 라벨 (선택) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            marginTop: "2px",
          }}
        >
          <span style={{ color: "#4caf50" }}>Win</span>
          <span style={{ color: "#9e9e9e" }}>Draw</span>
          <span style={{ color: "#f44336" }}>Loss</span>
        </div>
        </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.stats}>Stats</div>
      {renderBar("Total", total)}
      {renderBar("White", white)}
      {renderBar("Black", black)}
      {legendBar()}
    </div>
  )
}