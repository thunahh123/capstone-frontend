import './App.css';
import React, { useState, useEffect } from 'react';
import {Header} from './components/Header';
import {Main} from './components/Main';
import {Footer} from './components/Footer';
import secureLocalStorage from 'react-secure-storage';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const [username, setUsername] = useState(secureLocalStorage.getItem("username"));
  useEffect(()=>{
    if(secureLocalStorage.getItem("session_key")){
      return;
    }
    secureLocalStorage.removeItem("username");
    setUsername(null);
  },[])
  return (
      <div className="App d-flex flex-column h-100">
        <Header username={username} setUsername={setUsername}/>
        <Main username={username} setUsername={setUsername}/>     
        <Footer/>
      </div>
  );
}

export default App;
