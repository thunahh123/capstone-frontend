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
        <div className="col-2 text-danger d-flex flex-column justify-content-around">
            {params.username ? 
                <>
                    <span className="fw-semibold">Signed in as: {params.username}</span>
                    <div>
                        <button className='btn btn-danger' onClick={logout}>Log&nbsp;Out</button>
                    </div> 
                    
                </>
                    :
                <>
                    <span className="fw-semibold">Not signed in </span>
                    <div className="w-60 d-flex justify-content-center">
                        <Link to="/login"><button className='btn btn-danger mx-2'>Sign&nbsp;In</button></Link>
                        <Link to="/register"><button className='btn btn-danger mx-2'>Register</button></Link>
                    </div>
                    
                    
                </>
            }       
        </div>
        
    )
}