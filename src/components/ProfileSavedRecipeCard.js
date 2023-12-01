import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { DeletePopup } from "./DeletePopup"
import { useState } from "react"
import secureLocalStorage from "react-secure-storage";


export const ProfileSavedRecipeCard = function (props) {
    const [buttonPop, setButtonPop] = useState(false);


    //delete saved recipe
    function deleteSavedRecipe(id){
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/deleteSavedRecipe?session_key=${secureLocalStorage.getItem('session_key')}&recipe_id=${id}`,
            {method: 'DELETE'})
                .then(res => res.json())
                .then(
                    (result) => {
                        props.getSavedRecipes();
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
            <div className="ps-2">
                <div>
                </div><h2 className="fw-normal"><a className="link-underline link-underline-opacity-0" rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.savedRecipe.id}>{props.savedRecipe.title}</a></h2>
                <span>{props.savedRecipe.description.length>200 ? props.savedRecipe.description.split('').splice(0,197).join('')+"..." : props.savedRecipe.description}</span>
                <p>
                    <a className="btn btn-primary" rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.savedRecipe.id}>
                        View details »
                    </a>
                </p>
                <p><FontAwesomeIcon onClick={()=>setButtonPop(true)} icon={faTrash} /></p>
                <DeletePopup trigger={buttonPop} setTrigger={setButtonPop}>
                    <p>Are you sure want to delete this?</p>
                    <div>
                        <button className="btn btn-primary m-2" onClick={()=>{deleteSavedRecipe(props.savedRecipe.id)}}>Yes</button>
                        <button className="btn btn-primary m-2" onClick={()=>{setButtonPop(false)}} >No</button>
                    </div>
                </DeletePopup>
            </div>


        </div>
    )
}