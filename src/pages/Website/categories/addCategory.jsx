import {useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { cat } from "../../../Api/api";
import { Axios } from "../../../Api/Axios/axios";
import Loading from "../../../components/Loading";

export default function AddCategory(){
    const [loading , setLoading] = useState(false)
    
    const [title , setTitle] = useState("")
    const [image , setImage] = useState("")

    
    async function add(e) {
        e.preventDefault()
        setLoading(true)
        const formdata = new FormData()
        formdata.append("title" , title)
        formdata.append("image" , image)

        try {
            const res = await Axios.post(`${cat}/add` , formdata);
            setLoading(false)
            console.log(res)
            window.location.pathname = "/dashBoard/categories"
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    return (
        <>
            {loading && <Loading/>}
            <div className="contact" style={{marginLeft: "30px"}}>
                <form onSubmit={add}>
                    <h1 
                        className="ms-4" 
                        style={{ color:  "rgba(179, 255, 47, 0.737)" }}>
                        Add Category
                    </h1>

                    <div style={{ border: `5px solid #15f915c9}` , boxShadow: "inset 0 0 4px 3px #1b8dad", borderRadius: "15px"}}>
                        <FontAwesomeIcon icon={faUserCircle}/>
                        <input 
                            className="title" 
                            type="text" 
                            placeholder="Title..." 
                            name="title" 
                            autoComplete="name" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div style={{ border: `5px solid #15f915c9}` , boxShadow: "inset 0 0 4px 3px #1b8dad", borderRadius: "15px"}}>
                        <FontAwesomeIcon icon={faUserCircle}/>
                        <input 
                            type="file" 
                            placeholder="Image..." 
                            name="imgae" 
                            onChange={(e) => setImage(e.target.files.item(0))}
                        />
                    </div>

                    <div style={{ margin: "0px", border: "0px", display: "flex", justifyContent: "start", boxShadow: "0 0 0 0" }}>
                        <motion.button
                            disabled={title.length > 1 ? false : true}
                            type="submit"
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
                            Add
                        </motion.button>
                    </div>
                </form>
            </div>
        </>
    );
}