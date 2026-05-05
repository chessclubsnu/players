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

  const winColor = "#2a68af"
  const drawColor = "#8a8a8a"
  const lossColor = "#d43c31"

  const renderBar = (label: string, record: Record) => {
    const rate = calcRate(record)
    
    return (
      <div style={{ marginBottom: "16px" }}>
        <div style={{ marginBottom: "4px", fontFamily: "var(--font-noto)", color: "#ccc" }}>{label}</div>

        {/* 메인 막대 */}
        <div style={{
          display: "flex",
          height: "24px",
          width: "100%",
          borderRadius: "6px",
          position: "relative"
        }}>
          {record.win!=0 ? (<div
            className={`
              ${styles.bar_segment} 
              ${(record.draw===0 && record.loss===0)? styles.bar_bothRound : styles.bar_leftRound}
              `}
            style={{
              width: `${rate.win}%`,
              background: winColor,
            }}
            title={`Win: ${record.win}`}>
              {record.win}
            </div>) : (null)}

          {record.draw!=0 ? (<div
            className={`
              ${styles.bar_segment} 
              ${(record.win===0 && record.loss===0)? styles.bar_bothRound : 
                (record.win===0)? styles.bar_leftRound :
                (record.loss===0)? styles.bar_rightRound :
                null
              }
              `}
            style={{
              width: `${rate.draw}%`,
              background: drawColor,
            }}
            title={`Draw: ${record.draw}`}>
              {record.draw}
            </div>) : (null)}

          {record.loss!=0 ? (<div
            className={`
              ${styles.bar_segment} 
              ${(record.draw===0 && record.win===0)? styles.bar_bothRound : styles.bar_rightRound}
              `}
            style={{
              width: `${rate.loss}%`,
              background: lossColor,
            }}
            title={`loss: ${record.loss}`}>
              {record.loss}
            </div>) : (null)}
        </div>
      </div>
    )
  }

  const legendBar = () => {
    return (
      <div style={{ marginTop: "16px", marginBottom: "0px" }}>
      {/* 얇은 범례 바 */}
        <div
          style={{
            display: "flex",
            height: "6px",
            marginTop: "4px",
            borderRadius: "3px",
            overflow: "hidden",
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <div style={{ flex: 1, background: winColor }} />
          <div style={{ flex: 1, background: drawColor }} />
          <div style={{ flex: 1, background: lossColor }} />
        </div>

        {/* 텍스트 라벨 (선택) */}
        <div
          style={{
            display: "flex",
            fontSize: "12px",
            marginTop: "2px",
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            fontFamily: "var(--font-noto)",
          }}
        >
          <span style={{ color: winColor, width: "33.3%" }}>Win</span>
          <span style={{ color: drawColor, width: "33.4%" }}>Draw</span>
          <span style={{ color: lossColor, width: "33.4%" }}>Loss</span>
        </div>
        </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.stats}>Stats</div>
      {renderBar("Total " + "\u00A0" + String(total.win + total.draw + total.loss), total)}
      {renderBar("White " + "\u00A0" + String(white.win + white.draw + white.loss), white)}
      {renderBar("Black " + "\u00A0" + String(black.win + black.draw + black.loss), black)}
      {legendBar()}
    </div>
  )
}