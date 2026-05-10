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
  const lossColor = "#D04040"

  const renderBar = (label: string, record: Record) => {
    const rate = calcRate(record)
    
    return (
      <div>
        {/* 메인 막대 */}
        {record.win + record.draw + record.loss != 0 ? (
          <div className="font-inter mb-3">
            <div className="mb-1 text-[#ccc]">{label}</div>

            <div className="flex flex-row h-5 md:h-7 w-full relative p-0 items-center text-sm md:text-base
              bg-[rgba(255_255_255_0.08)]">
              {record.win!=0 ? (<div
                className={`
                  ${styles.bar_segment}
                  ${(record.draw===0 && record.loss===0)? styles.bar_bothRound : styles.bar_leftRound}
                  `}
                style={{
                  width: `${rate.win}%`,
                  background: winColor,
                }}
                title={`Win: ${record.win} (${(rate.win).toFixed(1)}%)`}>
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
                title={`Draw: ${record.draw} (${(rate.draw).toFixed(1)}%)`}>
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
                title={`Loss: ${record.loss} (${(rate.loss).toFixed(1)}%)`}>
                  {record.loss}
                </div>) : (null)}
            </div>
          </div>
          ) : (null)}
        
      </div>
    )
  }

  const legendBar = () => {
    return (
      <div className="mt-5 mb-0 font-inter">
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
        </div>
    )
  }

  return (
    <div className="flex flex-col mx-auto mb-10 md:mb-12 w-[90%] gap-0">
      <div className="text-xl md:text-2xl font-notoSerif text-center mb-2">Stats</div>
      {renderBar("Total " + "\u00A0" + String(total.win + total.draw + total.loss), total)}
      {renderBar("White " + "\u00A0" + String(white.win + white.draw + white.loss), white)}
      {renderBar("Black " + "\u00A0" + String(black.win + black.draw + black.loss), black)}
      {legendBar()}
    </div>
  )
}