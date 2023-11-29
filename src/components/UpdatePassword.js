import { useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export const UpdatePassword = function () {
    const[password,setPassword] = useState("");
    const[newPass, setNewPass] = useState("");
    const[confirmedPass, setConfirmedPass] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    //this function is to update the password
    function tryUpdatePassword() {
        //check if new email and confirmed one are same?
        if (confirmedPass !== newPass) {
            setMessage("Emails do not match");
            return;
        }
        //fetch
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/updatePW`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "password": password,
                    "session_key": secureLocalStorage.getItem('session_key'),
                    "newpw": newPass
                })
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "success") {
                        setMessage(result.message);
                        setPassword("");
                        setNewPass("");
                        setConfirmedPass("");
                        setTimeout(()=>{navigate(`/user/${secureLocalStorage.getItem("username")}`)},1000);
                    } else {
                        setMessage(result.message);
                    }
                })
        } catch (error) {
            console.error("Error:", error);
            setMessage(error);
        }


    }
    return(
        <div className="d-flex flex-column py-4 border border-black col-6 col-lg-3 m-auto bg-dark mt-5 rounded-4">
            <h1 className="mb-4 text-center">Update Your Password</h1>
            <input className="col-5 col-md-6 m-auto my-1" type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
            <input className="col-5 col-md-6 m-auto my-1" type="password" placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} /><br />
            <input className="col-5 col-md-6 m-auto my-1" type="password" placeholder="Confirm New Password" value={confirmedPass} onChange={(e) => setConfirmedPass(e.target.value)} /><br />
            <p className="fw-semibold text-danger text-center">{message}</p>
            <button className="btn btn-danger col-4 m-auto my-1" onClick={()=>{tryUpdatePassword()}}>Update</button>
        </div>
    )
}