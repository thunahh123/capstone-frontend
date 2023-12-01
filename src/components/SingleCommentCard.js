import { faTurnUp, faTrash, faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { ReplyFormCard } from "./ReplyFormCard";
import secureLocalStorage from "react-secure-storage";
import { ResultPostCard } from "./ResultPostCard";
import { DeletePopup } from "./DeletePopup";

export const SingleCommentCard = function (props) {
    const [reply, setReply] = useState(false);
    const [editing, setEditing] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [buttonPop, setButtonPop] = useState(false);
    const [message, setMessage] = useState("");
    const [deletePop, setDeletePop] = useState(false);

    //delete a comment/reply
    function deleteComment(commentId) {
        console.log("delete comment " + commentId);
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/deleteComment?session_key=${secureLocalStorage.getItem('session_key')}&comment_id=${commentId}`,
                { method: 'DELETE' })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.status === "success") {
                            setDeletePop(false);
                            props.getComments();
                        }
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function startEditing() {
        setEditing(true);
        setCommentContent(props.comment.content);
    }

    function cancelEdit() {
        setEditing(false);
        setCommentContent("");
    }

    function sendEdit() {
        console.log(`editing - comment id:${props.comment.id},\nnew content: ${commentContent}`)
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/updateComment`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "id": props.comment.id,
                    "session_key": secureLocalStorage.getItem('session_key'),
                    "update_content": commentContent
                })
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result)
                        if (result.status === "success") {
                            props.getComments();
                            setEditing(false);
                            setCommentContent("")
                        }
                        setMessage(result.message);
                        setButtonPop(true);
                    }
                );
        } catch (error) {
            console.error("Error:", error);
            setMessage(error);
        }
    }

    function endReply() {
        setReply(false);
    }

    return (
        <div className={`d-inline-flex my-2 rounded-5 py-1 flex-fill ${props.comment.parent_comment_id == null ? "col-9 col-xxl-6" : ""}`}>
            <div className="d-flex flex-wrap col-12">
                <div className="py-2 px-3 border border-black flex-fill rounded-2 bg-secondary">
                    <div className="d-flex gap-3 align-items-center">
                        <h2 className="fw-normal">{props.comment.user ? props.comment.user.name : "[deleted user]"}</h2>
                        {props.comment.created_at !== props.comment.updated_at ? <span className="fst-italic fw-light">(edited)</span> : <></>}
                    </div>
                    {editing ? <textarea cols="30" rows="10" value={commentContent} onChange={(e) => { setCommentContent(e.target.value) }}></textarea> : <span>{props.comment.content}</span>}
                    <ResultPostCard trigger={buttonPop} setTrigger={setButtonPop}>
                        <p className={buttonPop ? "" : "text-danger"}>{message}</p>
                        <div>
                            <button className="btn btn-primary" onClick={() => { setButtonPop(false) }} >OK</button>
                        </div>
                    </ResultPostCard>
                    <div className="d-flex gap-4">
                        {/* <span className="mx-2 text-primary"><FontAwesomeIcon icon={faThumbsUp} /></span> */}
                        {editing ?
                            <>
                                <button className="btn btn-primary" onClick={sendEdit}>Update</button>
                                <button className="btn btn-danger" onClick={cancelEdit}>Cancel</button>
                            </>
                            : <>
                                {props.comment.parent_comment_id == null ? <span className="mx-2 text-danger" onClick={() => setReply(!reply)}>Reply</span> : <></>}
                                {secureLocalStorage.getItem("user_id") === props.comment.author_id || secureLocalStorage.getItem("is_admin") ? <span onClick={(e)=>{setDeletePop(true);e.preventDefault()}} className="text-primary"><FontAwesomeIcon icon={faTrash} title="Delete comment" /></span> : <></>}
                                {secureLocalStorage.getItem("user_id") === props.comment.author_id || secureLocalStorage.getItem("is_admin") ? <span onClick={() => startEditing()} className="text-primary"><FontAwesomeIcon icon={faPen} title="Edit comment" /></span> : <></>}

                            </>}
                    </div>
                    <DeletePopup trigger={deletePop} setTrigger={setDeletePop}>
                        <p>Are you sure want to delete this?</p>
                        <div>
                            <button className="btn btn-primary m-2" onClick={() => { deleteComment(props.comment.id) }}>Yes</button>
                            <button className="btn btn-primary m-2" onClick={() => { setDeletePop(false) }} >No</button>
                        </div>
                    </DeletePopup>
                    <div>
                        {reply ?
                            <ReplyFormCard recipe={props.recipe} comment={props.comment} getComments={props.getComments} endReply={endReply} />
                            :
                            <></>
                        }
                    </div>
                </div>
                {Object.hasOwn(props.comment, 'children') ?
                    <div className="col-12 d-flex justify-content-end">
                        {props.comment.children.length > 0 ?
                            <div className="flex-fill"   >
                                {props.comment.children.map((r) => (
                                    <div className=" d-flex" key={r.id}>
                                        <FontAwesomeIcon className="rot-r-90 d-inline-block p-4 z-0" icon={faTurnUp} />
                                        <SingleCommentCard getComments={props.getComments} comment={r} recipe={props.recipe} />
                                    </div>
                                ))}
                            </div>
                            :
                            <></>}
                    </div> :
                    <></>
                }
            </div>


        </div>
    )
}