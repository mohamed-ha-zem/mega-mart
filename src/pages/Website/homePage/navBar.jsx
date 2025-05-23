import { useContext, useEffect, useState } from 'react';
import logo from "../../../../public/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faSignOutAlt, faStar, faTachometerAlt, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Cart } from '../Context/cart';
import PlusAndMinus from './product/plusAndMinus';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'universal-cookie';
import { Axios } from '../../../Api/Axios/axios';
import { LOGOUT, USER } from '../../../Api/api';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const cookie = new Cookies();
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const cart = useContext(Cart);

    useEffect(() => {
        const getProducts = JSON.parse(localStorage.getItem("product")) || [];
        setProducts(getProducts);
    }, [cart.cart]);

    function handleDelete(id) {
        const filterProducts = JSON.parse(localStorage.getItem("product")).filter(
            (product) => product.id !== id
        );
        setProducts(filterProducts);
        localStorage.setItem("product", JSON.stringify(filterProducts));
    }

    const changeCount = function (id, count) {
        const getProducts = JSON.parse(localStorage.getItem("product")) || [];
        const findProduct = getProducts.find((product) => product.id === id);
        findProduct.count = count;
        localStorage.setItem("product", JSON.stringify(getProducts));
    };

    const CartProducts = products?.map((product, index) => (
        <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative flex items-start bg-gradient-to-r from-indigo-900 to-purple-800 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 mb-4 text-white"
        >
            <div
                onClick={() => handleDelete(product.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 transition-colors duration-200 p-2 rounded-full cursor-pointer shadow-md hover:scale-110"
            >
                <FontAwesomeIcon icon={faXmark} className="text-white w-4 h-4" />
            </div>
            <div className="flex flex-col items-center gap-4 w-28">
                <div className="relative">
                    <span className="absolute -top-2 -left-2 bg-amber-400 text-black text-xs px-2 py-1 rounded-full font-bold shadow-md animate-pulse">
                        SALE
                    </span>
                    <img
                        src={product.images[0].image}
                        className="w-24 h-24 object-cover rounded-xl border-2 border-indigo-300 shadow-lg transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                    />
                </div>
                <PlusAndMinus
                    changeCount={changeCount}
                    id={product.id}
                    count={product.count || 1}
                    setCount={(count) => setCount(count)}
                />
            </div>
            <div className="flex flex-col gap-1 flex-1 ml-4">
                <h3 className="text-lg font-mono tracking-tight">
                    {product.title.length > 50
                        ? product.title.slice(0, 50) + "..."
                        : product.title}
                </h3>
                <p className="text-sm italic text-indigo-200">{product.About}</p>
                <p className="text-xs max-h-[60px] overflow-hidden text-ellipsis text-indigo-300">
                    {product.description.length > 140
                        ? product.description.slice(0, 140) + "..."
                        : product.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                    <p className="text-lg font-extrabold text-green-400">
                        {product.price - product.discount}$
                    </p>
                    <del className="text-sm text-indigo-400">{product.price}$</del>
                </div>
            </div>
        </motion.div>
    ));

    useEffect(() => {
        Axios.get(`/${USER}`)
            .then((data) => setName(data.data))
            .catch((err) => console.log(err));
    }, []);

    async function handleLogout() {
        try {
            const res = await Axios.get(`/${LOGOUT}`);
            console.log("Success Logout:", res.data);
            cookie.remove("e-commerse", { path: "/" });
            window.location.pathname = "/login";
        } catch (err) {
            console.log("Logout error:", err);
        }
    }

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isRatedDropdownOpen, setIsRatedDropdownOpen] = useState(false);

    const menuVariants = {
        hidden: { opacity: 0, y: -100 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, y: -100, transition: { duration: 0.3, ease: "easeIn" } },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (index) => ({
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, delay: index * 0.1 },
        }),
    };

    const dropdownVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
        exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
                <Modal.Header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <Modal.Title className="font-bold tracking-wider text-white">🛒 Your Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-gray-900 max-h-[60vh] overflow-y-auto">
                    {CartProducts.length > 0 ? (
                        CartProducts
                    ) : (
                        <p className="text-center text-indigo-300 text-lg py-10">No products in your cart yet!</p>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-gray-900 flex justify-between">
                    <Button variant="secondary" onClick={handleClose} className="bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200">
                        Close
                    </Button>
                    <Button variant="success" className="bg-green-600 hover:bg-green-500 text-white transition-colors duration-200">
                        <Link to="/buyPage" className="no-underline text-white font-semibold">
                            Check Out
                        </Link>
                    </Button>
                </Modal.Footer>
            </Modal>

            <nav className="bg-gradient-to-r from-gray-900 to-indigo-900 w-full shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-28">
                        <motion.div
                            className="flex-shrink-0 w-36"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img src={logo} className="rounded-lg shadow-md" alt="Logo" />
                        </motion.div>
                        <div className="hidden md:block">
                            <motion.input
                                type="text"
                                placeholder="Search"
                                className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 w-64 transition-all duration-300"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FontAwesomeIcon
                                    onClick={handleShow}
                                    icon={faCartShopping}
                                    className="cursor-pointer text-2xl px-2 py-2 text-amber-400 hover:text-amber-300 transition-all duration-200"
                                />
                            </motion.div>
                            <div className="flex space-x-4 items-center">
                                {cookie.get("e-commerse") ? (
                                    <div className="relative">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition duration-300"
                                        >
                                            <span>
                                                {name.name} {name.role === "1995" ? "=> (Admin)" : name.role === "1999" ? "=> (User)" : name.role === "2001" ? "=> (Product Manager)" : ""}
                                            </span>
                                            <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                                        </motion.button>
                                        <AnimatePresence>
                                            {isUserDropdownOpen && (
                                                <motion.ul
                                                    variants={dropdownVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    className="absolute top-full left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
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
                                ) : (
                                    <div className="flex gap-3">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Link
                                                to="/register"
                                                className="no-underline px-4 py-2 text-white bg-amber-600 hover listen rounded-lg transition duration-300 hover:bg-amber-700 font-semibold"
                                            >
                                                Register
                                            </Link>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Link
                                                to="/login"
                                                className="no-underline px-4 py-2 text-amber-400 border border-amber-400 hover:bg-amber-400 hover:text-gray-900 rounded-lg transition duration-300 font-semibold"
                                            >
                                                Login
                                            </Link>
                                        </motion.div>
                                    </div>
                                )}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/dashBoard"
                                        className="no-underline px-4 py-2 text-amber-400 border border-amber-400 hover:bg-amber-400 hover:text-gray-900 rounded-lg transition duration-300 font-semibold"
                                    >
                                        DashBoard
                                    </Link>
                                </motion.div>
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsRatedDropdownOpen(!isRatedDropdownOpen)}
                                        className="flex items-center gap-2 bg-gray-800 text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition duration-300"
                                    >
                                        <span>Rated Product</span>
                                        <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                                    </motion.button>
                                    <AnimatePresence>
                                        {isRatedDropdownOpen && (
                                            <motion.ul
                                                variants={dropdownVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="absolute top-full left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
                                            >
                                                <motion.li
                                                    whileHover={{ backgroundColor: "#1f2937" }}
                                                    className="px-4 py-2 text-gray-200 hover:text-amber-400 cursor-pointer transition-colors"
                                                >
                                                    <Link to="/top-rated" className="no-underline text-inherit">
                                                        Top Rated
                                                    </Link>
                                                </motion.li>
                                                <motion.li
                                                    whileHover={{ backgroundColor: "#1f2937" }}
                                                    className="px-4 py-2 text-gray-200 hover:text-amber-400 cursor-pointer transition-colors"
                                                >
                                                    <Link to="/latest-rated" className="no-underline text-inherit">
                                                        Latest Rated
                                                    </Link>
                                                </motion.li>
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                        <div className="md:hidden flex items-center">
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-300 hover:text-amber-400 p-2"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                </svg>
                            </motion.button>
                        </div>
                    </div>
                </div>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="md:hidden bg-gradient-to-br from-gray-900 to-indigo-900 p-6 rounded-b-2xl shadow-2xl"
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="space-y-6">
                                <motion.div
                                    custom={0}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="relative"
                                >
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full bg-gray-800 text-gray-300 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                                    />
                                    <FontAwesomeIcon
                                        icon={faStar}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-400"
                                    />
                                </motion.div>
                                <div className="flex flex-col gap-4">
                                    <motion.div
                                        custom={1}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex justify-between items-center"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FontAwesomeIcon
                                                onClick={handleShow}
                                                icon={faCartShopping}
                                                className="cursor-pointer text-2xl text-amber-400 hover:text-amber-300 transition-colors duration-200"
                                            />
                                        </motion.div>
                                        {cookie.get("e-commerse") ? (
                                            <motion.div
                                                custom={2}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="relative"
                                            >
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                                    className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition duration-300"
                                                >
                                                    <span>
                                                        {name.name} {name.role === "1995" ? "(Admin)" : name.role === "1999" ? "(User)" : name.role === "2001" ? "(Product Manager)" : ""}
                                                    </span>
                                                    <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                                                </motion.button>
                                                <AnimatePresence>
                                                    {isUserDropdownOpen && (
                                                        <motion.ul
                                                            variants={dropdownVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            className="absolute top-full left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
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
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                custom={2}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="flex gap-3"
                                            >
                                                <Link
                                                    to="/register"
                                                    className="no-underline px-4 py-2 text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition duration-300 font-semibold"
                                                >
                                                    Register
                                                </Link>
                                                <Link
                                                    to="/login"
                                                    className="no-underline px-4 py-2 text-amber-400 border border-amber-400 hover:bg-amber-400 hover:text-gray-900 rounded-lg transition duration-300 font-semibold"
                                                >
                                                    Login
                                                </Link>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                    <motion.div
                                        custom={3}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <Link
                                            to="/dashBoard"
                                            className="no-underline block px-4 py-2 text-amber-400 border border-amber-400 hover:bg-amber-400 hover:text-gray-900 rounded-lg transition duration-300 font-semibold text-center"
                                        >
                                            <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
                                            DashBoard
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        custom={4}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="relative"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsRatedDropdownOpen(!isRatedDropdownOpen)}
                                            className="w-full flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition duration-300"
                                        >
                                            <span>Rated Products</span>
                                            <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                                        </motion.button>
                                        <AnimatePresence>
                                            {isRatedDropdownOpen && (
                                                <motion.ul
                                                    variants={dropdownVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    className="mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
                                                >
                                                    <motion.li
                                                        whileHover={{ backgroundColor: "#1f2937" }}
                                                        className="px-4 py-2 text-gray-200 hover:text-amber-400 cursor-pointer transition-colors"
                                                    >
                                                        <Link to="/top-rated" className="no-underline text-inherit">
                                                            Top Rated
                                                        </Link>
                                                    </motion.li>
                                                    <motion.li
                                                        whileHover={{ backgroundColor: "#1f2937" }}
                                                        className="px-4 py-2 text-gray-200 hover:text-amber-400 cursor-pointer transition-colors"
                                                    >
                                                        <Link to="/latest-rated" className="no-underline text-inherit">
                                                            Latest Rated
                                                        </Link>
                                                    </motion.li>
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}