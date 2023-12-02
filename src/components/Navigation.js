import { NavLink } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export const Navigation = function () {
    return (
        <Navbar expand="lg" className="col-10">
            <Container>
                <Navbar.Brand href="/"><h1>Emily's Recipes</h1></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink className="nav-link fw-semibold fs-5" to="/">Home</NavLink>
                        <NavLink className="nav-link fw-semibold fs-5" to="/search">Search</NavLink>
                        {secureLocalStorage.getItem('username') ?
                            <NavLink className="nav-link fw-semibold fs-5" to="/addRecipe">Add Recipe</NavLink>
                            : <></>}
                        {secureLocalStorage.getItem('is_admin') ?
                            <NavLink className="nav-link fw-semibold fs-5" to="/manage">Manage</NavLink>
                            : <></>}
                        <NavLink className="nav-link fw-semibold fs-5" to="/about">About</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

