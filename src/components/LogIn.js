import { useState } from "react"
import secureLocalStorage from "react-secure-storage";

export const LogIn = function(params){
    const [logUsername, setLogUsername] = useState("");
    const [logPassword, setLogPassword] = useState("");

    function tryLogIn(){
        try{
            fetch("http://localhost:8000/api/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": logUsername,
                "pw": logPassword
            })
            })
            .then(res=>res.json())
            .then(
                (result)=>{
                    secureLocalStorage.setItem("session_key", result.session_key);
                    secureLocalStorage.setItem("username", logUsername);
                    params.setUsername(logUsername);
                    console.log(result);
            })
        }catch(error){
            console.error("Error:", error);
        }
        
    }
    return (
        <>
            <h1>Log In</h1>
            <input type="text" placeholder="Username" onChange={(e)=>setLogUsername(e.target.value)}/><br/>            
            <input type="password" placeholder="Password" onChange={(e)=>setLogPassword(e.target.value)}/><br/>            
            <button onClick={tryLogIn}>Submit</button>
        </>
    )
}