import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { DeletePopup } from "./DeletePopup"
import { useState } from "react"
import secureLocalStorage from "react-secure-storage";

export const ProfileCommentCard = function (props) {
    const [buttonPop, setButtonPop] = useState(false);

    //delete my comment
    function deleteCreatedComment(id) {
        try {
            fetch(`http://localhost:8000/api/user/deleteMyComment?session_key=${secureLocalStorage.getItem('session_key')}&comment_id=${id}`,
                { method: 'DELETE' })
                .then(res => res.json())
                .then(
                    (result) => {
                        props.getMyComments();
                    });
        } catch (error) {
            console.error("Error:", error);
        }

    }
    return (
        <div className="d-flex mx-auto my-2 col-8 bg-light ">
            <div className="ps-2">
                <div>
                </div><h2 className="fw-normal"><a rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.comment.recipe.id}>{props.comment.recipe.title}</a></h2>
                <span>{props.comment.content} </span>
                <p><FontAwesomeIcon onClick={() => setButtonPop(true)} icon={faTrash} /></p>
                <DeletePopup trigger={buttonPop} setTrigger={setButtonPop}>
                    <p>Are you sure want to delete this?</p>
                    <div>
                        <button className="btn btn-primary" onClick={()=>{deleteCreatedComment(props.comment.id)}}>Yes</button>
                        <button className="btn btn-primary" onClick={() => setButtonPop(false)} >No</button>
                    </div>
                </DeletePopup>
            </div>


        </div>
    )
}