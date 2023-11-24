import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const Register = function(){
    const [regUsername, setRegUsername] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPW, setRegConfirmPW] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    //register new account
    function register(){
        if(regConfirmPW !== regPassword){
            setMessage("Passwords do not match");
            return;
        }
        try{
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register`,{
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
                    if(result.status === "success"){
                        setMessage(result.message);
                        setTimeout(()=>{navigate('/login')},1000);                     
                    }else{
                        setMessage(result.message);
                    }
            })
        }catch(error){
            console.error("Error:", error);
            setMessage(error);
        }
    }
    return(
        <div className="d-flex flex-column py-4 border border-black col-6 col-lg-3 m-auto bg-white mt-5 rounded-4">
            <h1>Register</h1>
            <input className="col-5 col-md-6 m-auto my-1" type="text" placeholder="Username" onChange={(e)=>setRegUsername(e.target.value)}/><br/>           
            <input className="col-5 col-md-6 m-auto my-1" type="password" placeholder="Password" onChange={(e)=>setRegPassword(e.target.value)}/><br/>            
            <input className="col-5 col-md-6 m-auto my-1" type="password" placeholder="Confirm Password" onChange={(e)=>setRegConfirmPW(e.target.value)}/><br/>            
            <input className="col-5 col-md-6 m-auto my-1" type="email" placeholder="Email" onChange={(e)=>setRegEmail(e.target.value)}/><br/>            
            <p className="fw-semibold text-danger">{message}</p>
            <button className="btn btn-danger col-4 m-auto my-1" onClick={register}>Submit</button>
        </div>
    )
}