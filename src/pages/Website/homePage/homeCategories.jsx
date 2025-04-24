import { useEffect, useState } from "react";
import { Axios } from "../../../Api/Axios/axios";
import { CAT } from "../../../Api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomeCategories() {
    const [categories, setCategories] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        Axios.get(`/${CAT}`)
        .then((data) => {
            setCategories(data.data);
        })
        .catch((err) => console.log(err));
    }, []);

    // Animation variants for cards
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)", transition: { duration: 0.3 } },
    };

    // Animation variants for buttons
    const buttonVariants = {
        hover: { scale: 1.1 },
        tap: { scale: 0.95 },
    };

    return (
        <div className="bg-gradient-to-br from-orange-500 to-pink-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
            <motion.button
            onClick={() => nav(-1)}
            className="mb-6 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            >
            back
            </motion.button>
            <motion.h2
            className="text-3xl font-bold text-blue-800 mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            >
            categories
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
                <motion.div
                key={index}
                className="bg-white rounded-xl p-4 shadow-lg border border-orange-200 hover:border-orange-300 transition-colors cursor-pointer"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                >
                <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <motion.div
                    className="text-center"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <a
                    href={`/category/${category.id}`}
                    className="text-lg font-semibold text-blue-700 hover:text-blue-900 bg-orange-100 px-4 py-2 rounded-lg inline-block transition-colors no-underline"
                    onClick={(e) => {
                        e.preventDefault();
                        nav(`/category/${category.id}`);
                    }}
                    >
                    {category.title}
                    </a>
                </motion.div>
                </motion.div>
            ))}
            </div>
        </div>
        </div>
    );
}