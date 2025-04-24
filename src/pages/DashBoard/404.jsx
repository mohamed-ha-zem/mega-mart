import { Link } from "react-router-dom";

export default function Page404({role}){
    return (
        <div style={{textAlign: "center" , width: "96vw" , height: "65vh" }}>
            <h1>404</h1>
            <h3>Not Found</h3>
            <p>Sorry, the page you're looking for doesn't exist.</p>            
            <Link to={role === "1996" ? "users/writer" : "/"} className="btn btn-primary">
                {role === "1996" ? "Go To Writer Page" : "Go To Home Page"}
            </Link>
        </div>
    )
}