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
        <div className="d-flex flex-column py-4 border border-black col-6 col-md-3 m-auto bg-white mt-5 rounded-4">
            <h1 className="mb-4">Sign In</h1>
            <input className="col-5 col-md-6 m-auto my-1" type="text" placeholder="Username" onChange={(e)=>setLogUsername(e.target.value)}/><br/>            
            <input className="col-5 col-md-6 m-auto my-1" type="password" placeholder="Password" onChange={(e)=>setLogPassword(e.target.value)}/><br/>            
            <button className="btn btn-danger col-4 m-auto my-1" onClick={tryLogIn}>Submit</button>
        </div>
    )
}