import React from 'react';
import HistoryRow from "./HistoryRow";
import {useEffect} from 'react'
import CurrentRow from "./CurrentRow";
import BlankRows from "./BlankRows";
import Opponent from "./Opponent";
import {letterKeys} from '../constants.js';
import {useGameStatus} from '../hooks/useGameStatus.js'

function Board({gameID, wordle, client, players, user, gameEnd, reload, clientID, opponentData}) {
   
   const {gameStatusRef, setGameStatus, currentRowRef,  history, historyRef, error, winner, rematch, setRematch, updateKeys, tie ,keyboard, resetGame, checkKey, handleGameState} = useGameStatus()
   
    useEffect(() => {
        if (gameEnd.status) {
            setGameStatus(true);
        } else {
            setGameStatus(false);
        }
    }, [gameEnd])

    useEffect(() => {
        resetGame()
        window.addEventListener('keyup', middlewareKey);
        
        return () => {
            window.removeEventListener('keyup', middlewareKey)
        }
    }, [wordle])

   useEffect(() => {
        updateKeys()
    }, [history])
   
   const handleRematch = e => {
       e.preventDefault();
       const data = {
           type: "rematch",
           payload: {
                gameID: gameID,
                clientID: clientID,
           }
       }
       client.send(JSON.stringify(data));
       setRematch(false);
    }
   
   const middlewareKey = (e) => {
        checkKey(e, wordle, client, clientID, gameID, user)
    }

    const handleKeyChange = (d) => {
        d.preventDefault();
        if (historyRef.current.length == 6 || gameStatusRef.current) return;
        const key = d.target.getAttribute("data")
        const keyCode = d.target.getAttribute("code")
        middlewareKey({key: key, keyCode: keyCode});
    }
    
    useEffect(()=>{
        handleGameState(gameEnd, user)
    }, [reload])

  return (
  <div className="board-container">
    <Opponent opponentData={opponentData} opponent={players.find((player) => player !== user)}></Opponent>
    <div className="user-container">
        <div className="toasty">
            {error && <div className={error ? "toast-container error" : "toast-container"}>Not a word!</div>}
            {winner && <div className={winner ? "toast-container error" : "toast-container"}>You won!</div>}
            {winner == false && <div className={winner == false ? "toast-container error" : "toast-container"}>You lost!</div>}
            {tie && <div className={tie ? "toast-container error" : "toast-container"}>Tie!</div>}
            {rematch &&<div onClick={(e) => handleRematch(e)}className={rematch ? "toast-container rematch" : "toast-container"}>Rematch</div>}
        </div>
      <p>{user}</p>
        {history.length > 0 && <HistoryRow history={historyRef.current} opponent={"false"}></HistoryRow>}
        {history.length < 6 && <div className="currentrow-container"> <CurrentRow currentRow={currentRowRef.current}></CurrentRow>
        <BlankRows opponent={"false"} blankRows={6 - historyRef.current.length - 1}></BlankRows></div>}
      <input className="fallback-input" ></input>
    </div> 
    <div className="keyboard-container">
        <div className="keyboard">
            <div className="keyrow one">
                {letterKeys[0].map((target) => {
                    const key = keyboard[target].key;
                    const status = keyboard[target].status
                    return (
                        <div  value={key} key={`${key} ${status}`} className={`keytile ${status}`}>
                            <button onClick={(e) => handleKeyChange(e)} data={key} code={key.toUpperCase().charCodeAt(0)} className={`keyboardtile ${status}`}>{key.toUpperCase()}</button>
                        </div>
                    )
                })}
            </div>
            <div className="keyrow two">
                {letterKeys[1].map((target) => {
                    const key = keyboard[target].key;
                    const status = keyboard[target].status
                    return (
                        <div  value={key} key={`${key} ${status}`} className={`keytile ${status}`}>
                            <button onClick={(e) => handleKeyChange(e)} data={key} code={key.toUpperCase().charCodeAt(0)} className={`keyboardtile ${status}`}>{key.toUpperCase()}</button>
                        </div>
                    )
                })}
            </div>
            <div className="keyrow three">
                <div className="keytile none special"  value={"ENTER"}>
                            <button onClick={(e) => handleKeyChange(e)} data={13} code={13} className={`keyboardtile`}>ENTER</button>
                        </div>
                {letterKeys[2].map((target) => {
                    const key = keyboard[target].key;
                    const status = keyboard[target].status
                    return (
                        <div value={key} key={`${key} ${status}`} className={`keytile ${status}`}>
                            <button  onClick={(e) => handleKeyChange(e)} data={key} code={key.toUpperCase().charCodeAt(0)} className={`keyboardtile ${status}`}>{key.toUpperCase()}</button>
                        </div>
                    )
                })}
                <div value={"DELETE"} className="keytile none special">
                    <button onClick={(e) => handleKeyChange(e)} data={8} code={8} className={`keyboardtile`}>BACK</button>
                </div>
            </div>
        </div>
    </div>
  </div>)
}

export default Board;
