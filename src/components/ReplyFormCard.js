import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { ResultPostCard } from "./ResultPostCard";


export const ReplyFormCard = function (props) {
    const [newReply, setNewReply] = useState("");
    const [buttonPop, setButtonPop] = useState(false);
    const [message, setMessage] = useState("");
    
    function addNewReply() {
        if (newReply.trim().length <= 0) {
            setMessage("Reply must be longer.")
            setButtonPop(true);            
            return;
        }
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/addComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "session_key": secureLocalStorage.getItem('session_key'),
                    "recipe_id": props.recipe.id,
                    "parent_comment_id": props.comment.id,
                    "content": newReply
                })
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "success") {
                        setNewReply("");
                        props.getComments()
                    }
                    setMessage(result.message);
                    setButtonPop(true);
                    setTimeout(()=>{props.endReply();}, 1500);
                    
                })
        } catch (error) {
            console.error("Error:", error);
            setMessage("Error occurred.");
            setButtonPop(false);
        }

    }
    function replySubmit(e) {
        e.preventDefault();
        addNewReply();
    }

    return (
        <div>
            <form className="col-12 d-flex flex-row">
                <textarea className="form-control mx-2" cols="30" rows="1" type="text" value={newReply} onChange={(e) => { setNewReply(e.target.value) }}> </textarea>
                <button className="btn btn-primary" onClick={replySubmit}>Post</button>
            </form>
            {/* successfully post a comment notice */}
            <ResultPostCard trigger={buttonPop} setTrigger={setButtonPop}>
                <p className={buttonPop ? "" : "text-danger"}>{message}</p>
                <div>
                    <button className="btn btn-primary" onClick={() => {setButtonPop(false); props.endReply();}} >OK</button>
                </div>
            </ResultPostCard>
        </div>

    )
}