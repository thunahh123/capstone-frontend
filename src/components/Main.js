import { Routes, Route } from "react-router-dom";
import { LogIn } from "./LogIn";
import { Home } from "./Home";
import { Register } from "./Register";
import { Search } from "./Search";
import { AddRecipe } from "./AddRecipe";
import { About } from "./About";

export const Main = function(params){
    return(
        <main className="flex-shrink-0">
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<LogIn username={params.username} setUsername={params.setUsername}/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/search" element={<Search/>}/>
            <Route path="/addRecipe" element={<AddRecipe/>}/>
            <Route path="/about" element={<About/>}/>
        </Routes>
        </main>
    )
}