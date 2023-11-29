import { faThumbsUp, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { ReplyFormCard } from "./ReplyFormCard";
import secureLocalStorage from "react-secure-storage";

export const SingleCommentCard = function (props) {
    const [reply, setReply] = useState(false);

    function deleteComment(commentId){
        console.log("delete comment "+commentId);
    }

    return (
        <div className="d-flex my-2 col-6 bg-secondary rounded-5 px-3 py-1">
            <div className="ps-2 mx-2 ">
                <div>
                </div><h2 className="fw-normal">{props.comment.user.name}</h2>
                <span>{props.comment.content.length > 200 ? props.comment.content.split('').splice(0, 197).join('') + "..." : props.comment.content}</span>

                <div className="d-flex justify-content-end gap-3">
                    {/* <span className="mx-2 text-primary"><FontAwesomeIcon icon={faThumbsUp} /></span> */}
                    {secureLocalStorage.getItem("username")===props.comment.user.name ?<span onClick={()=>deleteComment(props.comment.id)} className=""><FontAwesomeIcon icon={faTrash} title="Delete comment" /></span> : <></>}
                    {props.comment.parent_comment_id==null?<span className="mx-2 text-danger" onClick={() => setReply(!reply)}>Reply</span>:<></>}
                </div>
                <div>
                    {reply ?
                        <ReplyFormCard recipe={props.recipe} comment={props.comment} />
                        :
                        <></>
                    }
                </div>
                {Object.hasOwn(props.comment, 'children') ?
                    <div>
                        {props.comment.children.length > 0 ?
                            <div>
                                {props.comment.children.map((r) => (
                                    <SingleCommentCard key={r.id} comment={r} recipe={props.recipe} />
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