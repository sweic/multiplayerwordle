import React from 'react';
import BlankRows from "./BlankRows";
import HistoryRow from "./HistoryRow";

function Opponent({opponentData, opponent}) {
  return <div className="opponent-board"><div className="opponent-container">
      <p>{opponent}</p>
      <HistoryRow opponent={"oppo"} history={opponentData}></HistoryRow>
      <BlankRows blankRows={6 - opponentData.length} opponent={"oppo"}></BlankRows>
  </div>
  </div>
}

export default Opponent;
