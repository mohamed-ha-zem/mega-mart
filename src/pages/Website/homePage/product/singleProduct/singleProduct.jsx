import React, { useContext, useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Axios } from "../../../../../Api/Axios/axios";
import { pro } from "../../../../../Api/api";
import { useParams } from "react-router-dom";
import { faCartShopping, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Skeleton from "react-loading-skeleton";
import { Cart } from "../../../Context/cart";
import PlusAndMinus from "../plusAndMinus";
import { motion } from "framer-motion";

export default function SingleProduct() {
    const [product, setProduct] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [count, setCount] = useState(0);
    const cart = useContext(Cart);

    useEffect(() => {
        Axios.get(`${pro}/${id}`)
        .then((data) => {
            setProduct(data.data[0]);
            setProductImages(
            data.data[0].images.map((img) => ({
                original: img.image,
                thumbnail: img.image,
            }))
            );
        })
        .finally(() => setLoading(false));
    }, []);

    const images = [
        {
        original: "https://picsum.photos/id/1018/1000/600/",
        thumbnail: "https://picsum.photos/id/1018/250/150/",
        },
        {
        original: "https://picsum.photos/id/1015/1000/600/",
        thumbnail: "https://picsum.photos/id/1015/250/150/",
        },
        {
        original: "https://picsum.photos/id/1019/1000/600/",
        thumbnail: "https://picsum.photos/id/1019/250/150/",
        },
    ];

    const roundStars = Math.round(product.rating);
    const stars = Math.min(roundStars, 5);
    const solidStars = Array.from({ length: stars }).map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStarSolid} className="text-yellow-500" />
    ));
    const regularStars = Array.from({ length: 5 - stars }).map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStarRegular} className="text-yellow-500" />
    ));

    function handleSave() {
        const getProducts = JSON.parse(localStorage.getItem("product")) || [];
        const existProducts = getProducts.findIndex((pro) => pro.id === +id);

        if (existProducts !== -1) {
        if (getProducts[existProducts].count) {
            getProducts[existProducts].count += count;
        } else {
            getProducts[existProducts].count = count;
        }
        } else {
        if (count > 1) {
            product.count = count;
        }
        getProducts.push(product);
        }

        localStorage.setItem("product", JSON.stringify(getProducts));
        cart.setCart((prev) => !prev);
    }

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)", transition: { duration: 0.3 } },
    };

    const galleryVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    const buttonVariants = {
        hover: { scale: 1.1 },
        tap: { scale: 0.95 },
    };

    const skeletonVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.1 } },
    };

    return (
        <div className="bg-gradient-to-br from-orange-500 to-pink-300 min-h-screen py-12">
        {loading ? (
            <div className="max-w-7xl mx-auto px-6">
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center items-start"
                variants={skeletonVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={skeletonVariants}>
                <Skeleton height={250} width={370} className="rounded-xl" />
                <div className="flex gap-3 mt-4">
                    <Skeleton height={70} width={113} className="rounded-lg" />
                    <Skeleton height={70} width={113} className="rounded-lg" />
                    <Skeleton height={70} width={113} className="rounded-lg" />
                </div>
                </motion.div>
                <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-orange-200"
                variants={skeletonVariants}
                >
                <Skeleton height={30} width={100} />
                <Skeleton height={30} width={200} className="my-2" />
                <Skeleton height={30} width={250} />
                <Skeleton height={30} width={50} className="my-2" />
                <Skeleton height={128} width={128} className="mx-auto my-4" />
                <hr className="my-4 border-gray-300" />
                <div className="flex items-center justify-between">
                    <div>
                    <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} height={20} width={20} />
                        ))}
                    </div>
                    <div className="flex gap-4 mt-4">
                        <Skeleton height={20} width={50} />
                        <Skeleton height={20} width={40} />
                    </div>
                    </div>
                    <Skeleton height={50} width={50} />
                </div>
                </motion.div>
            </motion.div>
            </div>
        ) : (
            <div className="max-w-7xl mx-auto px-6">
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center items-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                className="w-full max-w-md"
                variants={galleryVariants}
                initial="hidden"
                animate="visible"
                >
                <ImageGallery
                    items={productImages.length !== 0 ? productImages : images}
                    showPlayButton={false}
                    showFullscreenButton={true}
                    slideInterval={3000}
                />
                </motion.div>
                <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-orange-200 hover:border-orange-300 transition-colors"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                >
                <h2 className="text-2xl font-bold text-blue-800 italic truncate">{product.title}</h2>
                <p className="text-gray-600 text-sm my-2">{product.About}</p>
                <p className="text-gray-800 text-base line-clamp-3">{product.description}</p>
                <span className="inline-block bg-blue-600 text-white text-xs font-semibold rounded-full px-3 py-1 my-2">
                    تخفيض
                </span>
                <hr className="my-4 border-gray-300" />
                <div className="flex items-center justify-between">
                    <div>
                    <div className="flex gap-1 mb-3">{solidStars}{regularStars}</div>
                    <div className="flex items-center gap-3">
                        <p className="text-xl font-semibold text-blue-700">{product.price - product.discount}$</p>
                        <del className="text-sm text-gray-500">{product.price}$</del>
                    </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <PlusAndMinus setCount={(count) => setCount(count)} />
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <FontAwesomeIcon
                        onClick={handleSave}
                        icon={faCartShopping}
                        className="text-gray-700 text-3xl cursor-pointer hover:text-blue-600"
                    />
                    </motion.div>
                </div>
                </motion.div>
            </motion.div>
            </div>
        )}
        </div>
    );
}