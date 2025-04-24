import { useContext, useEffect, useState } from 'react';
import logo from "../../../../public/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Axios } from '../../../Api/Axios/axios';
import { CAT } from '../../../Api/api';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Cart } from '../Context/cart';
import PlusAndMinus from './product/plusAndMinus';
import { motion, AnimatePresence } from 'framer-motion'; // استيراد Framer Motion

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const cart = useContext(Cart);

    // جلب المنتجات من localStorage
    useEffect(() => {
        const getProducts = JSON.parse(localStorage.getItem("product")) || [];
        setProducts(getProducts);
    }, [cart.cart]);

    // حذف منتج من السلة
    function handleDelete(id) {
        const filterProducts = JSON.parse(localStorage.getItem("product")).filter(
        (product) => product.id !== id
        );
        setProducts(filterProducts);
        localStorage.setItem("product", JSON.stringify(filterProducts));
    }

    // تغيير عدد المنتجات في السلة
    const changeCount = function (id, count) {
        const getProducts = JSON.parse(localStorage.getItem("product")) || [];
        const findProduct = getProducts.find((product) => product.id === id);
        findProduct.count = count;
        localStorage.setItem("product", JSON.stringify(getProducts));
    };

    // عرض منتجات السلة
    const CartProducts = products?.map((product, index) => (
        <div className="flex items-center justify-between" key={index}>
        <div className="cursor-pointer group overflow-hidden p-4 duration-500 hover:duration-500 relative w-64 rounded-xl m-3 no-underline h-fit">
            <span className="text-gray-900 font-bold text-xl italic">{product.title}</span>
            <p className="text-gray-400 my-2">{product.About}</p>
            <p className="text-gray-900">{product.description}</p>
            <p className="bg-blue-700 text-slate-100 rounded-full w-fit p-2 font-bold">Sale</p>
            <img src={product.images[0].image} className="w-32" loading="lazy" />
            <hr className="text-gray-800 w-full" />
            <div className="flex items-center justify-between">
            <div>
                <div className="flex mt-4">
                <p className="mr-3 text-2xl text-blue-700">{product.price - product.discount}$</p>
                <del className="text-gray-900">{product.pricezyk}</del>
                </div>
                <div>
                <PlusAndMinus
                    changeCount={changeCount}
                    id={product.id}
                    count={product.count || 1}
                    setCount={(count) => setCount(count)}
                />
                </div>
            </div>
            </div>
        </div>
        <div
            className="bg-red-800 rounded-full w-10 h-10 flex items-center justify-center mr-9 cursor-pointer"
            onClick={() => handleDelete(product.id)}
        >
            <FontAwesomeIcon icon={faXmark} className="text-slate-200 w-8 h-8" />
        </div>
        </div>
    ));

    // أنيميشن لقائمة الموبايل
    const menuVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
    };

    return (
        <>
        {/* السلة */}
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
            <Modal.Title>Cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>{CartProducts}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary">Check Out</Button>
            </Modal.Footer>
        </Modal>

        {/* النافبار */}
        <nav className="bg-white w-full shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* الجزء العلوي: اللوجو، البحث، والمستخدم */}
            <div className="flex items-center justify-between h-28">
                {/* اللوجو */}
                <div className="flex-shrink-0 w-36">
                <img src={logo} className="rounded" alt="Logo" />
                </div>

                {/* البحث للديسكتوب */}
                <div className="hidden md:block">
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                </div>

                {/* الجانب الأيمن: السلة وأزرار المستخدم */}
                <div className="hidden md:flex items-center space-x-4">
                <FontAwesomeIcon
                    onClick={handleShow}
                    icon={faCartShopping}
                    className="cursor-pointer text-2xl px-2 py-2 text-gray-950 hover:text-blue-500 transition-all"
                />
                <div className="flex space-x-4">
                    <Link
                    to="/register"
                    className="no-underline px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300 font-semibold"
                    >
                    Register
                    </Link>
                    <Link
                    to="/login"
                    className="no-underline px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition duration-300 font-semibold"
                    >
                    Login
                    </Link>
                    <Link
                    to="/dashBoard"
                    className="no-underline px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition duration-300 font-semibold"
                    >
                    DashBoard
                    </Link>
                </div>
                </div>

                {/* زر قائمة الموبايل */}
                <div className="md:hidden flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-600 hover:text-gray-900 p-2"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                    />
                    </svg>
                </button>
                </div>
            </div>
            </div>

            {/* قائمة الموبايل */}
            <AnimatePresence>
            {isOpen && (
                <motion.div
                className="md:hidden bg-gray-900 p-6 rounded-b-lg shadow-lg"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                >
                <div className="space-y-4">
                    {/* البحث */}
                    <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* الفئات */}
                    <div className="flex flex-wrap gap-2">
                    {loading ? (
                        <div className="flex overflow-hidden">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="m-2">
                            <Skeleton height="30px" width="70px" className="rounded-md" />
                            </div>
                        ))}
                        </div>
                    ) : (
                        categories.slice(-10).map((category) => (
                        <motion.a
                            key={category.id}
                            className="text-slate-100 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium no-underline cursor-pointer whitespace-nowrap"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category.title.slice(0, 7)}
                        </motion.a>
                        ))
                    )}
                    {!loading && (
                        <Link
                        className="text-slate-100 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium no-underline cursor-pointer whitespace-nowrap"
                        to="/homeCategories"
                        >
                        Show All
                        </Link>
                    )}
                    </div>

                    {/* أزرار Login, Register, Dashboard */}
                    <div className="flex flex-col gap-3">
                    <Link
                        to="/register"
                        className="no-underline px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300 font-semibold text-center"
                    >
                        Register
                    </Link>
                    <Link
                        to="/login"
                        className="no-underline px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition duration-300 font-semibold text-center"
                    >
                        Login
                    </Link>
                    <Link
                        to="/dashBoard"
                        className="no-underline px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition duration-300 font-semibold text-center"
                    >
                        DashBoard
                    </Link>
                    </div>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
        </nav>
        </>
    );
}