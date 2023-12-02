import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { ProfileSavedRecipeCard } from "./ProfileSavedRecipeCard";
import { ProfileRecipeCard } from "./ProfileRecipeCard";
import { ProfileCommentCard } from "./ProfileCommentCard";
import myProfile from "../images/profile.jpg";
import { DeletePopup } from "./DeletePopup";


export const UserPage = function (props) {
    const [user, setUser] = useState(null);
    const [menu, setMenu] = useState("saved recipes");
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [myRecipes, setMyRecipes] = useState([]);
    const [myComments, setMyComments] = useState([]);
    const [deletePop, setDeletePop] = useState(false);
    let params = useParams();
    const navigate = useNavigate();

    //useEffect function
    useEffect(() => { getUser() }, [params.name]);
    useEffect(() => { getSavedRecipes() }, [user]);
    useEffect(() => { getCreatedRecipes() }, [user]);
    useEffect(() => { getComments() }, [user]);
    //getuser
    function getUser() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/getName/${params.name}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result.status==="success"){
                            setUser(result.content);
                        }
                        else{
                            navigate('/');
                        }
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    //get saved recipes
    function getSavedRecipes() {
        if (!user)
            return;
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/savedRecipes/?session_key=${secureLocalStorage.getItem('session_key')}&id=${user.id}`)
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
    function getCreatedRecipes() {
        if (!user)
            return;
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/getCreatedRecipes?session_key=${secureLocalStorage.getItem('session_key')}&id=${user.id}`)
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
    function getComments() {
        if (!user)
            return;
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/getComments?session_key=${secureLocalStorage.getItem('session_key')}&id=${user.id}`)
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
    function confirmDeleteAccount() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/delete?session_key=${secureLocalStorage.getItem('session_key')}&user_id=${secureLocalStorage.getItem('user_id')}`,
                {
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result);
                        if (result.status === "success") {
                            secureLocalStorage.clear();
                            props.setUsername(null);
                            navigate('/');
                        } 

                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }


    return (
        user && savedRecipes && myComments && myRecipes ?
            <div className="d-flex flex-column h-100 flex-grow-1 border-top border-secondary">
                <div className="d-flex flex-wrap flex-grow-1">
                    {/* user info */}
                    <div className="col-12 col-md-3 col-xxl-2 bg-dark d-flex flex-column text-center gap-5">
                        <h4 className="col-12 py-3">Personal Infomation</h4>
                        <img className="mx-auto" src={myProfile} alt="profile picture" width="150" height="150"></img>
                        <h3 className="text-center text-primary">{user.name}</h3>
                        {user?.name === secureLocalStorage.getItem('username') ? <div><strong>Email:</strong> {user.email}</div> : <></>}
                        <div><strong>Date created:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
                        <div><strong>Last login:</strong> {user.last_login}</div>
                        {
                            user?.name === secureLocalStorage.getItem('username') ?
                                <>
                                    <div><a href={`/user/update/email`}>Update Email</a></div>
                                    <div><a href={`/user/update/password`}>Update Password</a></div>
                                    {!secureLocalStorage.getItem('is_admin') ?
                                    <>
                                    <div className="d-flex flex-column justify-content-end py-3 flex-grow-1"><button className="btn btn-link link-danger" onClick={()=>{setDeletePop(true)}} >Delete My Account</button></div>
                                    <DeletePopup trigger={deletePop} setTrigger={setDeletePop}>
                                        <p>Are you sure want to delete this account permanently?</p>
                                        <div>
                                            <button className="btn btn-primary m-2" onClick={confirmDeleteAccount}>Yes</button>
                                            <button className="btn btn-primary m-2" onClick={() => setDeletePop(false)} >No</button>
                                        </div>
                                    </DeletePopup>
                                    </>
                                    :<></>}
                                </>
                                : <></>
                        }

                    </div>

                    {/* user content */}
                    <div className="col-12 col-md-9 flex-grow-1">
                        <h4 className="text-center col-12 my-2">Profile</h4>
                        <div>
                            <form className="d-flex flex-column col-6 mx-auto text-start">
                                <label>
                                    <input className="me-1" type="radio" name="menu" value="saved recipes" onChange={(e) => setMenu(e.target.value)} checked={menu == "saved recipes"} />
                                    Saved Recipes
                                </label>
                                <label>
                                    <input className="me-1" type="radio" name="menu" value="my recipes" onChange={(e) => setMenu(e.target.value)} checked={menu == "my recipes"} />
                                    Created Recipes
                                </label>
                                <label>
                                    <input className="me-1" type="radio" name="menu" value="my comments" onChange={(e) => setMenu(e.target.value)} checked={menu == "my comments"} />
                                    Comments
                                </label>
                            </form>
                        </div>
                        <div className="col-xxl-9">
                            {menu === "saved recipes" ?
                                <div>
                                    <h3 className="text-center">Saved Recipes</h3>
                                    <div>
                                        {savedRecipes?.map((s) => (<ProfileSavedRecipeCard key={s.id} savedRecipe={s} getSavedRecipes={getSavedRecipes} />))}
                                    </div>
                                    

                                </div>
                                :
                                menu === "my recipes" ?
                                    <div>
                                        <h3 className="text-center">Created Recipes</h3>
                                        <div>
                                            {myRecipes?.map((r) => (<ProfileRecipeCard key={r.id} recipe={r} getMyRecipes={getCreatedRecipes} />))}
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <h3 className="text-center">My Comments</h3>
                                        {myComments?.map((c) => (<ProfileCommentCard key={c.id} comment={c} getMyComments={getComments} />))}
                                    </div>
                            }
                        </div>
                    </div>
                </div>

            </div>
            : <></>
    )
}