import { LOGOUT } from "../../Api/api";
import Cookies from "universal-cookie";
import { Axios } from "../../Api/Axios/axios";

export default function Logout() {
    const cookie = new Cookies();

    async function handleLogout() {
        // const token = cookie.get("e-commerse");
        // if (!token || token === "undefined") {
        //     console.log("No valid token found. Please log in again.");
        //     return;
        // }

        try {
            const res = await Axios.get(`/${LOGOUT}`);
            console.log("Success Logout:", res.data);
            // Remove the cookie after successful logout
            cookie.remove("e-commerse", { path: "/" });
            // window.location.pathname = "/login"; // Redirect to login page after logout
        } catch (err) {
            console.log("Logout error:", err);
        }
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}