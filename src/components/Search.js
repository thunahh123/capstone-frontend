import { useEffect, useState } from "react";
import { SearchResultCard } from "./SearchResultCard";


export const Search = function () {
  const [ingredient, setIngredient] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(120);
  const [minIng, setMinIng] = useState(0);
  const [maxIng, setMaxIng] = useState(20);
  const [recipes, setRecipes] = useState([]); //for top match recipes


  // use useEffect to run the function whenever ingredient changes
  useEffect(() => { getIngredients() }, [ingredient]);
  // use useEffect to run filter function everytime the ingredients list changes
  useEffect(() => { filterRecipes() }, [ingredientList]);

  // this function fetch all ingredients matching with the input
  function getIngredients() {
    if (ingredient.length <= 0) {
      setSearchResults([]);
      return;
    }
    try {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ingredient/search/${ingredient}`)
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

  //this function adds search result to the ingredient list
  function addIngredient(name, id) {
    if (ingredientList.filter((ing) => (ing.id === id)).length > 0) {
      console.log("ingredient already added");
      return;
    }
    let ingredientClone = JSON.parse(JSON.stringify(ingredientList));
    ingredientClone.push({ "name": name, "id": id });
    setIngredientList(ingredientClone);
    setIngredient("");
  }

  //this function will delete ingredient from the ingredient list
  function removeIngredient(id) {
    let newList = ingredientList.filter((ing) => (ing.id !== id));
    setIngredientList(newList);
  }

  //this function will filter Recipes in Home page
  function filterRecipes() {
    if (ingredientList.length <= 0) {
      return;
    }
    try {//"ingredient_ids": ingredientList.map((ingredient)=>(ingredient.id))
      let query = new URLSearchParams({
        "min_cook_time": 0,
        "max_cook_time": 9999,
        "min_ingredients": 0,
        "max_ingredients": 9999
      });
      ingredientList.forEach(i => {
        query.append("ingredient_ids[]", i.id);
      });
      //return;
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/search?${query.toString()}`)
        .then(res => res.json())
        .then(
          (result) => {
            setRecipes(result);
            console.log(result);
          });
    } catch (error) {
      console.error("Error:", error);
    }

  }
  return (
    <div className="d-flex flex-column h-100 flex-grow-1 border-top border-secondary">

      <div className="d-flex flex-wrap flex-grow-1">

        {/* filters section */}
        <div className="col-12 col-md-4 col-lg-3 bg-dark d-flex flex-grow-1 flex-column text-secondary">
          <h4 className="text-center col-12 py-3">Filters</h4>
          <div className="flex-grow-1 d-flex flex-column justify-content-around flex-shrink-0 px-2 text-center">
            <div>
              <h5>Number of ingredients:</h5>
              <div className="d-flex">
                <label className=" col-5 d-flex flex-column">
                  <input type="number" value={minIng} min="1" onChange={(e) => { setMinIng(e.target.value); if (parseInt(maxIng) < parseInt(minIng) + 1) { setMaxIng(parseInt(minIng) + 1) } }} />
                  min.
                </label>
                &nbsp;-&nbsp;
                <label className=" col-5 d-flex flex-column">
                  <input type="number" min={minIng} value={maxIng} onChange={(e) => { setMaxIng(e.target.value) }} />
                  max.
                </label>
              </div>
            </div>
            <div>
              <h5>Preparation time:</h5>
              <div className="d-flex">
                <label className=" col-5 d-flex flex-column">
                  <input type="number" value={minTime} min="1" step="5" onChange={(e) => { setMinTime(e.target.value); if (parseInt(maxTime) < parseInt(minTime) + 5) { setMaxIng(parseInt(minTime) + 5) } }} />
                  min.
                </label>
                &nbsp;-&nbsp;
                <label className=" col-5 d-flex flex-column">
                  <input type="number" min={minTime} value={maxTime} step="5" onChange={(e) => { setMaxTime(e.target.value) }} />
                  max.
                </label>
              </div>
            </div>
            <div>
              <h5>Sort by:</h5>
              <div className="d-flex flex-column col-6 mx-auto text-start">
                <label>
                  <input type="radio" name="sortBy" value="popularity" />
                  Popularity
                </label>
                <label>
                  <input type="radio" name="sortBy" value="date" />
                  Date
                </label>
                <label>
                  <input type="radio" name="sortBy" value="rating" />
                  Rating
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* search section */}
        <div className="col-12 col-md-8 col-lg-9">
          <h3 className="text-center col-12">Search Page</h3>
          <div className="d-flex">
            {/* Search Ingredients */}
            <div className="">
              <div className="border border-black col-10 mx-auto p-3">
                <form className="my-2 container-fluid">
                  <label className="d-flex flex-column col-10 col-xxl-8 m-auto fw-semibold position-relative">
                    <span className="my-1">Add ingredient to your recipe search:</span>
                    <input className="rounded-2 my-3" value={ingredient} autoComplete="off" type="text" placeholder="search" onChange={(e) => setIngredient(e.target.value)} />
                    {ingredient.length > 0 ? <div className="border border-black bg-white rounded-3 position-absolute top-80 col-12">
                      {searchResults.slice(0, 10).map((searchResult) =>
                        <div key={searchResult.id}><span>{searchResult.name}</span><span onClick={() => { addIngredient(searchResult.name, searchResult.id) }}> +</span></div>
                      )}
                    </div> : <></>}
                  </label>
                </form>

                {/* search results */}

              </div >
            </div>
            {/* ingredients list */}
            <div className="">
              <div className="border border-black bg-white rounded-4 row mx-auto col-9 col-xxl-7 my-2 d-flex flex-column">
                {ingredientList.map((ing) =>
                  <div key={ing.id}><span>{ing.name}&nbsp;</span><span onClick={() => { removeIngredient(ing.id) }}>x</span></div>
                )}
              </div>
            </div>
          </div>
          {/* top recipes */}
          <div className="row">
            {recipes.map((r) => (<SearchResultCard key={r.id} recipe={r} searched = {ingredientList.map(i=>i.id)}/>))}
          </div>
        </div>

      </div>
    </div>

  )
}