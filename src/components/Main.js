import { Routes, Route } from "react-router-dom";
import { LogIn } from "./LogIn";
import { Home } from "./Home";
import { Register } from "./Register";
import { Search } from "./Search";
import { AddRecipe } from "./AddRecipe";
import { About } from "./About";
import { RecipePage } from "./RecipePage";
import { UserPage } from "./UserPage";
import { UpdateEmail } from "./UpdateEmail";
import { UpdatePassword } from "./UpdatePassword";
import { Manage } from "./Manage";

export const Main = function(params){
    return(
        <main className="flex-shrink-0 w-100 flex-grow-1">
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<LogIn username={params.username} setUsername={params.setUsername}/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/search" element={<Search/>}/>
            <Route path="/addRecipe" element={<AddRecipe/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/recipe/:id" element={<RecipePage/>}/>
            <Route path="/user/:name" element={<UserPage/>}/>
            <Route path="/user/update/email" element={<UpdateEmail/>}/>
            <Route path="/user/update/password" element={<UpdatePassword/>}/>
            <Route path="/manage" element={<Manage/>}/>
        </Routes>
        </main>
    )
}