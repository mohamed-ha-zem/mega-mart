import { useEffect, useState } from "react"
import { Axios } from "../../../Api/Axios/axios"
import { PRO } from "../../../Api/api"
import { useNavigate, useParams } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import ProductHome from "./product/productHome"
import { motion } from 'framer-motion';

export default function SingleCategory (){
    const [products , setProducts] = useState([])
    const [total , setTotal] = useState(0)
    const [loading , setLoading] = useState(false)
    const {id} = useParams()
    const nav = useNavigate();

    useEffect(() => {
        // setLoading(true)
        Axios.get(`/${PRO}`, {
        }).then((data) => {
            setProducts(data.data.filter((product) => product.category == id))
            setTotal(data.data.total)
            console.log(data.data.filter((product) => product.category == id))
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))
    } , [])
    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
    };
    // Animation variants for buttons
    const buttonVariants = {
        hover: { scale: 1.1 },
        tap: { scale: 0.95 },
    };
    

    return (
        <div className="bg-gradient-to-br from-orange-500 to-pink-300 py-12">
            <motion.button
                onClick={() => nav(-1)}
                className="mb-6 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md ml-5"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
            >
                back
            </motion.button>
            <div className="max-w-7xl mx-auto px-4">
                <motion.h1
                className="text-3xl font-bold text-blue-800 mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                >
                Products Page
                </motion.h1>
                <motion.div
                className="flex flex-wrap justify-center items-center gap-5"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                >
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                    <motion.div
                        key={index}
                        className="flex justify-center"
                        variants={cardVariants}
                    >
                        <Skeleton height={300} width={200} className="rounded-xl" />
                    </motion.div>
                    ))
                ) : (
                    products.slice(0, 5).map((item, index) => (
                    <motion.div key={index} variants={cardVariants}>
                        <ProductHome
                        title={item.title}
                        description={item.description}
                        image={item.images[0] && item.images[0].image}
                        price={item.price}
                        discount={item.discount}
                        rating={item.rating}
                        id={item.id}
                        />
                    </motion.div>
                    ))
                )}
                </motion.div>
            </div>
        </div>
    );
}