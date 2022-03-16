import React from 'react';
import { GameContext } from "../context/GameContext";
import {useContext, useState} from 'react'
function JoinRoom({client, error}) {
  const {setGameID, clientID, gameID, createJoin, setCreateJoin,currentName, setCurrentName} = useContext(GameContext);
  const [inviteCode, setInviteCode] = useState("")
  const [nameError, setError] = useState(null);
 

  const handleCreateRoom = (e) => {
    e.preventDefault()
    if (!currentName) {setError("Please enter a username"); return;}
    const data = {
      type: "create",
      payload: {clientID: clientID, username: currentName}
    }
    client.send(JSON.stringify(data))
    setError(null)
    
    
    
  }
  const handleJoinRoom = (e) => {
    e.preventDefault()
    if (!currentName) {setError("Please enter a username"); return;}
    setCreateJoin("join")
    setError(null)
    
  }

  const handleChange = (e) => {
    e.preventDefault();
    setInviteCode(e.target.value)
    
  } 
  const handleName = (e) => {
    e.preventDefault();
    setCurrentName(e.target.value)
    
  } 

  const handleBack = (e) => {
    e.preventDefault();
    setCreateJoin(null)
  }

  const handleSubmitCode = (e) => {
    e.preventDefault();
    const data = {
      type: "join",
      payload: {code: inviteCode, username: currentName}
    }
    client.send(JSON.stringify(data));
    

  }

  const handleExitRoom = (e) => {
    e.preventDefault();
    const data = {
      type: "exit",
      payload: {gameID: gameID}

    }
    client.send(JSON.stringify(data));
    setCreateJoin(null);
    setGameID(null);
  }

  return <div className="joinroom-container">
    <h2>multiplayer wordle by sw</h2>
    <div className="option-container">
      {!createJoin && <div className="buttons">
          <div className="header">
          <p id="error">{nameError}</p>
          <input className="name-input" placeholder="Enter your username" value={currentName} id="name" onChange={(e) => handleName(e)}></input>
          
          </div>
          <button className="btn-input" onClick={(e) => handleCreateRoom(e)}>Create Room</button>
          <button className="btn-input" onClick={(e) => {handleJoinRoom(e)}}>Join Room</button>
        </div>}
      {createJoin == "create" && <div className="invite-code-container">
        <p>Room Created. Send your friend this invite code!</p>
          <div className="invite-code">{gameID}</div>
          <button className="btn-input" onClick={(e) => handleExitRoom(e)}>Exit Room</button>
        </div>}
      {createJoin == "join" && <div className="invite-code-container">
        <div className="header">
        <p>Enter your invite code</p>
        <p id="error">{error}</p>
        </div>
        <input className="name-input" onChange={(e) => handleChange(e)}></input>
        <button className="btn-input" onClick={(e)=> handleSubmitCode(e)}>Submit</button>
        <button className="btn-input" onClick={(e)=> handleBack(e)}>Back</button>
        </div>}
    </div>
  </div>;
}

export default JoinRoom;
