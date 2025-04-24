import axios from "axios";
import { useEffect } from "react";
import { baseURL, GOOGLE_CALL_BACK } from "../../Api/api";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export default function GoogleCallback() {
    const location = useLocation();
    const cookie = new Cookies()
    const navigate = useNavigate()

    useEffect(() => {
        async function GoogleCall() {
            try {
                const res = await axios.get(`${baseURL}/${GOOGLE_CALL_BACK}${location.search}`);
                const token = res.data.access_token
                console.log("Response:", res.data);
                cookie.set("e-commerse", token , {path: "/"}); // Set token with path
                navigate("/dashBoard")
            } catch (err) {
                console.log("Error:", err.response ? err.response.data : err.message);
            }
        }
            GoogleCall();
    }, []);

    return (
        <div>
            <h1>Loading...</h1>
        </div>
    );
}