import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { HomeResultCard } from "./HomeResultCard";
import { HomeFeatureCard } from "./HomeFeatureCard";

export const Home = function () {
  const [ingredient, setIngredient] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [recipes, setRecipes] = useState([]); //for top match recipes
  const [featuredRecipes, setFeaturedRecipes] = useState([]);

  useEffect(getFeaturedRecipes, []);
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
          })
    } catch (error) {
      console.error("Error:", error);
    }

  }

  //this function adds search result to the ingredient list
  function addIngredient(name, id) {
    if (ingredientList.filter((ing) => (ing.id === id)).length > 0) {
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

  // use useEffect to run the function whenever ingredient changes
  useEffect(() => { getIngredients() }, [ingredient]);
  // use useEffect to run filter function everytime the ingredients list changes
  useEffect(() => { filterRecipes() }, [ingredientList]);

  //this function will filter Recipes in Home page
  function filterRecipes() {
    if (ingredientList.length <= 0 ) {
      setRecipes([]);
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
          });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  //fetch featured recipes
  function getFeaturedRecipes() {
    try {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/getFeatured`)
        .then(res => res.json())
        .then(
          (result) => {
            setFeaturedRecipes(result);
          })
    } catch (error) {
      console.error("Error:", error);
    }

  }
  return (
    <div className="d-flex flex-column h-100 flex-grow-1 border-top border-secondary">
      <div className="col-8 border border-black mx-auto rounded-4 mt-5 m-4 p-4 d-flex
       flex-column flex-grow-1">
        <div className="row flex-grow-1">
          <div className="col-4">
            <div className="border border-black mx-auto py-3 position-relative bg-dark h-100">
            <div className="container-fluid mb-5 col-11">
              <label>Add ingredient to your recipe search:</label>
              <div className="border bg-white mt-2 rounded-3 position-absolute w-75 z-3">
                <input className="rounded-2 border-white col-12" value={ingredient} autoComplete="off" type="text" placeholder="search..." onChange={(e) => setIngredient(e.target.value)} />
                {searchResults.filter((item) => !ingredientList.map(ing => ing.id).includes(item.id)).length > 0 ? <div className="py-2">
                  {searchResults.filter((item) => !ingredientList.map(ing => ing.id).includes(item.id)).slice(0, 8).map((searchResult, index) =>
                    <>
                      <option className="p-2 p-xxl-3 text-wrap show-pointer " value={searchResult.name} key={searchResult.id} onClick={() => { addIngredient(searchResult.name, searchResult.id) }}>{searchResult.name}</option>
                      {index == searchResults.filter((item) => !ingredientList.map(ing => ing.id).includes(item.id)).slice(0, 8).length - 1 ? <></> : <hr className="mx-2 my-0 py-0" />}
                    </>

                  )}
                </div> : <></>
                }
              </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="mx-auto border border-black bg-dark align-content-start rounded-4 h-100 col-9 col-xxl-7 d-flex flex-row px-2 py-1 gap-3 flex-wrap flex-grow-1">
              {ingredientList.map((ing) =>
                <span className="d-inline-flex border bg-secondary border-black px-1 rounded" key={ing.id}><span>{ing.name}&nbsp;</span><span className="text-danger" onClick={() => { removeIngredient(ing.id) }}>x</span></span>
              )}
            </div>
          </div>
        </div>
        {recipes.length>0 ? <hr/> : <></> }
        <div className="row">
          <div className="container marketing">
            {/* top recipes */}
            <div className="d-flex justify-content-xxl-around flex-wrap align-items-stretch column-gap-3 column-gap-lg-0  row-gap-3">
              {recipes.map((r) => (<HomeResultCard key={r.id} recipe={r} />))}
            </div>

            <div>
              <hr className="featurette-divider z-0" />
              {/* Featured Recipes */}
              {featuredRecipes.map((r, index) => (
                <HomeFeatureCard recipe={r} index={index} key={r.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
