import React from 'react';

function CurrentRow({currentRow}) {
  
  return <div className="currentrow-container">
      <div className="row-container">
        {currentRow.map((letter) => {
            return (
                <div key={letter} className="letter-box filled">
                    <span id="tile">{letter}</span>
                </div>
            )
        })}
        {Array(5 - currentRow.length).fill().map((letter) => {
            return (
                <div className="letter-box "><span id="tile">{letter}</span></div>
            )
        })}
      </div>
      
  </div>;
}

export default CurrentRow;
