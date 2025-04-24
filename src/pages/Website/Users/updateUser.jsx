import { useEffect, useState } from "react";
import { USER } from "../../../Api/api";
import { motion } from "framer-motion";
import Loading from "../../../components/Loading";
import { Axios } from "../../../Api/Axios/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateUser (){
    const [loading , setLoading] = useState(false)
    const [disable , setDisable] = useState(true)
    
    const [name , setName] = useState("")
    const [email , setEmail] = useState("")
    const [role , setRole] = useState("")

    const nav = useNavigate()

    const {id} = useParams()

    useEffect(() => {
        setLoading(true)
        Axios.get(`${USER}/${id}`).then((data) => {
            setName(data.data.name)
            setEmail(data.data.email)
            setLoading(false)
        }).then(() => setDisable(false))
        .catch(() => nav("/dashBoard/users/page/404"))
    } , [])

    async function update(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await Axios.post(`${USER}/edit/${id}` , {
                name : name,
                email : email,
                role : role
            });
            setLoading(false)
            console.log(res)
            window.location.pathname = "/dashBoard/users"
        } catch(err){
            setLoading(false)
            console.log(err)
        }
    }

    return (
        <>
            {loading && <Loading/>}
            <div className="contact" style={{marginLeft: "30px"}}>
                <form onSubmit={update}>
                    <h1 
                        className="ms-4" 
                        style={{ color:  "rgba(179, 255, 47, 0.737)" }}>
                        Update User
                    </h1>

                    <div style={{ border: `5px solid #15f915c9}` , boxShadow: "inset 0 0 4px 3px #1b8dad", borderRadius: "15px"}}>
                        <FontAwesomeIcon icon={faUserCircle}/>
                        <input 
                            className="name" 
                            type="text" 
                            placeholder="Name..." 
                            name="name" 
                            autoComplete="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div style={{ border: `5px solid #15f915c9}` , boxShadow: "inset 0 0 4px 3px #1b8dad", borderRadius: "15px"}}>
                        <FontAwesomeIcon icon={faEnvelope}/>
                        <input 
                            className="email" 
                            type="email" 
                            placeholder="Email..."  
                            name="email" 
                            autoComplete="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div style={{fontSize: "25px" , fontWeight: "bold"}}>
                        <select style={{border: 0 , outline: 0}} value={role} onChange={(e) => setRole(e.target.value)}>
                            <option disabled>select Role</option>
                            <option value={"1995"}>admin</option>
                            <option value={"1999"}>user</option>
                            <option value={"2001"}>Product Manager</option>
                            <option value={"1996"}>writer</option>
                        </select>
                    </div>

                    <div style={{ margin: "0px", border: "0px", display: "flex", justifyContent: "start", boxShadow: "0 0 0 0" }}>
                        <motion.button
                            type="submit"
                            disabled= {disable}
                            whileHover={{ scale: 1.2, boxShadow: "0px 4px 15px rgba(255, 0, 150, 0.5)" }}
                            whileTap={{ scale: 0.8 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.1 }}
                            style={{
                                opacity: 1,
                                transform: "none",
                                boxShadow: "rgba(0, 0, 0, 0.176) 0px 16px 48px 0px",
                                width: "220px",
                                borderRadius: "50px 0px",
                                color: "white",
                                fontWeight: "bold",
                                padding: "10px 20px",
                                border: "0px",
                                cursor: "pointer",
                                outline: "0px",
                                background: "linear-gradient(to right, rgb(33 148 37), #FFEB3B)"
                            }}
                            className="btn btn-lg text-white fw-bold shadow-lg">
                            Update
                        </motion.button>
                    </div>
                </form>
            </div>
        </>
    );
}