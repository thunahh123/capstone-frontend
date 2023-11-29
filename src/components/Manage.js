import { useEffect, useState } from "react"
import { ResultPostCard } from "./ResultPostCard";

export const Manage = function () {
    const [newIng, setNewIng] = useState("");
    const [buttonPop, setButtonPop] = useState(false);
    const [message, setMessage] = useState("");
    const [recipeSearchString, setRecipeSearchString] = useState("");
    const [userSearchString, setUserSearchString] = useState("");
    const [users, setUsers] = useState([]);
    //const [usersFiltered, setUsersFiltered] = useState([]);
    //const [recipes, setRecipes] = useState([]);

    useEffect(getUsers, []);
    useEffect(filterUsers, [userSearchString]);
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
                            setMessage(result.message);
                            setNewIng("");
                        }
                        else {
                            setMessage(result.message);
                            setNewIng("");
                        } setButtonPop(true);
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
                        let newUsers = [...result];
                        setUsers(newUsers);
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

    function filterUsers(userSearchString) {
        // if (userSearchString.length <= 0) {
        //     //setUsers([]);
        //     return;
        // } 
        // let filterUsers = users.filter((user) => (user.includes(userSearchString)));
        // setUsers(filterUsers);

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
                                {/* <th scope="col">Last Login</th> */}
                                <th scope="col">Account Created</th>
                                <th scope="col">Is Admin?</th>
                                <th scope="col">Recipes</th>
                                <th scope="col">Comments</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key="u.id">
                                    <th scope="row">{u.id}</th>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    {/* <td>{u.last_login}</td> */}
                                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td>{u.is_admin?<>&#x2713;</>:""}</td>
                                    <td>user.recipe_count</td>
                                    <td>user.comment_count</td>
                                    <td className="d-flex flex-nowrap gap-2"><span>deleteButton</span> <span>adminButton</span></td>
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