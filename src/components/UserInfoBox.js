import secureLocalStorage from 'react-secure-storage';
import { Link } from 'react-router-dom';

export const UserInfoBox = function(params){
    

    function logout(){
        
        try{
            fetch("http://localhost:8000/api/logout",{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "session_key": secureLocalStorage.getItem("session_key")
            })
            })
            .then(res=>res.json())
            .then(
                (result)=>{
                    secureLocalStorage.removeItem("session_key");
                    secureLocalStorage.removeItem("username");
                    params.setUsername(null);
                    //console.log(result);
            })
        }catch(error){
            console.error("Error:", error);
        }
        
    }
    
    
    return(
        <>
            {params.username ? 
                <div>
                    Logged In As {params.username} 
                    <button onClick={logout}>Log Out</button>
                </div> 
                    :
                <div>
                    Not Logged In 
                    <Link to="/login"><button>Log In</button></Link>
                    <Link to="/register"><button>Register</button></Link>
                    
                </div>}       
        </>
        
    )
}