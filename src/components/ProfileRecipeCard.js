import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { DeletePopup } from "./DeletePopup"
import { useState } from "react"
import secureLocalStorage from "react-secure-storage";


export const ProfileRecipeCard = function (props) {
    const [buttonPop, setButtonPop] = useState(false);

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
        <div className="d-flex mx-auto my-2 col-8 bg-light ">
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
            <div className="ps-2">
                <div>
                </div><h2 className="fw-normal"><a rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.recipe.id}>{props.recipe.title}</a></h2>
                <span>{props.recipe.description} </span>
                <p>
                    <a className="btn btn-secondary" rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.recipe.id}>
                        View details »
                    </a>
                </p>
                <p><FontAwesomeIcon onClick={() => setButtonPop(true)} icon={faTrash} /></p>
                <DeletePopup trigger={buttonPop} setTrigger={setButtonPop}>
                    <p>Are you sure want to delete this?</p>
                    <div>
                        <button className="btn btn-primary" onClick={()=>{deleteCreatedRecipe(props.recipe.id)}}>Yes</button>
                        <button className="btn btn-primary" onClick={() => setButtonPop(false)} >No</button>
                    </div>
                </DeletePopup>
            </div>


        </div>
    )
}