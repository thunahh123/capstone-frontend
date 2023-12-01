import { faBookmark, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import secureLocalStorage from "react-secure-storage";
import { ResultPostCard } from "./ResultPostCard";
import { SingleCommentCard } from "./SingleCommentCard";

export const RecipePage = function () {
    const [recipe, setRecipe] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [buttonPop, setButtonPop] = useState(false);
    const [popupMess, setPopupMess] = useState("");
    const [popupGood, setPopupGood] = useState(true);
    let params = useParams();
    useEffect(() => { getRecipe() }, [params.id]);
    useEffect(() => { getComments() }, [recipe]);
    //this function fetch the recipe
    function getRecipe() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/find/${params.id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result.status==="success"){
                            console.log(result.content);
                            setRecipe(result.content);
                        }else{
                            setPopupMess(result.message);
                            setButtonPop(true);
                            setPopupGood(false);
                        }
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    //this function add/remove featured recipe
    function setFeaturedRecipe() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/setFeatured`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "session_key": secureLocalStorage.getItem('session_key'),
                    "recipe_id": params.id
                })
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.status === "success") {
                            getRecipe();
                            console.log(result.message);
                        } else {
                            console.log(result.message);
                        }

                    })
        } catch (error) {
            console.error("Error:", error);
        }

    }

    //add comment on recipe
    function addNewComment() {
        if (newComment.trim().length <= 0) {
            setPopupGood(false);
            setPopupMess("Message must be longer.")
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
                    "recipe_id": recipe.id,
                    "parent_comment_id": null,
                    "content": newComment
                })
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.status === "success") {
                            setPopupGood(true);
                            setNewComment("");
                            getComments();
                            setTimeout(()=>{console.log("closing popup");setButtonPop(false)}, 1500);
                        } else {
                            setPopupGood(false);
                        }
                        setPopupMess(result.message);
                    })
        } catch (error) {
            setPopupMess("Error occurred.");
            setPopupGood(false);
        }

    }

    function commentSubmit(e) {
        e.preventDefault();
        addNewComment();
        setButtonPop(true);
    }

    //fetch comments on recipe
    function getComments() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/getComments/${params.id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        let newComments = structuredClone(result);
                        setComments(newComments);
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    //add saved recipe
    function addSavedRecipe() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/addSavedRecipe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "session_key": secureLocalStorage.getItem("session_key"),
                    "recipe_id": params.id
                })
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.status === "success") {
                            getRecipe();
                            console.log(result.message);
                        }
                        else {
                            console.log(result.message);
                        }
                    }
                );
        }
        catch (error) {
            console.error("Error:", error);
        }
    }

    // remove saved recipe
    function removeSavedRecipe() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/deleteSavedRecipe?session_key=${secureLocalStorage.getItem('session_key')}&recipe_id=${params.id}`,
                { method: 'DELETE' })
                .then(res => res.json())
                .then(
                    (result) => {
                        getRecipe();
                        console.log(result.message);
                    });
        } catch (error) {
            console.error("Error:", error);
        }

    }


    return (
        <div className="col-8 border border-black mx-auto rounded-4 m-5 bg-dark">
            {recipe?
            <>
            <div className="d-flex pt-3">
                <div className="col" />
                <h1 className="col mx-auto text-center">{recipe.title}</h1>
                <div className="col d-flex justify-content-end">
                    <div className="col-10 d-flex flex-column my-2 gap-2">
                        <div>
                            {recipe.saved?.includes(secureLocalStorage.getItem('user_id')) ?
                                <button onClick={() => removeSavedRecipe()} className="btn btn-danger"><FontAwesomeIcon icon={faBookmark} />&nbsp;Unsave</button>
                                :
                                <button onClick={() => addSavedRecipe()} className="btn btn-primary"><FontAwesomeIcon icon={faBookmark} />&nbsp;Save</button>
                            }
                        </div>

                        {/* <span><FontAwesomeIcon icon={faBookmark} onClick={() => addSavedRecipe()} /></span> */}
                        {secureLocalStorage.getItem("is_admin") ?
                            <div className="my-auto">
                                {recipe.featured ?
                                    <button onClick={() => { setFeaturedRecipe() }} className="btn btn-danger">Remove&nbsp;from&nbsp;featured</button>
                                    : <button onClick={() => { setFeaturedRecipe() }} className="btn btn-primary">Mark&nbsp;as&nbsp;featured</button>}
                            </div>
                            :
                            <></>}
                    </div>

                </div>
            </div>
            <div className="mx-5 my-3">
                <div className="d-flex gap-2">
                    <p className="fw-bold">{recipe.user?.name}</p>
                    <p>{new Date(recipe.created_at).toLocaleDateString()}</p>
                </div>
                <p className="text-justify">{recipe.description}</p>

                <div className="d-flex">
                    <div className="d-flex flex-column">
                        <span><strong>COOKING TIME</strong></span>
                        <span>{recipe.cooking_time_in_mins} mins</span>
                    </div>
                    <div className="d-flex flex-column mx-5">
                        <span><strong>SERVINGS</strong></span>
                        <span>{recipe.serving}</span>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="col-3">
                        <h5><strong>Ingredients:</strong></h5>
                        <div >
                            {Object.hasOwn(recipe, "recipe_ingredients") ?

                                <ul className=" mx-auto list-unstyled" >{recipe.recipe_ingredients.map((i, index) => (
                                    <li key={index}>{i.quantity} {i.unit.abbr == "none" ? "" : i.unit.abbr}  {i.ingredient.name} </li>
                                ))}
                                </ul> : <></>
                            }
                        </div>
                    </div>
                    <div>
                        <h5 className="text-center"><strong>Instructions:</strong></h5>
                        <div >
                            {Object.hasOwn(recipe, "direction") ?

                                <ol className="col-8 mx-auto" >{recipe.direction.map((i, index) => (
                                    <li key={index}>{i}</li>
                                ))}
                                </ol> : <></>
                            }
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-primary">Comments <FontAwesomeIcon icon={faComment} /></h2>
                    {/* ratings */}
                    <div><strong>Rate this recipe</strong></div>
                    {/* comment form */}
                    <div>
                        <form className="col-6 d-flex flex-column row-gap-2">
                            <textarea className="form-control" placeholder="What do you think about this recipe?" cols="100" rows="5" type="text" value={newComment} onChange={(e) => { setNewComment(e.target.value) }}> </textarea>
                            <button className="btn btn-primary col-6 col-md-3 col-lg-2 col-xxl-1" onClick={commentSubmit}>Post</button>
                        </form>
                        {/* successfully post a comment notice */}
                        <ResultPostCard trigger={buttonPop} setTrigger={setButtonPop}>
                            <p className={popupGood ? "" : "text-danger"}>{popupMess}</p>
                            <div>
                                <button className="btn btn-primary" onClick={() => setButtonPop(false)} >OK</button>
                            </div>
                        </ResultPostCard>
                    </div>
                    {/* comments display  */}
                    <div className="d-flex flex-column">
                        {comments.map((c) => (
                            <SingleCommentCard key={c.id} comment={c} recipe={recipe} getComments={getComments}/>
                        ))}
                    </div>
                </div>
            </div>
            </>
            :<>Loading...</>}
        </div>
    )
}