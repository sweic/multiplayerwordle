import { VALIDGUESSES, WORDS } from "../constants";
import {useState} from 'react'
import { useStateRef } from "./useStateRef";
import {fullKeyboard} from '../constants.js';

export const useGameStatus = () => {
    const [gameStatus, gameStatusRef, setGameStatus] = useStateRef(false);
    const [currentRow, currentRowRef, setCurrentRow] = useStateRef([])
    const [history, historyRef, setHistory] = useStateRef([])
    const [error, setError] = useState(false)
    const [winner, setWinner] = useState(null);
    const [rematch, setRematch] = useState(false);
    const [keyboard, setKeyboard] = useState(fullKeyboard)
    const [counter, setCounter] = useState(0)
    const [tie, setTie] = useState(false)

    const checkKey = (e, wordle, client, clientID, gameID, user)  => {
      
        if (historyRef.current.length == 6 || gameStatusRef.current ) return;
    
      
        if (currentRowRef.current.length == 5) {
            
            if (e.keyCode == 13) {
               
                var word = currentRowRef.current
                if (!VALIDGUESSES.includes(word.join('')) && !WORDS.includes(word.join(''))) {
                    setError(true);
                    setTimeout(() => {
                        setError(false)
                    }, 2000)
                    return 
                }
           var target = wordle;
           const final = computeGuess(currentRowRef.current, wordle);
           setHistory([...historyRef.current, final])
           setCurrentRow([])
         
           client.send(JSON.stringify({type: "update", payload: {rows: historyRef.current, clientID: clientID, gameID: gameID}}));
           if (final.every((value) => value.status == "green")) {
            const data = {
                type: "winner",
                payload: {
                    winner: user,
                    gameID: gameID
                    }
            }
            client.send(JSON.stringify(data));
            setWinner(true);
            setRematch(true);
            return;
         }
         if (historyRef.current.length == 6) {
             const data = {
                 type:"max",
                 payload: {gameID: gameID}
             }
    
             client.send(JSON.stringify(data));
             
         }
            } 
            else if (e.keyCode == 8) {
                const tmp = currentRowRef.current.slice(0, currentRowRef.current.length - 1)
                setCurrentRow(tmp)
            }
        } else if (e.keyCode == 8) {
            const tmp = currentRowRef.current.slice(0, currentRowRef.current.length - 1)
            setCurrentRow(tmp)
        } else if (currentRowRef.current.length < 5) {
            if (e.keyCode >= 65 && e.keyCode <= 90) {
                setCurrentRow([...currentRowRef.current, e.key])
            }
    
        }
        
    }


    const resetKeys = (dirtyKeys) => {
        for (var i of Object.keys(dirtyKeys)) {
            dirtyKeys[i].status = "none";
        }
        return dirtyKeys;
    }

     
    const colourKeys = (initKeysOne) => {
        const idx = history.length - 1;
        for (var i in history[idx]) {
            const targetKey = history[idx][i].key;
            if (initKeysOne[targetKey].status == "green") continue;
            if (initKeysOne[targetKey].status == "yellow" && history[idx][i].status == "gray") continue;
            initKeysOne[targetKey].status = history[idx][i].status; 
        }
        return initKeysOne;
    }
    const computeGuess = (guess, wordle) => {
    
        var target = wordle.split('');
        var letters = guess
        var final = Array(target.length)
        var unchecked = Array(target.length).fill(0);
    


        for (var i in letters) {
            if (letters[i] == target[i]) {
                final[i] = ({key: letters[i], status: "green"})
                unchecked[i] = 1
                target[i] = null;
                letters[i] = null;
                
            }
        }

        for (var j in letters) {
            if (letters[j] == null) continue;
            if (target.includes(letters[j])) {
                final[j] = ({key: letters[j], status: "yellow"})
                unchecked[j] = 1;
                const idx = target.indexOf(letters[j]);
                target[idx] = null;
                letters[j] = null;
            }
        }

        for (var k in unchecked) {
            if (unchecked[k] == 0) {
                final[k] = ({key: letters[k], status: "gray"});
            }
        }
    
        return final;

    }
    
    const updateKeys = () => {
        if (history.length > 0) {
            const initKeys1 = fullKeyboard;
            var initKeysOne = colourKeys(initKeys1, history);
        setKeyboard(initKeysOne)
        setCounter(counter + 1)
        }
    }

    const resetGame = () => {
        const dirty = fullKeyboard;
    var newKeys = resetKeys(dirty);
    if (!gameStatusRef.current) {
        setTimeout(() => {
            setKeyboard(newKeys)
            setCounter(counter + 1)
        }, 100)
    }
    setHistory([])
    setCurrentRow([]);
    setWinner(null);
    setTie(false)
    
    }

    const handleGameState = (gameEnd, user) => {
        if (gameStatusRef.current) {
            if (gameEnd.winner == user) {
                setWinner(true)
            } else if (gameEnd.tie) {
                setTie(true)
            } else {
                setWinner(false)
            }
            setRematch(true);
        }
    }


    return {gameStatusRef, setGameStatus, currentRow, currentRowRef, setCurrentRow, history, historyRef, setHistory, error, setError, winner, setWinner, rematch, setRematch, resetKeys, colourKeys, checkKey, counter, setCounter, updateKeys, tie, setTie, keyboard, setKeyboard, resetGame, handleGameState}

}


