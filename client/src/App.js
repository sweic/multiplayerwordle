import './styles.css';
import {w3cwebsocket as W3CWebSocket} from "websocket";
import Wrapper from "./components/Wrapper";

const client = new W3CWebSocket('wss://wordsles.herokuapp.com');

function App() {
  
  return (
    <div className="App">
     <Wrapper client={client}></Wrapper>
     
    </div>
  );
}

export default App; 
