import { useContext, useEffect, useState } from 'react';
import logo from "../../../../public/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCircleUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Axios } from '../../../Api/Axios/axios';
import { CAT } from '../../../Api/api';
import { Link, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Cart } from '../Context/cart';
import PlusAndMinus from './product/plusAndMinus';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading , setLoading] = useState(true)
    const [products , setProducts] = useState([])
    const [count , setCount] = useState(0)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const cart = useContext(Cart)

    // get all products and put them in the localStorage to put them in the cart 
    useEffect(() => {
        const getProducts = JSON.parse(localStorage.getItem("product")) || [];
        setProducts(getProducts)
    } , [cart.cart])

    // delete the Product in cart 
    function handleDelete(id){
        const filterProducts = JSON.parse(localStorage.getItem("product")).filter((product) => product.id !== id)
        setProducts(filterProducts)
        localStorage.setItem("product" , JSON.stringify(filterProducts))
    }

    // change the count this in the cart Product to the count this in the singel Product 
    const changeCount = function(id , count){
        console.log(id , count)
        const getProducts = JSON.parse(localStorage.getItem("product")) || [];
        const findProduct = getProducts.find((product) => product.id === id)
        findProduct.count = count
        localStorage.setItem("product" , JSON.stringify(getProducts))
    }

    {/* the cart Products */}
    const CartProducts = products?.map((product , index) => {
        return(
            <div className='flex items-center justify-between' key={index}>
                <div 
                className="cursor-pointer group overflow-hidden p-4 duration-500 hover:duration-500 relative w-64 rounded-xl m-3 no-underline h-fit"
                >
                    <span className="text-gray-900 font-bold text-xl italic">{product.title}</span>
                    <p className="text-gray-400 my-2">{product.About}</p>
                    <p className="text-gray-900">
                        {product.description}
                    </p>
                    <p className="bg-blue-700 text-slate-100 rounded-full w-fit p-2 font-bold">Sale</p>
                    <img src={product.images[0].image} className="w-32" loading="lazy"/>
                    <hr className="text-gray-800 w-full" />
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex mt-4">
                                <p className="mr-3 text-2xl text-blue-700">{product.price}$</p>
                                <del className="text-gray-900">{product.discount}$</del>
                            </div>
                            <div>
                                <PlusAndMinus changeCount={changeCount} id={product.id} count={product.count || 1} setCount={(count) => setCount(count)}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-red-800 rounded-full w-10 h-10 flex items-center justify-center mr-9 cursor-pointer' onClick={() => handleDelete(product.id)}>
                    <FontAwesomeIcon icon={faXmark} className='text-slate-200 w-8 h-8'/>
                </div>
            </div>
        )
    })

    return (
        <>
        {/* the cart */}
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {CartProducts}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary">Check Out</Button>
                </Modal.Footer>
            </Modal>
        </div>

        {/* the NavBar  */}
        <nav className="bg-white" style={{ width: "100vw" }}>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Top Section: Logo, Search, and User */}
                <div className="flex items-center justify-between h-28">
                {/* Logo */}
                <div className="flex-shrink-0 w-36">
                    <img src={logo} className="rounded" alt="Logo" />
                </div>

                {/* Search for Desktop */}
                <div className="hidden md:block">
                    <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                </div>

                {/* Right Side: Notification and User */}
                <div className="hidden md:flex items-center space-x-4">
                    <FontAwesomeIcon
                        onClick={handleShow}
                        icon={faCartShopping}
                        className="cursor-pointer text-2xl px-2 py-2 text-gray-950 hover:text-blue-500 hover:transition-all"
                    />
                    <div className="flex space-x-4">
                    <Link 
                        to="/register" 
                        className="no-underline px-2 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300 font-semibold"
                    >
                        Register
                    </Link>
                    <Link 
                        to="/login" 
                        className="no-underline px-2 py-1 text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition duration-300 font-semibold"
                    >
                        Login
                    </Link>
                    <Link 
                        to="/dashBoard" 
                        className="no-underline px-2 py-1 text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition duration-300 font-semibold"
                    >
                        DashBoard
                    </Link>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    </button>
                </div>
                </div>
            </div>

        {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900 mx-10 p-20">
                    <div className="px-2 pt-2 pb-3 space-y-1 mx-1">
                        <input
                        type="text"
                        placeholder="Search"
                        className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex md:flex flex-wrap mt-2 gap-4 max-w-full justify-start">
                    {loading ?
                        (
                            <div className="flex overflow-hidden">
                                {Array.from({length: 10}).map((_ , index) => <div key={index} className="m-3">
                                    <Skeleton height="30px" width="70px" className="px-3 py-2 rounded-md whitespace-nowrap"/>
                                </div>)}
                            </div>
                        ) : (categories.slice(-10).map((category) => 
                            <a
                            key={category.id}
                            className="text-slate-100 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium no-underline cursor-pointer whitespace-nowrap"
                            >
                            {category.title.slice(0, 7)}
                            </a>
                            )   
                        )
                    }
                    {loading ?
                        (
                            <div></div>
                        ) : (<Link
                            className="text-slate-100 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium no-underline cursor-pointer whitespace-nowrap"
                            to="/homeCategories"
                            >
                                Show All
                            </Link>
                        )
                    }
                    
                </div>
                </div>
            )}
        </nav>
        </>
    );
}