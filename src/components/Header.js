//import { NavLink } from "react-router-dom";
import { UserInfoBox } from "./UserInfoBox";
import { Nav } from "./Nav";
export const Header = function(params){
    return (
        <header className="container border-bottom border-black m-0 p-3 min-vw-100 bg-dark">
            <div className="row">
                <Nav username={params.username}/>
                <UserInfoBox  username={params.username} setUsername={params.setUsername}/>
            </div>
        </header>
    )
}