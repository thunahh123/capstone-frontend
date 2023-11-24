import { useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export const UpdateEmail = function () {
    const [newEmail, setNewEmail] = useState("");
    const [confirmedEmail, setConfirmedEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    //this function is to update the email
    function tryUpdateEmail() {
        //check if new email and confirmed one are same?
        if (confirmedEmail !== newEmail) {
            setMessage("Emails do not match");
            return;
        }
        //fetch
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/updateEmail`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "password": password,
                    "session_key": secureLocalStorage.getItem('session_key'),
                    "newemail": newEmail
                })
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "success") {
                        setMessage(result.message);
                        setPassword("");
                        setNewEmail("");
                        setConfirmedEmail("");
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
    return (
        <div className="d-flex flex-column py-4 border border-black col-6 col-lg-3 m-auto bg-white mt-5 rounded-4">
            <h1 className="mb-4">Update Your Email</h1>
            <input className="col-5 col-md-6 m-auto my-1" type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
            <input className="col-5 col-md-6 m-auto my-1" type="email" placeholder="New Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /><br />
            <input className="col-5 col-md-6 m-auto my-1" type="email" placeholder="Confirm New Email" value={confirmedEmail} onChange={(e) => setConfirmedEmail(e.target.value)} /><br />
            <p className="fw-semibold text-danger">{message}</p>
            <button className="btn btn-danger col-4 m-auto my-1" onClick={()=>{tryUpdateEmail()}}>Update</button>
        </div>
    )
}