import { useEffect, useState } from "react";
import secureLocalStorage from 'react-secure-storage';
import { ResultPostCard } from "./ResultPostCard";
import { redirect, useParams } from "react-router-dom";


export const UpdateRecipe = function () {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState(null);
    const [dirs, setDirs] = useState([""]);
    const [recipeName, setRecipeName] = useState("");
    const [servings, setServings] = useState(1);
    const [desc, setDesc] = useState("");
    const [time, setTime] = useState(15);
    //fetch
    const [unitsList, setUnitsList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    //
    const [newUnit, setNewUnit] = useState({});
    const [newAmount, setAmount] = useState(1);
    const [ingredient, setIngredient] = useState({ name: "" });
    const [ingredientList, setIngredientList] = useState([]);
    const [badIngInput, setBadIngInput] = useState(false);
    const [badAmountInput, setBadAmountInput] = useState(false);
    const [badUnitInput, setBadUnitInput] = useState(false);
    const [errorMessage, setErrorMess] = useState("");
    const [buttonPop, setButtonPop] = useState(false);
    //recipe id 
    const [recipeId, setRecipeId] = useState(-1);

    const listLength=8;

    //this function call fetchUnits function when the page loads
    useEffect(() => { fetchUnits() }, []);
    useEffect(getRecipe, []);

    // use useEffect to run the function whenever ingredient changes
    useEffect(() => { fetchIngredients() }, [ingredient]);

    useEffect(() => { console.log("Ingredient: "); console.log(ingredient); console.log("List: " + ingredientList) }, [ingredient]);

    function getRecipe(){
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/find/${params.id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result){
                            console.log()
                            setRecipe(result.content);
                            setDesc(result.content.description);
                            setDirs(result.content.direction);
                            setRecipeName(result.content.title);
                            setServings(result.content.serving);
                            setTime(result.content.cooking_time_in_mins);
                            let newList = result.content.recipe_ingredients.map((i)=>(
                                {
                                    "ingredient": structuredClone(i.ingredient),
                                    "amount": i.quantity,
                                    "unit": structuredClone(i.unit)
                                }
                            ));
                            setIngredientList(newList);
                            setLoading(false);
                        }
                        
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // this function to update everytime thr direction is set
    function setDirection(newDir, index) {
        let copyDirs = [...dirs];
        copyDirs[index] = newDir;
        setDirs(copyDirs);
    }

    //this function add 1 more empty dir to the list
    function addMoreDir() {
        let copyDirs = [...dirs];
        copyDirs.push("");
        setDirs(copyDirs);
    }

    //this function delete unwanted direction
    function deleteDir(index) {
        let copyDirs = [...dirs];
        copyDirs.splice(index, 1);
        setDirs(copyDirs);
    }

    // 
    function handleIngredientChange(e) {
        console.log("handleIngredientChange")
        //e.preventDefault();
        let newIngredient = {
            name: e.target.value
        };
        setIngredient(newIngredient);
        setBadIngInput(false);
    }

    //this function fetches all the units from db
    function fetchUnits() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/units`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setUnitsList(result);
                        console.log(result)
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    //this function fetches all ingredients matching the input
    function fetchIngredients() {
        console.log("fetchIngredients")
        if (ingredient.name.length <= 0) {
            setSearchResults([]);
            return;
        }
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ingredient/search/${ingredient.name.toLowerCase()}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setSearchResults(result);
                        console.log(result);
                    })
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function deleteIngredientFromList(index, e) {
        console.log("deleteIngredientFromList")
        e.preventDefault();
        console.log(index)
        console.log(e)
        let copy = structuredClone(ingredientList);
        copy.splice(index, 1);
        setIngredientList(copy);
    }
    //add recipe's ingredients
    function addIngredientToList() {
        let bad = false;
        if (!Object.hasOwn(ingredient, "id")) {
            setBadIngInput(true);
            bad = true;
        }
        if (!parseFloat(newAmount) || newAmount <= 0) {
            setBadAmountInput(true);
            bad = true;
        }
        if (!Object.hasOwn(newUnit, "abbr")) {
            setBadUnitInput(true);
            bad = true;
        }
        if (bad) {
            return;
        }
        let newIngredient = {
            "ingredient": structuredClone(ingredient),
            "amount": newAmount,
            "unit": structuredClone(newUnit)
        }
        let copy = structuredClone(ingredientList);
        copy.push(newIngredient);
        copy = structuredClone(copy);
        setIngredientList(copy);
        setIngredient({
            "name": ""
        })
        setAmount(1);
        setNewUnit({ name: "" });
        setBadIngInput(false);
        setBadAmountInput(false);
        setBadUnitInput(false);
    }
    //this post function will add new recipe to db
    function updateRecipe() {
        setErrorMess("");
        if (!recipeName || !servings || !time || !desc || dirs.length == 0 || ingredientList.length == 0) {
            setErrorMess("Please complete the form");
            return;
        }
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "session_key": secureLocalStorage.getItem("session_key"),
                    "recipe_id": params.id,
                    "new_cooking_time": time,
                    "new_title": recipeName,
                    "new_serving": servings,
                    "new_desc": desc,
                    "new_direction": dirs,
                    "new_ingredients":
                        ingredientList.map((i) =>
                            ({
                                "id": i.ingredient.id,
                                "quantity": i.amount,
                                "unit_id": i.unit.id
                            })
                        )
                })
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "success") {
                        setButtonPop(true);
                        setTimeout(()=>{redirect(`/recipe/${params.id}`)})
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

    function clearForm() {
        setDesc("");
        setDirs([""]);
        setRecipeName("");
        setServings(1);
        setAmount(1);
        setBadAmountInput(false);
        setBadIngInput(false);
        setBadUnitInput(false);
        setErrorMess("");
        setTime(15);
        setSearchResults([]);
        setNewUnit({});
        setIngredient({ name: "" });
        setIngredientList([]);
    }

    //post function
    function updateSubmit(e) {
        e.preventDefault();
        updateRecipe();

    }

    return (<>{ loading?<div>Loading...</div> : <>
    {recipe.author_id===secureLocalStorage.getItem('user_id') || secureLocalStorage.getItem("is_admin") ?
    <div className="w-100">
        <h2 className="text-center">Add New Recipe</h2>
        <form className="border border-black container-md py-4 text-center bg-dark" id="add-recipe-form">
            <p className="text-danger fw-bold">{errorMessage}</p>
            <div className="d-flex flex-row col-11 col-md-9 mx-auto px-3 flex-wrap row-gap-4">
                <label className="col-12 col-lg-10 col-xxl-6 d-flex gap-3">
                    <h5>Name:</h5>
                    <input className="form-control" type="text" value={recipeName} onChange={(e) => { setRecipeName(e.target.value) }} required />
                </label>
                <div className="d-flex col-12 col-lg-10 col-xxl-6 flex-wrap">
                    <label className="col-12 col-xxl-4 d-flex gap-3 justify-content-around">
                        <h5 className="col-8 col-lg-6">
                            Servings:
                        </h5>
                        <input className="form-control mx-2" type="number" min="1" value={servings} onChange={(e) => { setServings(e.target.value) }} required />
                    </label>
                    <label className="col-12 col-lg-10 col-xxl-8 d-flex gap-3 ps-xxl-3 justify-content-end">
                        <h5 className="col-8 col-lg-9 text-start text-lg-end">
                            Prep&nbsp;time&nbsp;(mins):
                        </h5>
                        <input className="form-control" type="number" min="1" value={time} onChange={(e) => { setTime(e.target.value) }} required />
                    </label>
                </div>
                
            </div>

            <label className="p-3 mx-auto col-11 col-md-9">
                <h5 className="text-start mx-auto">
                    Description:
                </h5>
                <div className="mx-auto ">
                    <textarea className="form-control" cols="100" rows="5" type="text" value={desc} onChange={(e) => { setDesc(e.target.value) }} required> </textarea>
                </div>
            </label>

            <div className="p-3 col-11 col-md-9 mx-auto">
                <h5 className="text-start mx-auto">
                    Directions:
                </h5>
                {/* map the directions */}
                {dirs.map((d, index) => (
                    <div className="d-flex mx-auto my-1" key={index}>
                        <input className="form-control d-inline-block" type="text" value={d} onChange={(e) => { setDirection(e.target.value, index) }} required />
                        <button className="btn btn-danger" onClick={(e) => { e.preventDefault(); deleteDir(index); }}>&#10006;</button>
                    </div>
                ))}
                <button className="btn btn-danger mx-auto d-inline fw-bold rounded-circle" onClick={(e) => { e.preventDefault(); addMoreDir(); }}>+</button>
            </div>
            <div className="col-11 col-md-9 p-3 mx-auto">
                <h5 className="text-start mx-auto">Ingredients:</h5>
                <table className="table table-striped table-bordered mx-auto bg-primary">
                    <thead>
                        <tr>
                            <th scope="col">Ingredient</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Unit</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody >
                        {/* map the list of ingredients added */}

                        <tr>
                            <td className="position-relative">
                                <div className="position-absolute z-3 bg-white border border-black rounded-2">
                                    <input className={badIngInput ? "form-control is-invalid" : "form-control"} value={ingredient.name} autoComplete="off" type="text" placeholder="search" onChange={handleIngredientChange} />
                                    {ingredient.name.length > 0 && !Object.hasOwn(ingredient, "id") && searchResults.length > 0 ? <div className="">

                                    {/* map the ingredients search results */}
                                    {searchResults.slice(0, listLength).map((searchResult, index) =>
                                        <>
                                            <option className="py-2 show-pointer" key={searchResult.id} onClick={() => { setIngredient(searchResult); setBadIngInput(false); }}>
                                                {searchResult.name}
                                            </option>
                                            {index===searchResults.slice(0, listLength).length-1 ? <></> : <hr className="my-0 py-0"/>}
                                        </>
                                    )}
                                </div> : <></>}
                                </div>
                                
                            </td>
                            <td>
                                {/* amout input */}
                                <input className={badAmountInput ? "form-control is-invalid" : "form-control"} type="number" value={newAmount} onChange={(e) => { setAmount(Math.max(e.target.value, 0)); setBadAmountInput(false); }} />
                            </td>
                            <td>
                                {/* map the units */}
                                <select value={newUnit.name} className={badUnitInput ? "form-select is-invalid" : "form-select"} onChange={(e) => { setNewUnit(unitsList[e.target.options[e.target.selectedIndex].index - 1]); setBadUnitInput(false) }}>
                                    <option value="" key="">--</option>
                                    {unitsList.map((u, index) => (
                                        <option data-index={index} key={u.id}>{u.unit}</option>
                                    ))}

                                </select>
                            </td>
                            {/* add ingredient button */}
                            <td><button type="button" className="btn btn-success" onClick={(e) => { e.preventDefault(); addIngredientToList(); }}>&#10004;</button></td>
                        </tr>
                        {ingredientList.map((ing, index) => (
                            <tr key={index}>
                                <td>{ing.ingredient.name}</td>
                                <td>{ing.amount}</td>
                                <td>{ing.unit.abbr}</td>
                                <td><button onClick={(e) => { deleteIngredientFromList(index, e); }} className="btn btn-danger">&#10006;</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-primary" onClick={updateSubmit}>UPDATE</button>
        </form>
        <ResultPostCard trigger={buttonPop} setTrigger={setButtonPop}>
            <p>Your recipe successfully posted </p>
            <div>
                <a className="btn btn-primary m-2" onClick={() => setButtonPop(false)} href={"/recipe/" + recipe.id}>View Recipe</a>
                <a className="btn btn-primary m-2" onClick={() => setButtonPop(false)} href="/">Go to home</a>
            </div>
        </ResultPostCard>
    </div>:<></>}
    </>
    }
    </>
  )
}