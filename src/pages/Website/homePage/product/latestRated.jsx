import { useEffect, useState } from "react";
import { Axios } from "../../../../Api/Axios/axios";
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { LatestRatedProducts } from "../../../../Api/api";
import { NavLink } from "react-router-dom";
import { motion } from 'framer-motion';

export default function LatestRated() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        Axios.get(`${LatestRatedProducts}`)
            .then((response) => setProducts(response.data))
            .finally(() => setLoading(false));
    }, []);

    // أنيميشن للبطاقات
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: index * 0.2 },
        }),
    };

    // أنيميشن لرسالة Sale
    const saleVariants = {
        initial: { scale: 1 },
        animate: { scale: [1, 1.2, 1], transition: { duration: 0.8, repeat: Infinity } },
    };

    // أنيميشن للصورة
    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    };

    // أنيميشن للنصوص
    const textVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 bg-gradient-to-br from-blue-100 via-slate-100 to-purple-100">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center text-4xl font-extrabold text-blue-800 mb-10"
            >
                Latest Rated Products ✨
            </motion.h1>

            <div className="flex flex-wrap justify-center gap-6">
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="w-64 p-4">
                            <Skeleton height={300} width="100%" className="rounded-xl" />
                            <Skeleton height={20} width="60%" className="mt-2" />
                            <Skeleton height={40} width="80%" className="mt-2" />
                        </div>
                    ))
                ) : (
                    products.map((item, index) => {
                        const roundStars = Math.round(item.rating);
                        const stars = Math.min(roundStars, 5);
                        const solidStars = Array.from({ length: stars }).map((_, i) => (
                            <FontAwesomeIcon key={i} icon={faStarSolid} className="text-yellow-400" />
                        ));
                        const regularStars = Array.from({ length: 5 - stars }).map((_, i) => (
                            <FontAwesomeIcon key={i} icon={faStarRegular} className="text-yellow-400" />
                        ));

                        return (
                            <NavLink
                                to={`/product/${item.id}`}
                                className="no-underline"
                                key={item.id}
                            >
                                <motion.div
                                    custom={index}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative bg-white rounded-xl shadow-lg p-4 w-64 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-100 transition-all duration-300"
                                >
                                    {/* علامة Sale */}
                                    <motion.span
                                        variants={saleVariants}
                                        initial="initial"
                                        animate="animate"
                                        className="absolute top-2 left-2 bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full"
                                    >
                                        Sale
                                    </motion.span>

                                    {/* الصورة */}
                                    <motion.div
                                        variants={imageVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex justify-center"
                                    >
                                        <img
                                            src={item.images[0]?.image || 'https://via.placeholder.com/150'}
                                            alt={item.title}
                                            className="w-32 h-32 object-contain rounded-lg"
                                            loading="lazy"
                                        />
                                    </motion.div>

                                    {/* العنوان */}
                                    <motion.h3
                                        variants={textVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="text-lg font-bold text-gray-800 mt-4 truncate"
                                    >
                                        {item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}
                                    </motion.h3>

                                    {/* الوصف */}
                                    <motion.p
                                        variants={textVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="text-sm text-gray-600 mt-2 line-clamp-2"
                                    >
                                        {item.description}
                                    </motion.p>

                                    {/* التقييم */}
                                    <motion.div
                                        variants={textVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex mt-2"
                                    >
                                        {solidStars}
                                        {regularStars}
                                    </motion.div>

                                    {/* السعر */}
                                    <motion.div
                                        variants={textVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex items-center justify-between mt-3"
                                    >
                                        <div>
                                            <span className="text-xl font-extrabold text-blue-700">
                                                ${(item.price - item.discount).toFixed(2)}
                                            </span>
                                            <del className="text-sm text-gray-500 ml-2">${(+item.price).toFixed(2)}</del>
                                        </div>
                                        <FontAwesomeIcon
                                            icon={faCartShopping}
                                            className="text-gray-700 text-xl hover:text-blue-600 transition-colors"
                                        />
                                    </motion.div>
                                </motion.div>
                            </NavLink>
                        );
                    })
                )}
            </div>
        </div>
    );
}