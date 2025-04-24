import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseURL, REGISTER } from "../../Api/api";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Loading from "../../components/Loading";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export function FormuseFormik() {
    const [ErrorEmail, setErrorEmail] = useState("");
    const [loading , setLoading] = useState(false)
    const cookie = new Cookies()
    const navigate = useNavigate()

    const registerSchema = Yup.object({
        name: Yup.string().min(3).required(),
        email: Yup.string().email().required(),
        password: Yup.string().min(8).required()
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validationSchema: registerSchema,
        onSubmit: register
    });

    async function register(values) {
        setLoading(true)
        try {
            const res = await axios.post(`${baseURL}/${REGISTER}`, values);
            setLoading(false)
            console.log("sucess")
            const token = res.data.token
            cookie.set("e-commerse" , token)
            navigate("/login")
        } catch (err) {
            setLoading(false)
            console.log("false")
            console.log(err)
            if (err.status === 422) {
                setErrorEmail(err.response.data.message);
            }
        }
    }

        const focus = useRef(null)
    
        useEffect(() => {
            focus.current.focus()
        } , [])

    return (
        <>
            {loading && <Loading/>}
            <div className="contact" style={{width: "100vw"}}>
                <form onSubmit={formik.handleSubmit}>
                    <h1 
                        className="ms-4" 
                        style={{ color: formik.errors.name && formik.touched.name ||
                                        formik.errors.email && formik.touched.email ||
                                        formik.errors.password && formik.touched.password ? 
                                        "rgba(255, 47, 47, 0.737)" : "rgba(179, 255, 47, 0.737)" }}>
                        Register Now
                    </h1>

                    <div style={{ border: `5px solid ${formik.errors.name && formik.touched.name ? "#ff2626d1" : "#15f915c9"}` }}>
                        <i style={{ color: "blueviolet" }} className="fa-regular fa-circle-user"></i>
                        <input 
                            className="name" 
                            type="text" 
                            placeholder="Name..." 
                            name="name" 
                            autoComplete="name" 
                            value={formik.values.name} 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            ref={focus}
                        />
                    </div>

                    <div style={{ border: `5px solid ${formik.errors.email && formik.touched.email || ErrorEmail !== "" ? "#ff2626d1" : "#15f915c9"}` }}>
                        <i style={{ color: "blueviolet" }} className="fa-regular fa-envelope"></i>
                        <input 
                            className="email" 
                            type="email" 
                            placeholder="Email..."  
                            name="email" 
                            autoComplete="email" 
                            value={formik.values.email} 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                        />
                    </div>

                    <div style={{ border: `5px solid ${formik.errors.password && formik.touched.password ? "#ff2626d1" : "#15f915c9"}` }}>
                        <i style={{ color: "blueviolet" }} className="fa-solid fa-key"></i>
                        <input 
                            className="password" 
                            type="password" 
                            placeholder="Password..."  
                            name="password" 
                            autoComplete="password" 
                            value={formik.values.password} 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                        />
                    </div>

                    <div style={{ margin: "0px", border: "0px", display: "flex", justifyContent: "start", boxShadow: "0 0 0 0" }}>
                        <motion.button
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
                                background: formik.errors.name && formik.touched.name || 
                                            formik.errors.email && formik.touched.email || 
                                            formik.errors.password && formik.touched.password ? 
                                            "linear-gradient(to right, rgb(216 163 29), rgb(232 35 27))" : 
                                            "linear-gradient(to right, rgb(33 148 37), #FFEB3B)"
                            }}
                            className="btn btn-lg text-white fw-bold shadow-lg">
                            Register
                        </motion.button>
                    </div>
                    <motion.p className="oauthButton" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }}>
                        <a href="http://127.0.0.1:8000/login-google">
                            <svg className="icon" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                ></path>
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                ></path>
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                ></path>
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                ></path>
                                <path d="M1 1h22v22H1z" fill="none"></path>
                            </svg>
                            Continue with Google
                        </a>
                    </motion.p>

                    {formik.errors.name && formik.touched.name && 
                        <p className="alert alert-danger mt-3" style={{ width: "fit-content" }} role="alert">
                            {formik.errors.name}
                        </p>
                    }
                    {formik.errors.email && formik.touched.email && 
                        <p className="alert alert-danger mt-3" style={{ width: "fit-content" }} role="alert">
                            {formik.errors.email}
                        </p>
                    }
                    {ErrorEmail && 
                        <p className="alert alert-danger mt-3" style={{ width: "fit-content" }} role="alert">
                            {ErrorEmail}
                        </p>
                    }
                    {formik.errors.password && formik.touched.password && 
                        <p className="alert alert-danger mt-3" style={{ width: "fit-content" }} role="alert">
                            {formik.errors.password}
                        </p>
                    }
                </form>
            </div>
        </>
    );
}

export default function Register() {
    return (
        <div>
            <FormuseFormik />
        </div>
    );
}