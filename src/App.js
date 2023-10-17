import './App.css';
import React, { useState, useEffect } from 'react';
import {Header} from './components/Header';
import {Nav} from './components/Nav';
import {Main} from './components/Main';
//import {Footer} from './components/Footer';
import secureLocalStorage from 'react-secure-storage';




function App() {
  const [username, setUsername] = useState(secureLocalStorage.getItem("username"));
  useEffect(()=>{
    if(secureLocalStorage.getItem("session_key")){
      return;
    }
    secureLocalStorage.setItem("username",null);
    setUsername(null);
  },[])
  return (
      <div className="App">
        <Header username={username} setUsername={setUsername}/>
        <Nav/>
        <Main username={username} setUsername={setUsername}/>
         {secureLocalStorage.getItem("session_key")}     
      
      </div>
  );
}

export default App;
