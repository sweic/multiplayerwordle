import React from 'react';
import {useEffect, useState, useRef} from 'react';
import Board from "./Board";
import {useGame} from '../context/GameContext.js'
import JoinRoom from "./JoinRoom";
import { keyrow1, keyrow2, keyrow3 } from "../constants";

function Wrapper({client}) {
    const {clientID, gameID, gameStatus, setGameStatus, setClientID, setCreateJoin, setGameID, currentName} = useGame();
    const [wordle, setWordle] = useState(null)
    const [error, setError] = useState(null)
    const [players, setPlayers] = useState(null)
    const [gameEnd, setGameEnd] = useState(false)
    const [keys, setKeys] = useState([keyrow1, keyrow2, keyrow3]);
    const [reload, _setReload] = useState(0);
    const [opponentData, setOpponentData] = useState([])
    const reloadRef = useRef(reload);
    
    const setReload = x => {
        reloadRef.current = x;
        _setReload(x);
    }

    useEffect(() => {
        client.onmessage = (message) => {
            const data = JSON.parse(message.data);
            if (data.type == "initial") {
              setClientID(data.clientID)
            }
      
            if (data.type == "create") {
              setGameID(data.gameID);
              setCreateJoin("create");
            }

            if (data.type == "join-error") {
                if (data.message == "full") {
                    setError('Room is full');
                } else {
                    setError ('Invite code is invalid');
                }
            }
            if (data.type == "join-success") {
                setGameID(data.gameID);
                setError(null);

            }
            if (data.type == "start") {
                setWordle(data.wordle)
                setGameID(data.gameID)
                setPlayers(data.players)
                setGameStatus("connected")
                
                
            }
            if (data.type == "winner") {
                
                setGameEnd({status: true, winner: data.winner});
               
                setReload(reloadRef.current + 1);
                
            }
            if (data.type == "update") {
                setOpponentData(data.rows);
            }
            if (data.type == "rematch") {
                setReload(reloadRef.current + 1);
                setGameEnd({status: false, winner: ""});
                setGameStatus("waiting")
                setTimeout(() => {
                    setWordle(data.wordle)
                    setPlayers(data.players)
                    setGameID(data.gameID)
                    setGameEnd(false);
                    setOpponentData([]);
                    setGameStatus("connected");

                }, 1000)
            }

            if (data.type == "max") {
                setGameEnd({status: true, tie: data.tie})
                setReload(reloadRef.current + 1);
            }
          }
      }, [])

    useEffect(() => {
     
    }, [gameStatus])

    const renderSwitch = (gameStatus) => {
        switch(gameStatus) {
            case("waiting"):
                return (<div>Waiting for other player to connect...</div>);
            case("connected"):
                return (<div id="board" className="hundred"><Board keysa={keys} opponentData= {opponentData} clientID={clientID} reload={reloadRef.current} gameID={gameID} client={client} wordle={wordle} players={players} user={currentName} gameEnd={gameEnd}></Board></div>);
            case("none"):
                return (<JoinRoom error={error} client={client}></JoinRoom>)
        }
    }


  return <div className="hundred">{renderSwitch(gameStatus)}</div>
}

export default Wrapper;
