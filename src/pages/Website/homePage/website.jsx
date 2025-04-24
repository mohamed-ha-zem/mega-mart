import { Outlet } from "react-router-dom";
import Navbar from "./navBar";

export default function Website(){
    return (
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}