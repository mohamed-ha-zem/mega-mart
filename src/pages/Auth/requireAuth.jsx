import { Navigate, Outlet, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import { useEffect, useState } from "react"
import { USER } from "../../Api/api"
import Loading from "../../components/Loading"
import { Axios } from "../../Api/Axios/axios"
import Page403 from "../DashBoard/403"

export default function RequireAuth({allowedRole}){
    const cookie = new Cookies()
    const token = cookie.get("e-commerse")
    const [user , setUser] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        Axios.get(`/${USER}`)
        .then((data) => setUser(data.data))
        .catch(() => navigate("/login"))
    } , [])

    return token ?
        (user ? 
            allowedRole.includes(user.role) ? 
            <Outlet/> 
            : <Page403 role={user.role}/>
        : <Loading/>) 
    :<Navigate to={"/login"}/>
}