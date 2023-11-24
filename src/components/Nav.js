import { NavLink } from "react-router-dom";

export const Nav = function (params) {
    return (
        <nav className="col-10 navbar navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand row" href="/">
                    <img></img>
                    <h1 className="text-secondary">Emily's Recipe App</h1>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
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

