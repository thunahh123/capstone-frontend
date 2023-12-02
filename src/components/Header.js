//import { NavLink } from "react-router-dom";
import { UserInfoBox } from "./UserInfoBox";
import { Navigation } from "./Navigation";
export const Header = function(params){
    return (
        <header className="border-bottom border-black m-0 p-3 vw-100 bg-light">
            <div className="row">
                <Navigation username={params.username}/>
                <UserInfoBox  username={params.username} setUsername={params.setUsername}/>
            </div>
        </header>
    )
}