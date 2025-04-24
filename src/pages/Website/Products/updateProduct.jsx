import {useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { CAT, PRO, pro } from "../../../Api/api";
import { Axios } from "../../../Api/Axios/axios";
import Loading from "../../../components/Loading";
import { useParams } from "react-router-dom";

export default function AddProduct(){
    const [loading , setLoading] = useState(false)
    const [images , setImages] = useState([])
    const [imagesReturn , setImagesReturn] = useState([])
    const [idsReturn , setIdsReturn] = useState([])
    const [categories , setCategories] = useState([])
    const {id} = useParams()
    const openImages = useRef(null)

    // store the data in form 
        const [form , setFrom] = useState({
        category: "Chose Category" , 
        title: "",
        description: "",
        price: "",
        discount: "",
        About: ""
    })

    // احنا ضفنا منتج وهمي اصلا في الباك اند بس منشرنهوش في صفحة المنتجات وبالتالي كل اللي هنعمله ان احنا هنعدل المنتج ده مش هنضيف منتج جديد 
    async function addButEdit(e) { 
        e.preventDefault()
        setLoading(true)
        try {
            for (let i = 0; i < idsReturn.length; i++) {
                await Axios.delete(`product-img/${idsReturn[i]}}`)
            }
            const resedit = await Axios.post(`${pro}/edit/${id}` , form);
            setLoading(false)
            console.log(resedit)
            window.location.pathname = "/dashBoard/products"
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }
    
    useEffect(() => {
        Axios.get(`/${PRO}`, {
        }).then((data) => {
            setFrom(data.data.filter((d) => d.id == id)[0])
            setImagesReturn(data.data.filter((d) => d.id == id)[0].images)
        })
        .catch((err) => console.log(err))
    } , [])

    useEffect(() => {
        Axios.get(`/${CAT}`, {
        }).then((data) => {
            setCategories(data.data)
        })
        .catch((err) => console.log(err))
    } , [])

    function handleChange(e){
        setFrom({...form , [e.target.name]: e.target.value})
    }

    function handleOpenImages(){
        openImages.current.click()
    }

    const progress = useRef([])
    const j = useRef(-1)
    const ids = useRef([])

    async function handleImagesChange(e){
        const imagesfiles = [...e.target.files]
        setImages((prev) => [...prev , ...imagesfiles])

        const data = new FormData()
        for (let i = 0; i < imagesfiles.length; i++) {
            j.current++
            const currentIndex = j.current
            data.append("image" , imagesfiles[i])
            data.append("product_id" , id)

            try{
                const res = await Axios.post("/product-img/add" , data , {
                    onUploadProgress: (ProgressEvent) => {
                        const {loaded , total} = ProgressEvent
                        const percent = Math.floor((loaded * 100) / total);

                        if(percent % 10 === 0){
                            if(progress.current[currentIndex]){
                                progress.current[currentIndex].style.width = `${percent}%`
                                progress.current[currentIndex].setAttribute("percent" , `${percent}%`)
                            }
                        }
                    }
                }) 
                ids.current[j.current] = res.data.id
            }catch(err){
                console.log(err)
            }
        }
    }

    async function handleDelete(image , id){
        const findId = ids.current[id]

        try{
            const res = await Axios.delete(`product-img/${findId}`)
            setImages((prev) => prev.filter((img) => img !== image))
            ids.current = ids.current.filter((i) => i !== findId)
            --j.current
            console.log(res)
        }catch(err){
            console.log(err)
        }
    }

    async function handleDeleteimagesReturn(id){
        setImagesReturn((prev) => prev.filter((img) => img.id !== id))
        setIdsReturn((prev) => {
            return [...prev , id]
        })
        // try{
        //     const res = await Axios.delete(`product-img/${id}}`)
        //     console.log(res)
        // }catch(err){
        //     console.log(err)
        // }
    }


    const ShowImages = images.map((image, key) => {
        return (
            <>
                <div key={key} style={{display: "flex", justifyContent: "space-between" , alignItems: "center" , border: "1px solid black" , width: "90%" , height: "140px", borderRadius: "10px" , padding: "30px"}}>
                    <div style={{display: "flex", justifyContent: "start" , gap: "50px" , alignItems: "center" , width: "90%" , height: "140px", borderRadius: "10px" , padding: "30px"}}>
                        <img src={URL.createObjectURL(image)} style={{ width: "100px" }}></img>
                        <div style={{ border: 0, display: "flex", flexDirection: "column" }}>
                            <p>{image.name}</p>
                            <p>
                            {(image.size / 1024 < 100
                                ? (image.size / 1024).toFixed(2) + " KB"
                                : (image.size / (1024 * 1024)).toFixed(2) + " MB")}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => handleDelete(image , key)} type="button" className="btn btn-danger">Delete</button>
                </div>
                <div className="progress">
                    <div className="innerProgress" ref={(e) => {progress.current[key] = e}}/>
                </div>
            </>
        );
    });
    const ShowImagesReturn = imagesReturn.map((image, key) => {
        return (
            <>
                <div key={key} style={{display: "flex", justifyContent: "space-between" , alignItems: "center" , border: "1px solid black" , width: "90%" , height: "140px", borderRadius: "10px" , padding: "30px"}}>
                    <div style={{display: "flex", justifyContent: "start" , gap: "50px" , alignItems: "center" , width: "90%" , height: "140px", borderRadius: "10px" , padding: "30px"}}>
                        <img src={image.image} style={{ width: "100px" }}></img>
                    </div>
                    <button onClick={() => handleDeleteimagesReturn(image.id)} type="button" className="btn btn-danger">Delete</button>
                </div>
            </>
        );
    });

    const Showcategories = categories.map((category , key) => <option key={key} value={category.id}>{category.title}</option>)


    return (
        <>
            {loading && <Loading/>}
            <div className="products" style={{marginLeft: "30px"}}>
                <form onSubmit={addButEdit}>
                    <h1 
                        className="ms-4" 
                        style={{ color:  "rgba(179, 255, 47, 0.737)" }}>
                        Update Product
                    </h1>

                    <div className="input">
                        <FontAwesomeIcon icon={faUserCircle}/>
                        <select
                            className="category border-0 outline-0"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        >
                            <option disabled>Chose Category</option>
                            {Showcategories}
                        </select>
                    </div>

                    <div className="input">
                        <FontAwesomeIcon icon={faUserCircle}/>
                        <input 
                            className="title" 
                            type="text" 
                            placeholder="Title..." 
                            name="title" 
                            autoComplete="name" 
                            value={form.title} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input">
                        <FontAwesomeIcon icon={faUserCircle}/>
                        <input 
                            className="description" 
                            type="text" 
                            placeholder="Description..." 
                            name="description" 
                            autoComplete="description" 
                            value={form.description} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input">
                        <FontAwesomeIcon icon={faUserCircle}/>
                        <input 
                            className="price" 
                            type="text" 
                            placeholder="Price..." 
                            name="price" 
                            autoComplete="price" 
                            value={form.price} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input">
                        <FontAwesomeIcon icon={faUserCircle}/>
                        <input 
                            className="discount" 
                            type="text" 
                            placeholder="Discount..." 
                            name="discount" 
                            autoComplete="discount" 
                            value={form.discount} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input">
                        <FontAwesomeIcon icon={faUserCircle}/>
                        <input 
                            className="about" 
                            type="text" 
                            placeholder="About..." 
                            name="About" 
                            autoComplete="about" 
                            value={form.About} 
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <input 
                            ref={openImages}
                            hidden
                            multiple
                            type="file" 
                            onChange={handleImagesChange}
                        />
                    </div>
                    <div style={{width: "100%" , display: "flex" , justifyContent: "center"}}>
                        <div onClick={handleOpenImages} className="upload"> 
                            <FontAwesomeIcon icon={faUpload} style={{color: "#2196F3" , fontSize: "80px" , margin: "10px 0px"}}/>
                            <p style={{color: "#2196F3" , fontWeight: "bold"}}>Upload Images</p>
                        </div>
                    </div>

                    <div className="images">
                        {ShowImagesReturn}
                        {ShowImages}
                    </div>

                    <div style={{ margin: "0px", border: "0px", display: "flex", justifyContent: "start", boxShadow: "0 0 0 0" }}>
                        <motion.button
                            // disabled={title.length > 1 ? false : true}
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
                            update
                        </motion.button>
                    </div>
                </form>
            </div>
        </>
    );
}