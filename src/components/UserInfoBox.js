import secureLocalStorage from 'react-secure-storage';
import { Link, redirect } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export const UserInfoBox = function(props){
    const navigate = useNavigate();

    function logout(){
        
        try{
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/logout`,{
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
                    secureLocalStorage.removeItem("is_admin");
                    props.setUsername(null);
                    
            });
            return navigate('/')
        }catch(error){
            console.error("Error:", error);
        }
        
    }
    
    
    return(
        <div className="col-2 d-flex flex-column justify-content-around">
            {props.username ? 
                <>
                    <span className="fw-semibold text-center" >Signed in as: <a href={`/user/${props.username}`}>{props.username}</a></span>
                    <div className="d-flex justify-content-center">
                        <button className='btn btn-danger' onClick={logout}>Log&nbsp;Out</button>
                    </div> 
                    
                </>
                    :
                <>
                    <span className="fw-semibold text-center">Not signed in </span>
                    <div className="w-60 d-flex justify-content-center">
                        <Link to="/login"><button className='btn btn-danger mx-2'>Sign&nbsp;In</button></Link>
                        <Link to="/register"><button className='btn btn-danger mx-2'>Register</button></Link>
                    </div>
                    
                    
                </>
            }       
        </div>
        
    )
}