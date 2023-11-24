import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export const RecipePage = function () {
    const [recipe, setRecipe] = useState({});
    let params = useParams();
    useEffect(() => { getRecipe() }, [params.id]);

    //this function fetch the recipe
    function getRecipe() {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/find/${params.id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setRecipe(result);
                    });
        } catch (error) {
            console.error("Error:", error);
        }
    }



    return (
        <div>
            <h4 className="text-center">{recipe.title}</h4>
            <p className="text-center">{recipe.description}</p>
            <div className="d-flex justify-content-around col-6">
                <div className="d-flex flex-column">
                    <span>COOKING TIME</span>
                    <span>{recipe.cooking_time_in_mins} mins</span>
                </div>
                <div className="d-flex flex-column">
                    <span>SERVINGS</span>
                    <span>{recipe.serving}</span>
                </div>
            </div>
            <div>
                <h5 className="text-center">Ingredients:</h5>
                <div >
                    {Object.hasOwn(recipe, "recipe_ingredients") ?

                        <ul className="col-2 mx-auto" >{recipe.recipe_ingredients.map((i, index) => (
                            <li key={index}>{i.ingredient.name}</li>
                        ))}
                        </ul> : <></>
                    }
                </div>
            </div>
            <div>
                <h5 className="text-center">Instructions:</h5>
                <div >
                    {Object.hasOwn(recipe, "direction") ?

                        <ol className="col-4 mx-auto" >{recipe.direction.map((i, index) => (
                            <li key={index}>{i}</li>
                        ))}
                        </ol> : <></>
                    }
                </div>
            </div>
            <div>The comments go here</div>
            <div>Some recommeded recipes</div>
        </div>
    )
}