import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

export default function PlusAndMinus (props){
  const [quantity, setQuantity] = useState(1); // الكمية بتبدأ من 1 زي الصورة

    useEffect(() => {
        props.setCount(quantity)

        if(props.changeCount){
            props.changeCount(props.id , quantity)
        }
    } , [quantity])

    useEffect(() => {
        if(props.count){
            setQuantity(props.count)
        }
    } , [])

    // زيادة الكمية
    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    // تقليل الكمية (ما يقلش عن 0)
    const handleDecrease = () => {
        if (quantity > 0) {
        setQuantity(quantity - 1);
        }
    };

    // تحديث الكمية من الـ input
    const handleInputChange = (e) => {
        const value = e.target.value;
        // نقبل أرقام فقط وما تكونش سالبة
        if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
        setQuantity(value === '' ? 0 : parseInt(value));
        }
    };

    return (
        <div className="flex items-center">
        {/* زر التقليل */}
        <button
            onClick={handleDecrease}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 text-black border border-gray-300 rounded-l disabled:bg-gray-100"
            disabled={quantity === 0}
        >
            <FontAwesomeIcon icon={faMinus}/>
        </button>

        {/* حقل الإدخال */}
        <input
            type="text"
            value={quantity}
            onChange={handleInputChange}
            className="w-10 h-10 text-center bg-white border-t border-b border-gray-300 outline-none"
        />

        {/* زر الزيادة */}
        <button
            onClick={handleIncrease}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 text-black border border-gray-300 rounded-r"
        >
            <FontAwesomeIcon icon={faPlus} />
        </button>
        </div>
    );
};
