import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignOutAlt, faHome } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "../Website/Context/contextMenu";
import { Axios } from "../../Api/Axios/axios";
import { LOGOUT, USER } from "../../Api/api";
import Cookies from "universal-cookie";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
    const menu = useContext(Menu);
    const [name, setName] = useState({ name: "", role: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const cookie = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get(`/${USER}`)
            .then((response) => setName(response.data))
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    }, []);

    async function handleLogout() {
        try {
            await Axios.get(`/${LOGOUT}`);
            cookie.remove("e-commerse", { path: "/" });
            navigate("/login");
        } catch (err) {
            console.log("Logout error:", err);
        }
    }

    // أنيميشن للشريط العلوي
    const barVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    // أنيميشن للعناصر الداخلية
    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (index) => ({
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, delay: index * 0.1 },
        }),
    };

    // أنيميشن للقائمة المنسدلة
    const dropdownVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
        exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
    };

    return (
        <motion.div
            className="bg-gradient-to-r from-gray-900 to-blue-900 px-4 py-3 shadow-lg flex justify-between items-center relative z-20 w-screen"
            variants={barVariants}
            initial="hidden"
            animate="visible"
        >
            {/* الجزء الأيسر: العنوان وأيقونة القائمة */}
            <motion.div
                custom={0}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4"
            >
                <h1 className="text-2xl font-extrabold text-amber-400 tracking-wide">
                    E-Commerce
                </h1>
                <motion.div
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FontAwesomeIcon
                        onClick={() => menu.setIsOpen(!menu.isOpen)}
                        icon={faBars}
                        className="text-amber-400 text-xl cursor-pointer hover:text-amber-300 transition-colors"
                    />
                </motion.div>
            </motion.div>

            {/* الجزء الأيمن: القائمة المنسدلة في الموبايل */}
            <motion.div
                custom={1}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4"
            >
                {/* قائمة منسدلة موحدة للموبايل */}
                <div className="relative md:hidden">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 bg-gray-800 text-gray-200 px-3 py-2 rounded-lg font-semibold hover:bg-gray-700 transition duration-300"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                    </motion.button>
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.ul
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
                            >
                                <motion.li
                                    whileHover={{ backgroundColor: "#1f2937" }}
                                    className="px-4 py-2 text-gray-200 hover:text-amber-400 cursor-pointer transition-colors"
                                    onClick={() => navigate("/")}
                                >
                                    Home
                                </motion.li>
                                <motion.li
                                    whileHover={{ backgroundColor: "#1f2937" }}
                                    className="px-4 py-2 text-gray-200 hover:text-amber-400 cursor-pointer transition-colors"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </motion.li>
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                {/* الجزء الأيمن للديسكتوب: الأزرار وقائمة المستخدم */}
                <div className="hidden md:flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/")}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition duration-300"
                    >
                        Home
                    </motion.button>
                    {isLoading ? (
                        <div className="w-24 h-10 bg-gray-700 rounded-lg animate-pulse" />
                    ) : (
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-gray-800 text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition duration-300"
                            >
                                <span>
                                    {name.name || "User"}{" "}
                                    {name.role === "1995"
                                        ? "(Admin)"
                                        : name.role === "1999"
                                        ? "(User)"
                                        : name.role === "2001"
                                        ? "(Product Manager)"
                                        : ""}
                                </span>
                                <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                            </motion.button>
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.ul
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
                                    >
                                        <motion.li
                                            whileHover={{ backgroundColor: "#1f2937" }}
                                            className="px-4 py-2 text-gray-200 hover:text-amber-400 cursor-pointer transition-colors"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </motion.li>
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}