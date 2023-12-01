import { useEffect, useState } from "react"
import { ResultPostCard } from "./ResultPostCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faUserTie } from "@fortawesome/free-solid-svg-icons";
import secureLocalStorage from "react-secure-storage";
import { DeletePopup } from "./DeletePopup";

export const Manage = function () {
    const [newIng, setNewIng] = useState("");
    const [buttonPop, setButtonPop] = useState(false);
    const [message, setMessage] = useState("");
    const [recipeSearchString, setRecipeSearchString] = useState("");
    const [userSearchString, setUserSearchString] = useState("");
    const [users, setUsers] = useState([]);
    const [deletePop, setDeletePop] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    useEffect(getUsers, []);
    // useEffect(filterUsers, [userSearchString]);
    useEffect(getRecipes, [recipeSearchString]);

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
                        setUsers(result);
                        console.log(result);
                    })
        } catch (error) {
            console.error("Error:", error);
        }

    }

    function getRecipes() {
        if (recipeSearchString.length <= 0) {
            return;
        }
    }

    // function filterUsers(userSearchString) {

    // }

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
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.last_login ? new Date(u.last_login).toLocaleDateString() : "---"}</td>
                                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td>{u.is_admin ? <><FontAwesomeIcon icon={faCheck} title="admin check" className="text-primary" /></> : ""}</td>
                                    <td>user.recipe_count</td>
                                    <td>user.comment_count</td>
                                    <td className="d-flex flex-nowrap gap-4 justify-content-center">{u.id}
                                        {!u.is_admin ? <span onClick={() =>{ setUserToDelete(u.id); setDeletePop(true);} }><FontAwesomeIcon icon={faTrash} title="delete user" /></span> : <span className="text-center">---</span>}
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
            <div className="py-5">
                <h3>Manage recipes</h3>
                <input type="text" value={recipeSearchString} onChange={(e) => { setRecipeSearchString(e.target.value) }} />
            </div>
        </div>
    )
}