import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload,
    faList,
    faTag,
    faFileAlt,
    faDollarSign,
    faPercentage,
    faInfoCircle,
    faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { CAT, pro } from "../../../Api/api";
import { Axios } from "../../../Api/Axios/axios";
import Loading from "../../../components/Loading";

export default function AddProduct() {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [send, setSend] = useState(false);
    const [categories, setCategories] = useState([]);
    const [id, setId] = useState("");
    const openImages = useRef(null);

    const [form, setForm] = useState({
        category: "Chose Category",
        title: "",
        description: "",
        price: "",
        discount: "",
        About: "",
        stock: "",
    });

    const dumy = {
        category: null,
        title: "dumy",
        description: "dumy",
        price: 222,
        discount: 0,
        About: "About",
        stock: 0,
    };

    async function addButEdit(e) {
        e.preventDefault();
        setLoading(true);
        try {
        const res = await Axios.post(`${pro}/edit/${id}`, form);
        setLoading(false);
        console.log(res);
        window.location.pathname = "/dashBoard/products";
        } catch (err) {
        console.log(err);
        setLoading(false);
        }
    }

    async function addProduct() {
        try {
        const res = await Axios.post(`${pro}/add`, dumy);
        setId(res.data.id);
        } catch (err) {
        console.log(err);
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSend(1);
        if (send !== 1) {
        addProduct();
        }
    }

    useEffect(() => {
        Axios.get(`/${CAT}`)
        .then((data) => {
            setCategories(data.data);
        })
        .catch((err) => console.log(err));
    }, []);

    const Showcategories = categories.map((category, key) => (
        <option key={key} value={category.id}>
        {category.title}
        </option>
    ));

    const progress = useRef([]);
    const j = useRef(-1);
    const ids = useRef([]);

    async function handleImagesChange(e) {
        const imagesFiles = [...e.target.files];
        setImages((prev) => [...prev, ...imagesFiles]);

        const data = new FormData();
        for (let i = 0; i < imagesFiles.length; i++) {
        j.current++;
        const currentIndex = j.current;
        data.append("image", imagesFiles[i]);
        data.append("product_id", id);

        try {
            const res = await Axios.post("/product-img/add", data, {
            onUploadProgress: (ProgressEvent) => {
                const { loaded, total } = ProgressEvent;
                const percent = Math.floor((loaded * 100) / total);

                if (percent % 10 === 0 && progress.current[currentIndex]) {
                progress.current[currentIndex].style.width = `${percent}%`;
                progress.current[currentIndex].setAttribute("percent", `${percent}%`);
                }
            },
            });
            ids.current[j.current] = res.data.id;
            console.log(res);
        } catch (err) {
            console.log(err);
        }
        }
    }

    async function handleDelete(image, id) {
        const findId = ids.current[id];

        try {
        const res = await Axios.delete(`product-img/${findId}`);
        setImages((prev) => prev.filter((img) => img !== image));
        ids.current = ids.current.filter((i) => i !== findId);
        --j.current;
        console.log(res);
        } catch (err) {
        console.log(err);
        }
    }

    const ShowImages = images.map((image, key) => (
        <motion.div
        key={key}
        className="flex items-center justify-between bg-white rounded-xl p-4 shadow-lg border border-orange-200 hover:border-orange-300 transition-colors mb-4"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            hover: { scale: 1.02 },
        }}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        >
        <div className="flex items-center gap-6">
            <img
            src={URL.createObjectURL(image)}
            alt={image.name}
            className="w-24 h-24 object-contain rounded-lg"
            />
            <div className="flex flex-col">
            <p className="text-sm font-semibold text-blue-700 truncate">{image.name}</p>
            <p className="text-xs text-gray-600">
                {image.size / 1024 < 100
                ? (image.size / 1024).toFixed(2) + " KB"
                : (image.size / (1024 * 1024)).toFixed(2) + " MB"}
            </p>
            </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
            className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full transition-all duration-300"
            ref={(e) => (progress.current[key] = e)}
            />
        </div>
        <motion.button
            onClick={() => handleDelete(image, key)}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold"
            variants={{ hover: { scale: 1.1 }, tap: { scale: 0.95 } }}
            whileHover="hover"
            whileTap="tap"
        >
            delete
        </motion.button>
        </motion.div>
    ));

    // Animation variants
    const inputVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
        focus: { scale: 1.02, transition: { duration: 0.2 } },
    };

    const labelVariants = {
        idle: { y: 0, scale: 1, color: "#6B7280" },
        active: { y: -25, scale: 0.85, color: "#1E40AF", transition: { duration: 0.2 } },
    };

    const buttonVariants = {
        hover: { scale: 1.1, boxShadow: "0px 4px 15px rgba(0, 150, 255, 0.5)" },
        tap: { scale: 0.9 },
    };

    // Field configurations
    const fields = [
        { name: "category", icon: faList, label: "category" },
        { name: "title", icon: faTag, label: "title" },
        { name: "description", icon: faFileAlt, label: "description" },
        { name: "price", icon: faDollarSign, label: "price" },
        { name: "discount", icon: faPercentage, label: "discount" },
        { name: "About", icon: faInfoCircle, label: "About" },
        { name: "stock", icon: faWarehouse, label: "stock" },
    ];

    return (
        <div className="bg-gradient-to-br from-orange-500 to-pink-300 min-h-screen py-12 w-screen">
        {loading && <Loading />}
        <div className="max-w-3xl mx-auto px-6">
            <motion.h1
            className="text-3xl font-bold text-blue-800 mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            >
            add Product
            </motion.h1>
            <form onSubmit={addButEdit} className="space-y-6">
            {fields.map((field) => (
                <motion.div
                key={field.name}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                whileFocus="focus"
                >
                <div className="relative">
                    <FontAwesomeIcon
                    icon={field.icon}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    {field.name === "category" ? (
                    <>
                        <select
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        className={`peer w-full pl-10 pr-4 py-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                            send
                            ? "bg-white border-blue-500 ring-2 ring-blue-300 text-blue-700"
                            : "bg-white border-gray-300 text-gray-600"
                        } hover:bg-gray-50 pt-6`}
                        >
                        <option disabled value="Chose Category">
                            select category
                        </option>
                        {Showcategories}
                        </select>
                        <motion.label
                        className={`absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none transition-all duration-200 peer-focus:-translate-y-7 peer-focus:scale-85 peer-focus:text-blue-700 ${
                            form[field.name] !== "Chose Category" ? "-translate-y-7 scale-85 text-blue-700" : ""
                        }`}
                        variants={labelVariants}
                        animate={form[field.name] !== "Chose Category" ? "active" : "idle"}
                        >
                        {field.label}
                        </motion.label>
                    </>
                    ) : (
                    <>
                        <input
                        type={field.name === "price" || field.name === "discount" || field.name === "stock" ? "number" : "text"}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        disabled={!send}
                        className={`peer w-full pl-10 pr-4 py-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                            send
                            ? "bg-white border-blue-500 ring-2 ring-blue-300 text-blue-700"
                            : "bg-white border-gray-300 text-gray-600"
                        } hover:bg-gray-50 pt-6`}
                        />
                        <motion.label
                        className={`absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none transition-all duration-200 peer-focus:-translate-y-7 peer-focus:scale-85 peer-focus:text-blue-700 ${
                            form[field.name] ? "-translate-y-7 scale-85 text-blue-700" : ""
                        }`}
                        variants={labelVariants}
                        animate={form[field.name] ? "active" : "idle"}
                        >
                        {field.label}
                        </motion.label>
                    </>
                    )}
                </div>
                </motion.div>
            ))}

            <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <input
                ref={openImages}
                hidden
                multiple
                type="file"
                onChange={handleImagesChange}
                disabled={!send}
                />
                <motion.div
                onClick={() => openImages.current.click()}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 ${
                    send
                    ? "border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 hover:bg-blue-100 cursor-pointer"
                    : "border-gray-300 bg-white text-gray-600"
                } transition-colors`}
                variants={send && buttonVariants}
                whileHover="hover"
                whileTap="tap"
                >
                <FontAwesomeIcon icon={faUpload} className="text-blue-600 text-5xl mb-2" />
                <p className="text-blue-600 font-semibold">upload images</p>
                </motion.div>
            </motion.div>

            <div className="space-y-4">{ShowImages}</div>

            <motion.div
                className="flex justify-start"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.button
                type="submit"
                className="px-8 py-3 text-white font-bold rounded-l-full bg-gradient-to-r from-green-600 to-yellow-400 shadow-lg hover:shadow-xl"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                >
                إضافة
                </motion.button>
            </motion.div>
            </form>
        </div>
        </div>
    );
}