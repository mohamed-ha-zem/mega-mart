import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Menu } from "../Website/Context/contextMenu";
import { Axios } from "../../Api/Axios/axios";
import { LOGOUT, USER } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export default function TopBar(){
    const menu = useContext(Menu)
    const [name , setName] = useState("")
    const navigate = useNavigate()
    const cookie = new Cookies()

        useEffect(() => {
            Axios.get(`/${USER}`)
            .then((data) => setName(data.data))
            .catch(() => navigate("/login"))
        } , [])

async function handleLogout() {
        try {
            const res = await Axios.get(`/${LOGOUT}`);
            console.log("Success Logout:", res.data);
            // Remove the cookie after successful logout
            cookie.remove("e-commerse", { path: "/" });
            window.location.pathname = "/login"; // Redirect to login page after logout
        } catch (err) {
            console.log("Logout error:", err);
        }
    }

    return(
        <div className="d-flex">
            <div className="topBar">
                <div className="d-flex align-items-center">
                    <h1 style={{fontSize: "25px"}}>E-Commerse</h1>
                    <FontAwesomeIcon onClick={() => menu.setIsOpen(!menu.isOpen)} icon={faBars} cursor="pointer" className="ms-5 fs-5"/>
                </div>
                <div>
                    <div  className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {name.name} {`${(name.role === "1995" ? "admin" : name.role === "1996" ? "Writer" : name.role === "2001" ? "User" : "")}`}
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" onClick={() => handleLogout()}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
