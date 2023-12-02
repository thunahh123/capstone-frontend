import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { DeletePopup } from "./DeletePopup"
import { useState } from "react"
import secureLocalStorage from "react-secure-storage";


export const ProfileRecipeCard = function (props) {
    const [deletePop, setDeletePop] = useState(false);

    //delete my recipe
    function deleteCreatedRecipe(id){
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/deleteRecipe?session_key=${secureLocalStorage.getItem('session_key')}&recipe_id=${id}`,
            {method: 'DELETE'})
                .then(res => res.json())
                .then(
                    (result) => {
                        props.getMyRecipes();
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    
    }
    return (
        <div className="d-flex mx-auto my-2 col-8 bg-secondary rounded-5 px-3 py-1">
            <div className="my-auto">
                <svg
                    className="bd-placeholder-img rounded-circle"
                    width="140"
                    height="140"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Placeholder"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                >
                    <title></title>
                    <rect
                        width="100%"
                        height="100%"
                        fill="var(--bs-secondary-color)"
                    ></rect>
                </svg>
            </div>
            <div className="d-flex flex-column ps-2 w-100">
                <h2 className="fw-normal"><a className="link-underline link-underline-opacity-0" rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.recipe.id}>{props.recipe.title}</a></h2>
                <span>{props.recipe.description.length>200 ? props.recipe.description.split('').splice(0,197).join('')+"..." : props.recipe.description}</span>
                <p>
                    <a className="btn btn-primary" rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.recipe.id}>
                        View details »
                    </a>
                </p>
                <div className="d-flex gap-3">
                    <span title="Delete Recipe" className="" role="button"><FontAwesomeIcon onClick={() => setDeletePop(true)} icon={faTrash} /></span>
                    <a title="Edit Recipe" className="" href={`/updateRecipe/${props.recipe.id}`}><FontAwesomeIcon icon={faEdit} /></a>
                </div>
                <DeletePopup trigger={deletePop} setTrigger={setDeletePop}>
                    <p>Are you sure want to delete this?</p>
                    <div>
                        <button className="btn btn-primary m-2" onClick={()=>{deleteCreatedRecipe(props.recipe.id)}}>Yes</button>
                        <button className="btn btn-primary m-2" onClick={() => setDeletePop(false)} >No</button>
                    </div>
                </DeletePopup>
            </div>


        </div>
    )
}