import { motion } from "framer-motion";
import CategoriesLinks from "./categoriesLinks";
import LandingPage from "./landingPage";
import LatestProduct from "./product/latestProduct";
import LatestRated from "./product/latestRated";
import TopRated from "./product/topRated";

// Animation variants
const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.3 } },
};

export default function HomePage() {
    return (
        <motion.div
        className="bg-gradient-to-br from-orange-500 to-pink-300 min-h-screen"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        >
        <motion.div variants={sectionVariants}>
            <LandingPage />
        </motion.div>
        <motion.div variants={sectionVariants}>
            <CategoriesLinks />
        </motion.div>
        {/* <LatestProduct /> */}
        {/* <div className="flex flex-wrap justify-center">
            <TopRated />
            <LatestRated />
        </div> */}
        </motion.div>
    );
}