import React from 'react';
import '../styles.css'
function BlankRows({blankRows, opponent}) {
    const name = "letter-box"
  return <div className={blankRows ? "blankrow-container" : "blankrow-container hidden"}>
   
      
   {Array(blankRows).fill(Array(5).fill()).map((row) => {
          return <div className={"row-container".concat(" ", opponent.concat("y"))}>
              {row.map((letter) => {
                  
                  return (
                      <div className={name.concat(" ", opponent)}>
                          <span id="tile">{letter}</span>
                      </div>
                  )
              })}
          </div>

      })}
  </div>;
}

export default React.memo(BlankRows);
