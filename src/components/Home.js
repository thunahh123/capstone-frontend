import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { HomeResultCard } from "./HomeResultCard";

export const Home = function () {
  const [ingredient, setIngredient] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [recipes, setRecipes] = useState([]); //for top match recipes

  // this function fetch all ingredients matching with the input
  function getIngredients() {
    if (ingredient.length <= 0) {
      setSearchResults([]);
      return;
    }
    try {
      fetch(`http://localhost:8000/api/ingredient/search/${ingredient}`)
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

  // use useEffect to run the function whenever ingredient changes
  useEffect(() => { getIngredients() }, [ingredient]);
  // use useEffect to run filter function everytime the ingredients list changes
  useEffect(()=>{filterRecipes()}, [ingredientList]);

  //this function will filter Recipes in Home page
  function filterRecipes(){
    if(ingredientList.length<=0){
      return;
    }
    try {//"ingredient_ids": ingredientList.map((ingredient)=>(ingredient.id))
      let query = new URLSearchParams({
        "min_cook_time" : 0,
        "max_cook_time" : 9999,
        "min_ingredients" : 0,
        "max_ingredients" : 9999
      });
      ingredientList.forEach(i => {
        query.append("ingredient_ids[]",i.id);
      });
      //return;
      fetch(`http://localhost:8000/api/recipe/search?${query.toString()}`)
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
    <div className="d-flex flex-column">
      <div className="container-fluid d-flex">
        {/* Search Ingredients */}
        <div className="col-6 p-3 h-100">
          <div className="border border-black col-10 mx-auto p-3">
            <form className="my-2 container-fluid">
              <label className="d-flex flex-column col-10 col-xxl-8 m-auto fw-semibold position-relative">
                <span className="my-1">Add ingredient to your recipe search:</span>
                <input className="rounded-2 my-3" value={ingredient} autoComplete="off" type="text" placeholder="search" onChange={(e) => setIngredient(e.target.value)} />
                {ingredient.length>0 ? <div className="border border-black bg-white rounded-3 position-absolute top-80 col-12">
                  {searchResults.map((searchResult) =>
                    <div key={searchResult.id}><span>{searchResult.name}</span><span onClick={() => { addIngredient(searchResult.name, searchResult.id) }}> +</span></div>
                  )}
                </div>:<></>}
              </label>
            </form>
            <NavLink to="/search" className="text-light">Advanced Search</NavLink>
            {/* search results */}
            
          </div >
        </div>
        {/* ingredients list */}
        <div className=" row flex-grow-1 d-flex-column p-2">
          <div className="border border-black bg-white rounded-4 row mx-auto col-9 col-xxl-7 my-2 d-flex flex-column">
            {ingredientList.map((ing) =>
              <div key={ing.id}><span>{ing.name}&nbsp;</span><span onClick={() => { removeIngredient(ing.id) }}>x</span></div>
            )}
          </div>
        </div>
      </div>
      {/* Featured Recipes */}
      <div className="container marketing">
        {/* top recipes */}
        <div className="row">          
              {recipes.map((r)=>(<HomeResultCard key={r.id} recipe={r}/>))}     
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-7">
            <h2 className="featurette-heading fw-normal lh-1">
              First featurette heading.{" "}
              <span className="text-body-secondary">It’ll blow your mind.</span>
            </h2>
            <p className="lead">
              Some great placeholder content for the first featurette here.
              Imagine some exciting prose here.
            </p>
          </div>
          <div className="col-md-5">
            <svg
              className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
              width="500"
              height="500"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: 500x500"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
            >
              <title>Placeholder</title>
              <rect
                width="100%"
                height="100%"
                fill="var(--bs-secondary-bg)"
              ></rect>
              <text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">
                500x500
              </text>
            </svg>
          </div>
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-7 order-md-2">
            <h2 className="featurette-heading fw-normal lh-1">
              Oh yeah, it's that good.{" "}
              <span className="text-body-secondary">See for yourself.</span>
            </h2>
            <p className="lead">
              Another featurette? Of course. More placeholder content here to
              give you an idea of how this layout would work with some actual
              real-world content in place.
            </p>
          </div>
          <div className="col-md-5 order-md-1">
            <svg
              className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
              width="500"
              height="500"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: 500x500"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
            >
              <title>Placeholder</title>
              <rect
                width="100%"
                height="100%"
                fill="var(--bs-secondary-bg)"
              ></rect>
              <text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">
                500x500
              </text>
            </svg>
          </div>
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-7">
            <h2 className="featurette-heading fw-normal lh-1">
              And lastly, this one.{" "}
              <span className="text-body-secondary">Checkmate.</span>
            </h2>
            <p className="lead">
              And yes, this is the last block of representative placeholder
              content. Again, not really intended to be actually read, simply
              here to give you a better view of what this would look like with
              some actual content. Your content.
            </p>
          </div>
          <div className="col-md-5">
            <svg
              className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
              width="500"
              height="500"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: 500x500"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
            >
              <title>Placeholder</title>
              <rect
                width="100%"
                height="100%"
                fill="var(--bs-secondary-bg)"
              ></rect>
              <text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">
                500x500
              </text>
            </svg>
          </div>
        </div>

        <hr className="featurette-divider" />

      </div>
    </div>
  );
};
