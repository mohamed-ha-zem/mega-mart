import axios from "axios";
import { baseURL } from "../api";
import Cookies from "universal-cookie";

const cookie = new Cookies()
const token = cookie.get("e-commerse")

// هنا بننشئ نسخة جديدة من Axios بمواصفات خاصة:
// - baseURL: هو الرابط الأساسي اللي هتتبعت عليه كل الطلبات.
// - headers: بنضيف رأس (header) اسمه Authorization، وبنرسل فيه التوكن (Bearer token) عشان نثبت هوية المستخدم.
export const Axios = axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: `Bearer ${token}`
    }
})
