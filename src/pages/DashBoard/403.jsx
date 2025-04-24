import { Link } from "react-router-dom";

export default function Page403({role}){
    return (
        <div style={{textAlign: "center" , width: "96vw" , height: "65vh" }}>
            <h1>403</h1>
            <h3>Forbidden</h3>
            <p>Sorry, you cannot access this page.</p>
            <Link to={role === "1996" ? "users/writer" : "/"} className="btn btn-primary">
                {role === "1996" ? "Go To Writer Page" : "Go To Home Page"}
            </Link>
        </div>
    )
}