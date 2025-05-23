import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cart } from '../../Context/cart';

export default function PaymentPage() {
    const [products, setProducts] = useState([]);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });
    const [errors, setErrors] = useState({});
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const cart = useContext(Cart);

    // جلب المنتجات من localStorage
    useEffect(() => {
        const getProducts = JSON.parse(localStorage.getItem("product")) || [];
        setProducts(getProducts);
    }, [cart.cart]);

    // حساب إجمالي الطلب
    const orderTotal = products.reduce((total, product) => {
        return total + (product.price - product.discount) * (product.count || 1);
    }, 0);

    // التحقق من صحة المدخلات
    const validateForm = () => {
        const newErrors = {};
        if (!cardDetails.cardNumber || cardDetails.cardNumber.length !== 16)
            newErrors.cardNumber = 'Card number must be 16 digits';
        if (!cardDetails.cardHolder) newErrors.cardHolder = 'Cardholder name is required';
        if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate))
            newErrors.expiryDate = 'Enter valid expiry date (MM/YY)';
        if (!cardDetails.cvv || cardDetails.cvv.length !== 3)
            newErrors.cvv = 'CVV must be 3 digits';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // التعامل مع إدخال البيانات
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails((prev) => ({ ...prev, [name]: value }));
    };

    // التعامل مع تأكيد الدفع
    const handlePayment = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setPaymentSuccess(true);
            // محاكاة عملية دفع (يمكن استبدالها بطلب API لاحقًا)
            setTimeout(() => {
                localStorage.removeItem("product"); // تفريغ السلة بعد الدفع
                setProducts([]);
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-purple-100 px-4 py-10 flex flex-col lg:flex-row gap-8">
            {/* نموذج الدفع */}
            <div className="flex-1 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center text-4xl font-extrabold text-blue-800 mb-10"
                >
                    Payment Details 💳
                </motion.h1>

                {paymentSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center bg-white p-10 rounded-2xl shadow-lg"
                    >
                        <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">Thank you for your purchase. You'll receive a confirmation soon.</p>
                        <Link to="/" className="no-underline">
                            <button className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                                Back to Home
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="bg-white p-8 rounded-2xl shadow-lg"
                        onSubmit={handlePayment}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* رقم البطاقة */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Card Number</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={cardDetails.cardNumber}
                                    onChange={handleInputChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="16"
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                            </div>

                            {/* اسم حامل البطاقة */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Cardholder Name</label>
                                <input
                                    type="text"
                                    name="cardHolder"
                                    value={cardDetails.cardHolder}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.cardHolder && <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>}
                            </div>

                            {/* تاريخ الانتهاء */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={cardDetails.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                            </div>

                            {/* CVV */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={cardDetails.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    maxLength="3"
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 mt-6"
                        >
                            Confirm Payment
                        </button>
                    </motion.form>
                )}
            </div>

            {/* ملخص الطلب */}
            <div className="w-full lg:w-80">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="bg-white rounded-2xl p-6 shadow-lg sticky top-10"
                >
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h1>
                    <hr className="border-gray-300 mb-4" />
                    <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Order Total</h3>
                        <span className="text-lg font-extrabold text-green-600">${orderTotal.toFixed(2)}</span>
                    </div>
                    <hr className="border-gray-300 mb-4" />
                    <p className="text-sm text-gray-500 italic">Payments are securely processed.</p>
                </motion.div>
            </div>
        </div>
    );
}