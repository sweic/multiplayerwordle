import React from 'react';
import {createContext, useState, useContext} from 'react'

export const GameContext = createContext();


function GameProvider({children}) {
    const [gameID, setGameID] = useState(null);
    const [clientID, setClientID] = useState(null);
    const [gameStatus, setGameStatus] = useState("none");
    const [createJoin, setCreateJoin] = useState(null)
    const [currentName, setCurrentName] = useState(null)
  return <GameContext.Provider value={{currentName, setCurrentName, createJoin, setCreateJoin, gameID, setGameID, gameStatus, setGameStatus, clientID, setClientID}}>{children}</GameContext.Provider>
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider component")
  }
  return context;
}
export default GameProvider;
