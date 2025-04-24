import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductHome(props) {
    const roundStars = Math.round(props.rating);
    const stars = Math.min(roundStars, 5);
    const solidStars = Array.from({ length: stars }).map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStarSolid} className="text-yellow-500" />
    ));
    const regularStars = Array.from({ length: 5 - stars }).map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStarRegular} className="text-yellow-500" />
    ));

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
        hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)", transition: { duration: 0.3 } },
    };

    const imageVariants = {
        hover: { scale: 1.1, transition: { duration: 0.3 } },
    };

    return (
        <motion.div
        className="bg-white rounded-xl p-4 shadow-lg border border-orange-200 hover:border-orange-300 transition-colors no-underline w-60"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        >
        <NavLink to={`/product/${props.id}`} className="no-underline">
            <h2 className="text-xl font-bold text-blue-800 italic truncate">{props.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-2">{props.description}</p>
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold rounded-full px-3 py-1 mb-3">
            تخفيض
            </span>
            <motion.img
            src={props.image || "/assets/default-product.png"}
            alt={props.title}
            className="w-32 h-32 object-contain mx-auto mb-3"
            variants={imageVariants}
            loading="lazy"
            />
            <hr className="my-4 border-gray-300" />
            <div className="flex items-center justify-between">
            <div>
                <div className="flex gap-1 mb-3">{solidStars}{regularStars}</div>
                <div className="flex items-center gap-3">
                <p className="text-lg font-semibold text-blue-700">{props.price - props.discount}$</p>
                <del className="text-sm text-gray-500">{props.price}$</del>
                </div>
            </div>
            <FontAwesomeIcon icon={faCartShopping} className="text-gray-700 text-2xl" />
            </div>
        </NavLink>
        </motion.div>
    );
}