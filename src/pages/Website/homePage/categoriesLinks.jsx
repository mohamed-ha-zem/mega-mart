import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { Axios } from "../../../Api/Axios/axios";
import { CAT } from "../../../Api/api";
import { motion } from "framer-motion";

import all from "../../../../public/all.jpg";

export default function CategoriesLinks() {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Animation variants for cards
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        hover: { scale: 1.05, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", transition: { duration: 0.3 } },
    };

    // Animation variants for buttons/links
    const linkVariants = {
        hover: { scale: 1.1 },
        tap: { scale: 0.95 },
    };

    // Get all the Categories to put them in the Home Page
    useEffect(() => {
        Axios.get(`/${CAT}`)
        .then((data) => {
            setCategories(data.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-gradient-to-br from-orange-500 to-pink-300 py-8">
        <div className="max-w-7xl mx-auto px-4">
            <motion.h2
            className="text-2xl font-bold text-blue-800 mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            >
            تصفح الفئات
            </motion.h2>
            <div className="hidden md:flex flex-wrap gap-6 justify-center">
            {loading ? (
                <div className="flex flex-wrap justify-center gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="m-2">
                    <Skeleton circle height={96} width={96} />
                    <Skeleton height={20} width={70} className="mt-2 mx-auto" />
                    </div>
                ))}
                </div>
            ) : (
                <>
                {categories.slice(-11).map((category, index) => (
                    <motion.div
                    key={index}
                    className="flex flex-col items-center mx-2 cursor-pointer"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    >
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-lg border border-orange-200 hover:border-orange-300 transition-colors">
                            <img
                            src={category.image}
                            alt={category.title}
                            className="w-20 h-20 object-contain"
                            />
                        </div>
                        <motion.div
                            variants={linkVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Link
                            to={`/category/${category.id}`}
                            className="text-gray-700 hover:text-blue-600 mt-2 text-sm font-semibold bg-orange-100 px-3 py-1 rounded-lg text-center no-underline transition-colors no-underline"
                            >
                            {category.title.slice(0, 10)}
                            </Link>
                        </motion.div>
                    </motion.div>
                ))}
                <motion.div
                    className="flex flex-col items-center mx-2 cursor-pointer"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                >
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-lg border border-orange-200 hover:border-orange-300 transition-colors">
                    <img
                        src={all}
                        alt="Show All"
                        className="w-20 h-20 object-contain rounded-full"
                    />
                    </div>
                    <motion.div
                    variants={linkVariants}
                    whileHover="hover"
                    whileTap="tap"
                    >
                    <Link
                        to="/homeCategories"
                        className="text-gray-700 hover:text-blue-600 mt-2 text-sm font-semibold bg-orange-100 px-3 py-1 rounded-lg text-center no-underline transition-colors no-underline"
                    >
                        Show all
                    </Link>
                    </motion.div>
                </motion.div>
                </>
            )}
            </div>
        </div>
        </div>
    );
}