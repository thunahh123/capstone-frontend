import { NavLink } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export const Nav = function () {
    return (
        <nav className="col-10 navbar navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand row" href="/">
                    <img></img>
                    <h1>Emily's Recipes</h1>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="nav-link fw-semibold fs-5" to="/">Home</NavLink>
                        <NavLink className="nav-link fw-semibold fs-5" to="/search">Search</NavLink>
                        {secureLocalStorage.getItem('username') ?
                            <NavLink className="nav-link fw-semibold fs-5" to="/addRecipe">Add Recipe</NavLink>
                            : <></>}
                        {secureLocalStorage.getItem('is_admin') ?
                            <NavLink className="nav-link fw-semibold fs-5" to="/manage">Manage</NavLink>
                            : <></>}
                        <NavLink className="nav-link fw-semibold fs-5" to="/about">About</NavLink>



                    </div>
                </div>
            </div>
        </nav>

    )
}

