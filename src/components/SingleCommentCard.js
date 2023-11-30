import { faTurnUp, faThumbsUp, faTrash } from "@fortawesome/free-solid-svg-icons"
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
        <div className={`d-inline-flex my-2 rounded-5 py-1 flex-fill ${props.comment.parent_comment_id==null?"col-9 col-xxl-6":""}`}  key={props.key}>
            <div className="d-flex flex-wrap col-12">
                <div className="py-2 px-3 border border-black flex-fill rounded-2 bg-secondary">
                    <h2 className="fw-normal">{props.comment.user.name}</h2>
                    <span>{props.comment.content}</span>

                    <div className="d-flex gap-4">
                        {/* <span className="mx-2 text-primary"><FontAwesomeIcon icon={faThumbsUp} /></span> */}
                        {props.comment.parent_comment_id==null?<span className="mx-2 text-danger" onClick={() => setReply(!reply)}>Reply</span>:<></>}
                        {secureLocalStorage.getItem("username")===props.comment.user.name ?<span onClick={()=>deleteComment(props.comment.id)} className="text-primary"><FontAwesomeIcon icon={faTrash} title="Delete comment" /></span> : <></>}
                    </div>
                    <div>
                        {reply ?
                            <ReplyFormCard recipe={props.recipe} comment={props.comment} />
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
                                        <FontAwesomeIcon className="rot-r-90 d-inline-block p-4" icon={faTurnUp} />
                                        <SingleCommentCard comment={r} recipe={props.recipe} />
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