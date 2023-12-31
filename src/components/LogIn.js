import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export const LogIn = function(props){
    const [logUsername, setLogUsername] = useState("");
    const [logPassword, setLogPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    function tryLogIn(){
        try{
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`,{
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
                    if(result.status === "success"){
                        secureLocalStorage.setItem("session_key", result.session_key);
                        secureLocalStorage.setItem("username", logUsername);
                        secureLocalStorage.setItem("is_admin", result.is_admin);
                        secureLocalStorage.setItem("user_id", result.user_id)
                        props.setUsername(logUsername);
                        navigate("/");
                    }else{
                        setMessage(result.message);
                    }
                    
            })
        }catch(error){
            console.error("Error:", error);
        }
        
    }
    return (
        <div className="d-flex flex-column py-4 border border-black col-6 col-lg-3 m-auto mt-5 rounded-4 bg-dark">
            <h1 className="mb-4 text-center">Sign In</h1>
            <input className="col-5 col-md-6 m-auto my-1 rounded-3" type="text" placeholder="Username" onChange={(e)=>setLogUsername(e.target.value)}/><br/>            
            <input className="col-5 col-md-6 m-auto my-1 rounded-3" type="password" placeholder="Password" onChange={(e)=>setLogPassword(e.target.value)}/><br/>            
            <p className="fw-semibold text-danger text-center">{message}</p>
            <button className="btn btn-danger col-4 m-auto my-1" onClick={tryLogIn}>Submit</button>
            <NavLink className="text-center" to="/register">Create an account</NavLink>
        </div>
    )
}