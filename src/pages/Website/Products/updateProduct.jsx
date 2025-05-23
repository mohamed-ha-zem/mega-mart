import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faUpload, faDollarSign, faPercent, faInfoCircle, faList } from "@fortawesome/free-solid-svg-icons";
import { CAT, PRO, pro } from "../../../Api/api";
import { Axios } from "../../../Api/Axios/axios";
import Loading from "../../../components/Loading";
import { useParams } from "react-router-dom";

export default function AddProduct() {
  // State for loading, images, categories, and form data
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesReturn, setImagesReturn] = useState([]);
  const [idsReturn, setIdsReturn] = useState([]);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const openImages = useRef(null);

  // Form state for product details
  const [form, setForm] = useState({
    category: "Chose Category",
    title: "",
    description: "",
    price: "",
    discount: "",
    About: "",
  });

  // Fetch product and categories data on mount
  useEffect(() => {
    Axios.get(`/${PRO}`)
      .then((data) => {
        const product = data.data.filter((d) => d.id == id)[0];
        setForm(product);
        setImagesReturn(product.images);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    Axios.get(`/${CAT}`)
      .then((data) => {
        setCategories(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Handle form input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Open file input for image upload
  function handleOpenImages() {
    openImages.current.click();
  }

  // Refs for tracking upload progress and image IDs
  const progress = useRef([]);
  const j = useRef(-1);
  const ids = useRef([]);

  // Handle image upload with progress tracking
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

            if (percent % 10 === 0) {
              if (progress.current[currentIndex]) {
                progress.current[currentIndex].style.width = `${percent}%`;
                progress.current[currentIndex].setAttribute("percent", `${percent}%`);
              }
            }
          },
        });
        ids.current[j.current] = res.data.id;
      } catch (err) {
        console.log(err);
      }
    }
  }

  // Delete uploaded image
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

  // Delete existing product image
  async function handleDeleteImagesReturn(id) {
    setImagesReturn((prev) => prev.filter((img) => img.id !== id));
    setIdsReturn((prev) => [...prev, id]);
  }

  // Handle form submission to update product
  async function addButEdit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      for (let i = 0; i < idsReturn.length; i++) {
        await Axios.delete(`product-img/${idsReturn[i]}`);
      }
      const resEdit = await Axios.post(`${pro}/edit/${id}`, form);
      setLoading(false);
      console.log(resEdit);
      window.location.pathname = "/dashBoard/products";
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  // Render uploaded images with progress bars
  const ShowImages = images.map((image, key) => (
    <motion.div
      key={key}
      className="flex justify-between items-center border-2 border-red-400 rounded-lg p-4 mb-2 bg-gray-50"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: key * 0.1 }}
    >
      <div className="flex items-center gap-4">
        <img src={URL.createObjectURL(image)} className="w-24 h-24 object-cover rounded" />
        <div>
          <p className="text-gray-700 font-semibold">{image.name}</p>
          <p className="text-gray-500">
            {(image.size / 1024 < 100
              ? (image.size / 1024).toFixed(2) + " KB"
              : (image.size / (1024 * 1024)).toFixed(2) + " MB")}
          </p>
        </div>
      </div>
      <motion.button
        onClick={() => handleDelete(image, key)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
        whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
        whileTap={{ scale: 0.9 }}
      >
        Delete
      </motion.button>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className="bg-orange-500 h-2 rounded-full"
          ref={(e) => (progress.current[key] = e)}
        />
      </div>
    </motion.div>
  ));

  // Render existing product images
  const ShowImagesReturn = imagesReturn.map((image, key) => (
    <motion.div
      key={key}
      className="flex justify-between items-center border-2 border-red-400 rounded-lg p-4 mb-2 bg-gray-50"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: key * 0.1 }}
    >
      <div className="flex items-center gap-4">
        <img src={image.image} className="w-24 h-24 object-cover rounded" />
      </div>
      <motion.button
        onClick={() => handleDeleteImagesReturn(image.id)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
        whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
        whileTap={{ scale: 0.9 }}
      >
        Delete
      </motion.button>
    </motion.div>
  ));

  // Render category options
  const ShowCategories = categories.map((category, key) => (
    <option key={key} value={category.id}>
      {category.title}
    </option>
  ));

  return (
    <>
      {/* Show loading spinner when loading */}
      {loading && <Loading />}
      {/* Main container with warm gradient background */}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-orange-700 to-yellow-500 p-4 relative bottom-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        {/* Form with slide-in and perspective animation */}
        <motion.form
          onSubmit={addButEdit}
          className="bg-white bg-opacity-90 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg"
          initial={{ y: 150, opacity: 0, rotateX: 20 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 1, ease: "easeOut", type: "spring", stiffness: 120 }}
        >
          {/* Form title with bounce and glow effect */}
          <motion.h1
            className="text-3xl font-bold mb-6 text-center text-orange-500"
            initial={{ scale: 0.5, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            whileHover={{ textShadow: "0 0 10px rgba(249,115,22,0.7)" }}
          >
            Update Product
          </motion.h1>

          {/* Category select field */}
          <motion.div
            className="mb-4"
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center border-4 border-orange-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faList} className="text-red-600 mr-2" />
              <select
                className="w-full outline-none text-gray-700 bg-transparent"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Chose Category" disabled>
                  Chose Category
                </option>
                {ShowCategories}
              </select>
            </div>
          </motion.div>

          {/* Title input field */}
          <motion.div
            className="mb-4"
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center border-4 border-orange-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faTag} className="text-red-600 mr-2" />
              <input
                className="w-full outline-none text-gray-700"
                type="text"
                placeholder="Title..."
                name="title"
                autoComplete="off"
                value={form.title}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          {/* Description input field */}
          <motion.div
            className="mb-4"
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center border-4 border-orange-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faInfoCircle} className="text-red-600 mr-2" />
              <input
                className="w-full outline-none text-gray-700"
                type="text"
                placeholder="Description..."
                name="description"
                autoComplete="off"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          {/* Price input field */}
          <motion.div
            className="mb-4"
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center border-4 border-orange-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faDollarSign} className="text-red-600 mr-2" />
              <input
                className="w-full outline-none text-gray-700"
                type="text"
                placeholder="Price..."
                name="price"
                autoComplete="off"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          {/* Discount input field */}
          <motion.div
            className="mb-4"
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center border-4 border-orange-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faPercent} className="text-red-600 mr-2" />
              <input
                className="w-full outline-none text-gray-700"
                type="text"
                placeholder="Discount..."
                name="discount"
                autoComplete="off"
                value={form.discount}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          {/* About input field */}
          <motion.div
            className="mb-6"
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center border-4 border-orange-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faInfoCircle} className="text-red-600 mr-2" />
              <input
                className="w-full outline-none text-gray-700"
                type="text"
                placeholder="About..."
                name="About"
                autoComplete="off"
                value={form.About}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          {/* Hidden file input for images */}
          <div>
            <input
              ref={openImages}
              hidden
              multiple
              type="file"
              onChange={handleImagesChange}
            />
          </div>

          {/* Image upload button */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <motion.div
              onClick={handleOpenImages}
              className="flex flex-col items-center p-4 bg-orange-100 rounded-lg cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: "#fed7aa" }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faUpload} className="text-red-600 text-5xl mb-2" />
              <p className="text-red-600 font-bold">Upload Images</p>
            </motion.div>
          </motion.div>

          {/* Display uploaded and existing images */}
          <div className="mb-6">{ShowImagesReturn}{ShowImages}</div>

          {/* Submit button with dynamic animations */}
          <motion.button
            type="submit"
            className="w-full py-3 rounded-full text-white font-bold shadow-lg bg-gradient-to-r from-orange-500 to-yellow-400"
            whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(249,115,22,0.7)", rotate: 3 }}
            whileTap={{ scale: 0.9, rotate: -3 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 100 }}
            whileInView={{
              background: [
                "linear-gradient(to right, #f97316, #facc15)",
                "linear-gradient(to right, #facc15, #f97316)",
                "linear-gradient(to right, #f97316, #facc15)",
              ],
              transition: { duration: 2, repeat: Infinity, repeatType: "reverse" },
            }}
          >
            Update
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}