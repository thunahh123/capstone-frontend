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
  useEffect(() => { filterRecipes() }, [ingredientList, minIng, maxIng, minTime, maxTime]);

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
        "min_cook_time": minTime,
        "max_cook_time": maxTime,
        "min_ingredients": minIng,
        "max_ingredients": maxIng
      });
      ingredientList.forEach(i => {
        query.append("ingredient_ids[]", i.id);
      });
      //return;
      console.log(query.toString())
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
        <div className="col-12 col-md-3 col-xxl-2 bg-dark d-flex flex-column">
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
        <div className="col-12 col-md-9 flex-grow-1 h-50 d-flex flex-column">
          <h3 className="text-center col-12">Search Page</h3>
          <div className="d-flex">
            {/* Search Ingredients */}
            <div className="col-3 mx-auto">
              <div className="border border-black col-10 mx-auto py-3 position-relative h-100 bg-dark">
                <div className="container-fluid mb-5 mx-auto col-11">
                  <label>Add ingredient to your recipe search:</label>
                  <div className="border bg-white mt-2 rounded-3 position-absolute w-75">
                    <input className="rounded-2 border-white col-12" value={ingredient} autoComplete="off" type="text" placeholder="search..." onChange={(e) => setIngredient(e.target.value)} />
                    {searchResults.filter((item)=>!ingredientList.map(ing=>ing.id).includes(item.id)).length > 0 ? <div className="py-2">
                      {searchResults.filter((item)=>!ingredientList.map(ing=>ing.id).includes(item.id)).slice(0, 8).map((searchResult, index) =>
                        <div key={searchResult.id}>
                          <option className="px-2 text-wrap" value={searchResult.name} key={searchResult.id} onClick={() => { addIngredient(searchResult.name, searchResult.id) }}>{searchResult.name}</option>
                          {index==searchResults.filter((item)=>!ingredientList.map(ing=>ing.id).includes(item.id)).slice(0, 8).length-1 ? <></> : <hr className="m-2"/>}
                        </div>
                       
                      )}
                    </div> : <></>}
                  </div>
                </div>


                {/* search results */}

              </div >
            </div>
            {/* ingredients list */}
            <div className="col-8">
              <div className="border border-black bg-dark align-content-start rounded-4 h-100 col-9 col-xxl-7 d-flex flex-row px-2 py-1 gap-3 flex-wrap flex-grow-1">
                {ingredientList.map((ing) =>
                  <span className="d-inline-flex border bg-secondary border-black px-1 rounded" key={ing.id}><span>{ing.name}&nbsp;</span><span className="text-danger" onClick={() => { removeIngredient(ing.id) }}>x</span></span>
                )}
              </div>
            </div>
          </div>
          {/* top recipes */}
          <div className="row col-xxl-9 flex-grow-1 h-50">
            {recipes.map((r) => (<SearchResultCard addIngredient={addIngredient} key={r.id} recipe={r} searched={ingredientList.map(i => i.id)} />))}
          </div>
        </div>

      </div>
    </div>

  )
}