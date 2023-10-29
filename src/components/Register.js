import { useState } from "react";
import { redirect } from "react-router-dom";
export const Register = function(){
    const [regUsername, setRegUsername] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPW, setRegConfirmPW] = useState("");
    const [regEmail, setRegEmail] = useState("");
    //register new account
    function register(){
        if(regConfirmPW != regPassword){
            console.log("Pw not matching");
            return;
        }
        try{
            fetch("http://localhost:8000/api/register",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": regUsername,
                "password" : regPassword,
                "email" : regEmail
            })
            })
            .then(res=>res.json())
            .then(
                (result)=>{
                    if(result.status == "success"){
                        redirect("/login");
                    }
            })
        }catch(error){
            console.error("Error:", error);
        }
    }
    return(
        <>
            <h1>Register</h1>
            <input type="text" placeholder="Username" onChange={(e)=>setRegUsername(e.target.value)}/><br/>           
            <input type="password" placeholder="Password" onChange={(e)=>setRegPassword(e.target.value)}/><br/>            
            <input type="password" placeholder="Confirm Your Password" onChange={(e)=>setRegConfirmPW(e.target.value)}/><br/>            
            <input type="email" placeholder="Email" onChange={(e)=>setRegEmail(e.target.value)}/><br/>            
            <button onClick={register}>Submit</button>
        </>
    )
}