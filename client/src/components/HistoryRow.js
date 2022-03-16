import React from 'react';
import '../styles.css'
function HistoryRow({history, opponent}) {

    const name = "letter-box"
  return <div className="history-container">{history.map((row) => {
          return (
              <div className={"row-container".concat(" ", opponent.concat('y'))}>
                  {row.map((letter) => {
                      return (
                          <div className={name.concat(" ", letter.status).concat(" ", opponent)}><span id="tile">{opponent == "false" && letter.key}</span></div>
                      )
                  })}
              </div>
          )
      })}</div>;
}

export default React.memo(HistoryRow);
