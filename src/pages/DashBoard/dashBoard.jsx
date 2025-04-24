import { Outlet } from "react-router-dom";
import SideBar from "./sideBar";
import TopBar from "./topBar";
import { useContext } from "react";
import MarginContext, { MarginLeft } from "../Website/Context/marginContextj";

export default function DashBoard(){
    const marginLeft = useContext(MarginLeft)
    return(
        <div className="dashBoard">
            <TopBar/>
            <div className="position-relative" style={{width: `calc(100vw - ${marginLeft.marginLeft})`, height: "100vh" , top: "77px"}}>
                <SideBar/>
                <Outlet/>
            </div>
        </div>
    )
}