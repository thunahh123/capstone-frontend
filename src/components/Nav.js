import { NavLink } from "react-router-dom";

export const Nav = function (params) {
    return (
        <nav className="col-10 navbar navbar-expand-lg">
            <div class="container-fluid">
                <a class="navbar-brand row" href="#">
                    <img></img>
                    <h1 className="text-secondary">Emily's Recipe App</h1>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <NavLink className="nav-link text-secondary fw-semibold fs-5" to="/">Home</NavLink>
                        <NavLink className="nav-link text-secondary fw-semibold fs-5" to="/search">Search</NavLink>
                        {params.username ? <NavLink className="nav-link text-secondary fw-semibold fs-5" to="/addRecipe">Add Recipe</NavLink> : <></>}
                        <NavLink className="nav-link text-secondary fw-semibold fs-5" to="/about">About</NavLink>
                    </div>
                </div>
            </div>
        </nav>

    )
}

