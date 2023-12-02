import { useEffect, useState } from "react"
import { ResultPostCard } from "./ResultPostCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faCheck, faTrash, faUserTie } from "@fortawesome/free-solid-svg-icons";
import secureLocalStorage from "react-secure-storage";
import { DeletePopup } from "./DeletePopup";

export const Manage = function () {
    const [newIng, setNewIng] = useState("");
    const [buttonPop, setButtonPop] = useState(false);
    const [message, setMessage] = useState("");
    const [recipeSearchString, setRecipeSearchString] = useState("");
    const [userSearchString, setUserSearchString] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [allRecipes, setAllRecipes] = useState([]);
    const [deletePop, setDeletePop] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(getUsers, []);
    // useEffect(filterUsers, [userSearchString]);
    useEffect(getRecipes, [recipeSearchString]);

    function filterUsers(){
        let newUsers = structuredClone(allUsers);
        newUsers = newUsers.filter(u=>u.name?.toLowerCase().includes(userSearchString.toLowerCase())||u.email?.toLowerCase().includes(userSearchString.toLowerCase()));
        setUsers(newUsers);
    }

    useEffect(filterUsers, [userSearchString, allUsers]);

    function filterRecipes(){
        console.log('filtering recipes') 
        console.log(allRecipes)
        let newRecipes = structuredClone(allRecipes);
        newRecipes = newRecipes.filter(r=>r.title?.toLowerCase().includes(recipeSearchString.toLowerCase()));
        console.log(newRecipes)
        setRecipes(newRecipes);
    }

    useEffect(filterRecipes, [recipeSearchString, allRecipes]);

    function filterRecipesByUser(id){
        let newRecipes = structuredClone(allRecipes);
        newRecipes = newRecipes.filter(r => r.author_id===id)
        setRecipes(newRecipes);
    }

    //function add new ing
    function addNewIngredient() {
        if (newIng <= 0) {
            setMessage("Cannot add an empty");
            setButtonPop(true);
            return;
        }
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ingredient/new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'name': newIng
                })
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.status === "success") {
                            setNewIng("");
                        }
                        setMessage(result.message);
                        setButtonPop(true);
                    }

                );
        }
        catch (error) {
            console.error("Error:", error);
        }
    }
    //get all users
    function getUsers() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/all`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setAllUsers(result);
                        console.log(result);
                    })
        } catch (error) {
            console.error("Error:", error);
        }

    }

    //get all recipes
    function getRecipes() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipes/all`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setDeletePop(false);
                        setAllRecipes(result);
                        console.log(result);
                    })
        } catch (error) {
            console.error("Error:", error);
        }

    }

    //delete user
    function confirmDeleteRecipe(id) {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/deleteRecipe?session_key=${secureLocalStorage.getItem('session_key')}&recipe_id=${id}`,
                {method: 'DELETE'})
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if(result.status==="success"){
                                setDeletePop(false);
                                getRecipes();
                            }
                           
                        });
            } catch (error) {
                console.error("Error:", error);
            }
    }

    //delete user
    function confirmDeleteUser() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/delete?session_key=${secureLocalStorage.getItem('session_key')}&user_id=${userToDelete}`,
                {
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result);
                        if (result.status === "success") {

                            setMessage(result.message);
                            setButtonPop(true);
                            getUsers();
                        } else {
                            setMessage(result.message);
                        }

                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }

  
    function setFeaturedRecipe(id) {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/setFeatured`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "session_key": secureLocalStorage.getItem('session_key'),
                    "recipe_id": id
                })
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.status === "success") {
                            getRecipes();   
                        }
                        console.log(result.message);
                    })
        } catch (error) {
            console.error("Error:", error);
        }

    }
    

    function becomeAdmin(id) {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/newAdmin`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "session_key": secureLocalStorage.getItem('session_key'),
                    "user_id": id
                })
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result);
                        if (result.status === "success") {
                            setMessage(result.message);

                            getUsers();
                        }
                        else {
                            setMessage(result.message);

                        }
                        // setButtonPop(true);
                    }

                );
        }
        catch (error) {
            console.error("Error:", error);
        }
    }



    return (
        <div className="d-flex flex-column text-center justify-content-between row-gap-5 col-9 mx-auto">
            {/* Add new ingredient */}
            <div className="py-5">
                <h3>Add new ingredient</h3>
                <form >
                    <div>
                        <input className="mx-1" type="text" placeholder="Ingredient name..." value={newIng} onChange={(e) => setNewIng(e.target.value)} />
                        <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); addNewIngredient() }}>Add</button>
                    </div>
                </form>
                <ResultPostCard trigger={buttonPop} setTrigger={setButtonPop}>
                    <p>{message}</p>
                    <div>
                        <button className="btn btn-primary" onClick={() => setButtonPop(false)}>Close</button>
                    </div>
                </ResultPostCard>
            </div>
            {/* Manage user */}
            <div className="py-5">
                <h3>Manage User</h3>
                <input type="text" value={userSearchString} onChange={(e) => { setUserSearchString(e.target.value) }} placeholder="type to search a user..." />
                <div className="">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Last Login</th>
                                <th scope="col">Account Created</th>
                                <th scope="col">Is Admin?</th>
                                <th scope="col">Recipes</th>
                                <th scope="col">Comments</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <th scope="row">{u.id}</th>
                                    <td><a href={`/user/${u.name}`} target="_blank">{u.name}</a></td>
                                    <td>{u.email}</td>
                                    <td>{u.last_login ? new Date(u.last_login).toLocaleDateString() : "---"}</td>
                                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td>{u.is_admin ? <><FontAwesomeIcon icon={faCheck} title="admin check" className="text-primary" /></> : ""}</td>
                                    <td>{u.recipes?.length}</td>
                                    <td>{u.comments?.length}</td>
                                    <td className="d-flex flex-nowrap gap-4 justify-content-center">
                                        {!u.is_admin ? <span onClick={() => { setUserToDelete(u.id); setDeletePop(true); }}><FontAwesomeIcon icon={faTrash} title="delete user" /></span> : <span className="text-center">---</span>}
                                        <DeletePopup trigger={deletePop} setTrigger={setDeletePop}>
                                            <p>Are you sure want to delete user with id {userToDelete}?</p>
                                            <div>
                                                <button className="btn btn-primary m-2" onClick={() => { confirmDeleteUser() }}>Yes</button>
                                                <button className="btn btn-primary m-2" onClick={() => setDeletePop(false)} >No</button>
                                            </div>
                                        </DeletePopup>
                                        {!u.is_admin ? <span onClick={() => becomeAdmin(u.id)}><FontAwesomeIcon icon={faUserTie} title="add to admin" /></span>
                                            : <></>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Manege recipes */}
            <div className="py-5">
                <h3>Manage recipes</h3>
                <input type="text" value={recipeSearchString} onChange={(e) => { setRecipeSearchString(e.target.value) }} placeholder="type to search a recipe..." />
                <div className="">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Title</th>
                                <th scope="col">Author</th>
                                <th scope="col">Created at</th>
                                <th scope="col">Is featured?</th>
                                <th scope="col">Total saves</th>
                                <th scope="col">Views</th>
                                
                                <th scope="col">Total comments?</th>
                                <th scope="col">Actions</th>


                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map((r) => (
                                <tr key={r.id}>
                                    <th scope="row">{r.id}</th>
                                    <td><a href={`/recipe/${r.id}`} target="_blank">{r.title}</a></td>
                                    <td><button className="btn btn-link" title="Show only this user's recipes" onClick={()=>{filterRecipesByUser(r.author_id)}}>{r.user.name}</button></td>
                                    <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : "---"}</td>
                                    <td>{r.featured ? <><FontAwesomeIcon icon={faCheck} title="featured check" className="text-primary" /></> : ""}</td>
                                    <td>{r.saved_recipes?.length}</td>
                                    <td>{r.views}</td>
                                    
                                    <td>{r.comments?.length}</td>
                                    <td className="d-flex flex-nowrap gap-4 justify-content-center">
                                        <span onClick={()=>{ confirmDeleteRecipe(r.id)}}><FontAwesomeIcon icon={faTrash} title="delete recipe" /></span>
                                        <span onClick={()=>{setFeaturedRecipe(r.id)}}>
                                            {!r.featured ?
                                            <FontAwesomeIcon icon={faArrowUp} title="be featured" />
                                            :<FontAwesomeIcon icon={faArrowDown} title="be featured" />}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}