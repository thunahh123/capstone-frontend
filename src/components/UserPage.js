import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { ProfileSavedRecipeCard } from "./ProfileSavedRecipeCard";
import { ProfileRecipeCard } from "./ProfileRecipeCard";
import { ProfileCommentCard } from "./ProfileCommentCard";


export const UserPage = function () {
    const [user, setUser] = useState({});
    const [menu, setMenu] = useState("saved recipes");
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [myRecipes, setMyRecipes] = useState([]);
    const [myComments, setMyComments]= useState([]);
    let params = useParams();

    //useEffect function
    useEffect(() => { getUser() }, [params.name]);
    useEffect(()=>{getSavedRecipes()},[]);
    useEffect(()=>{getCreatedRecipes()},[]);
    useEffect(()=>{getComments()},[]);
    //getuser
    function getUser() {
        try {
            fetch(`http://localhost:8000/api/user/getName/${params.name}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setUser(result);
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    //get saved recipes
    function getSavedRecipes(){
        try {
            fetch(`http://localhost:8000/api/user/savedRecipes/?session_key=${secureLocalStorage.getItem('session_key')}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setSavedRecipes(result);
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    
    }
    
    //get all created recipes
    function getCreatedRecipes(){
        try {
            fetch(`http://localhost:8000/api/user/getCreatedRecipes?session_key=${secureLocalStorage.getItem('session_key')}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setMyRecipes(result);
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }
    //get all comments 
    function getComments(){
        try {
            fetch(`http://localhost:8000/api/user/getComments?session_key=${secureLocalStorage.getItem('session_key')}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setMyComments(result);
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }
    //function delete
    return (
        <div className="d-flex flex-column h-100 flex-grow-1 border-top border-secondary">
            <div className="d-flex flex-wrap flex-grow-1">
                {/* user info */}
                <div className="col-12 col-md-4 col-lg-3 bg-dark d-flex flex-grow-1 flex-column text-secondary">
                    <h4 className="text-center col-12 py-3">User Info</h4>
                    <img src="" alt="" width="150" height="150"></img>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Date created:</strong> {user.created_at}</div>
                    <div><strong>Last login:</strong> {user.last_login}</div>
                    <div><a href={`/user/update/email`}>Update Email</a></div>
                    <div><a href={`/user/update/password`}>Update Password</a></div>
                </div>

                {/* user content */}
                <div className="col-12 col-md-8 col-lg-9">
                    <h4 className="text-center col-12">My Profile</h4>
                    <div>
                        <form className="d-flex flex-column col-6 mx-auto text-start">
                            <label>
                                <input type="radio" name="menu" value="saved recipes" onChange={(e) => setMenu(e.target.value)} checked={menu == "saved recipes"} />
                                Saved Recipe
                            </label>
                            <label>
                                <input type="radio" name="menu" value="my recipes" onChange={(e) => setMenu(e.target.value)} checked={menu == "my recipes"} />
                                My Recipes
                            </label>
                            <label>
                                <input type="radio" name="menu" value="my comments" onChange={(e) => setMenu(e.target.value)} checked={menu == "my comments"} />
                                My Comments
                            </label>
                        </form>
                    </div>
                    <div>
                        {menu === "saved recipes" ?
                            <div>
                                <h3>My Saved Recipes</h3>
                                <div>
                                    {savedRecipes.map((s)=>(<ProfileSavedRecipeCard key={s.id} savedRecipe={s} getSavedRecipes={getSavedRecipes}/>))}
                                </div>

                            </div> 
                        :
                        menu === "my recipes" ?
                            <div>
                                <h3>My Recipes</h3>
                                <div>
                                {myRecipes.map((r)=>(<ProfileRecipeCard key={r.id} recipe={r} getMyRecipes={getCreatedRecipes}/>))}
                                </div>
                            </div> 
                        :
                            <div>
                                <h3>My Comments</h3>
                                {myComments.map((c)=>(<ProfileCommentCard key={c.id} comment={c} getMyComments={getComments}/>))}
                            </div>
                        }
                    </div>


                </div>
            </div>

        </div>
    )
}