import axios from "axios";
import { baseURL } from "../api";
import Cookies from "universal-cookie";

const cookie = new Cookies()
const token = cookie.get("e-commerse")

export const Axios = axios.create({
    baseURL: baseURL ,
    headers: {
        Authorization: `Bearer ${token}`
    }
})