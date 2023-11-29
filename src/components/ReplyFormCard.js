import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { ResultPostCard } from "./ResultPostCard";


export const ReplyFormCard = function (props) {
    const [newReply, setNewReply] = useState("");
    const [buttonPop, setButtonPop] = useState(false);
    const [popupMess, setPopupMess] = useState("");
    const [popupGood, setPopupGood] = useState(true);
    function addNewReply() {
        if (newReply.trim().length <= 0) {
            setPopupGood(false);
            setPopupMess("Reply must be longer.")
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
                            setPopupGood(true);
                            setNewReply("");
                        } else {
                            setPopupGood(false);
                        }
                        setPopupMess(result.message);
                    })
        } catch (error) {
            console.error("Error:", error);
            setPopupMess("Error occurred.");
            setPopupGood(false);
        }

    }
    function replySubmit(e) {
        e.preventDefault();
        addNewReply();
        setButtonPop(true);
    }

    return (
        <div>
            <form className="col-12 d-flex flex-row">
                <textarea className="form-control mx-2" cols="30" rows="1" type="text" value={newReply} onChange={(e) => { setNewReply(e.target.value) }}> </textarea>
                <button className="btn btn-primary" onClick={replySubmit}>Post</button>
            </form>
            {/* successfully post a comment notice */}
            <ResultPostCard trigger={buttonPop} setTrigger={setButtonPop}>
                <p className={popupGood ? "" : "text-danger"}>{popupMess}</p>
                <div>
                    <button className="btn btn-primary" onClick={() => setButtonPop(false)} >OK</button>
                </div>
            </ResultPostCard>
        </div>

    )
}