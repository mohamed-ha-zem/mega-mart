import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PlusAndMinus from './product/plusAndMinus';
import { Cart } from '../Context/cart';

export default function CheckOut() {
    const [products, setProducts] = useState([]);
    const cart = useContext(Cart);
    const [count, setCount] = useState(0);

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
        setProducts(getProducts); // تحديث الحالة لتحديث الواجهة
    };

    const orderTotal = products.reduce((total , product) => {
        return total + (product.price - product.discount) * (product.count || 1)
    } , 0)

    // عرض منتجات السلة
    const CartProducts = products?.map((product, index) => (
        <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative flex items-start bg-gradient-to-r from-gray-800 to-purple-800 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all mb-4 text-white"
        >
            {/* زر الحذف في أعلى اليمين */}
            <div
                onClick={() => handleDelete(product.id)}
                className="absolute top-2 right-2 bg-red-700 hover:bg-red-800 transition-colors p-2 rounded-full cursor-pointer shadow-lg"
            >
                <FontAwesomeIcon icon={faXmark} className="text-white w-4 h-4" />
            </div>

            {/* العمود الأيسر: الصورة والعداد */}
            <div className="flex flex-col items-center gap-4 w-28">
                {/* صورة المنتج */}
                <div className="relative">
                    <span className="absolute -top-2 -left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold shadow-md animate-bounce">
                        SALE
                    </span>
                    <img
                        src={product.images[0].image}
                        className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow-md"
                        loading="lazy"
                    />
                </div>
                {/* العداد */}
                <PlusAndMinus
                    changeCount={changeCount}
                    id={product.id}
                    count={product.count || 1}
                    setCount={(count) => setCount(count)}
                />
            </div>

            {/* العمود الأيمن: التفاصيل */}
            <div className="flex flex-col gap-1 flex-1 ml-4">
                <h3 className="text-lg font-mono">
                    {product.title.length > 50
                        ? product.title.slice(0, 50) + "..."
                        : product.title}
                </h3>
                <p className="text-sm italic text-white/80">{product.About}</p>
                <p className="text-xs max-h-[60px] overflow-hidden text-ellipsis">
                    {product.description.length > 140
                        ? product.description.slice(0, 140) + "..."
                        : product.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                    <p className="text-lg font-extrabold text-green-300">
                        {(product.price - product.discount) * (product.count || 1)}$
                    </p>
                    <del className="text-sm text-white/70">{product.price * (product.count || 1)}$</del>
                </div>
            </div>
        </motion.div>
    ));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-purple-100 px-4 py-10 flex flex-col lg:flex-row gap-8">
            {/* قسم المنتجات */}
            <div className="flex-1 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center text-4xl font-extrabold text-blue-800 mb-10"
                >
                    Products Cart ✨
                </motion.h1>

                {CartProducts.length > 0 ? (
                    CartProducts
                ) : (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-center text-gray-500 mt-32 text-2xl italic"
                    >
                        No products found 🛒
                    </motion.p>
                )}
            </div>

            {/* قسم الملخص */}
            <div className="w-full lg:w-80">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="bg-white rounded-2xl p-6 shadow-lg sticky top-10"
                >
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Summary</h1>
                    <hr className="border-gray-300 mb-4" />
                    <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Order Total</h3>
                        <span className="text-lg font-extrabold text-green-600">${orderTotal.toFixed(2)}</span>
                    </div>
                    <hr className="border-gray-300 mb-4" />
                    <Link to="/payment">
                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                            Check Out
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}