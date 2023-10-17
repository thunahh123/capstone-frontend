import { NavLink } from "react-router-dom";

export const Nav = function(){
    return(
        <nav>
            <NavLink className="navLink" to="/">Home</NavLink>
            <NavLink className="navLink" to="/search">Search</NavLink>
            <NavLink className="navLink" to="/addRecipe">Add Recipe</NavLink>
            <NavLink className="navLink" to="/about">About</NavLink>
        </nav>
    )
}