//import { NavLink } from "react-router-dom";
import { UserInfoBox } from "./UserInfoBox";

export const Header = function(params){
    return (
        <header>
            <img></img>            
            <h1>Emily's Recipe App</h1>
            <UserInfoBox username={params.username} setUsername={params.setUsername}/>
        </header>
    )
}