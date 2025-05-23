import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTag } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import { cat } from "../../../Api/api";
import { Axios } from "../../../Api/Axios/axios";

export default function UpdateCategory() {
  // State for loading, button disable, and form inputs
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  // Navigation and URL params
  const nav = useNavigate();
  const { id } = useParams();

  // Fetch category data on component mount
  useEffect(() => {
    setLoading(true);
    Axios.get(`${cat}/${id}`)
      .then((data) => {
        setTitle(data.data.title);
        setLoading(false);
      })
      .then(() => setDisable(false))
      .catch(() => nav("/dashBoard/categories/page/404"));
  }, []);

  // Handle form submission to update category
  async function update(e) {
    e.preventDefault();
    setLoading(true);
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("image", image);
    try {
      const res = await Axios.post(`${cat}/edit/${id}`, formdata);
      setLoading(false);
      console.log(res);
      window.location.pathname = "/dashBoard/categories";
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <>
      {/* Show loading spinner when loading */}
      {loading && <Loading />}
      {/* Main container with vibrant gradient background */}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-700 to-cyan-500 p-4 relative bottom-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        {/* Form with smooth slide-in and perspective animation */}
        <motion.form
          onSubmit={update}
          className="bg-white bg-opacity-90 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md"
          initial={{ y: 150, opacity: 0, rotateX: 20 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 1, ease: "easeOut", type: "spring", stiffness: 120 }}
        >
          {/* Form title with bounce and glow effect */}
          <motion.h1
            className="text-3xl font-bold mb-6 text-center text-pink-500"
            initial={{ scale: 0.5, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            whileHover={{ textShadow: "0 0 10px rgba(236,72,153,0.7)" }}
          >
            Update Category
          </motion.h1>

          {/* Title input field with slide and pulse animation */}
          <motion.div
            className="mb-4"
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center border-4 border-pink-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faTag} className="text-purple-600 mr-2" />
              <input
                className="w-full outline-none text-gray-700"
                type="text"
                placeholder="Title..."
                name="title"
                autoComplete="off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Image input field with slide and rotate animation */}
          <motion.div
            className="mb-6"
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ scale: 1.02, rotate: 2 }}
          >
            <div className="flex items-center border-4 border-pink-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faImage} className="text-purple-600 mr-2" />
              <input
                className="w-full outline-none text-gray-700"
                type="file"
                name="image"
                onChange={(e) => setImage(e.target.files.item(0))}
              />
            </div>
          </motion.div>

          {/* Submit button with dynamic styling and vibrant animations */}
          <motion.button
            disabled={disable}
            type="submit"
            className={`w-full py-3 rounded-full text-white font-bold shadow-lg ${
              disable ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-pink-500 to-cyan-400"
            }`}
            whileHover={
              disable ? {} : { scale: 1.1, boxShadow: "0 0 25px rgba(236,72,153,0.7)", rotate: 3 }
            }
            whileTap={disable ? {} : { scale: 0.9, rotate: -3 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
            whileInView={{
              background: disable
                ? "linear-gradient(to right, #9ca3af, #9ca3af)"
                : [
                    "linear-gradient(to right, #ec4899, #22d3ee)",
                    "linear-gradient(to right, #22d3ee, #ec4899)",
                    "linear-gradient(to right, #ec4899, #22d3ee)",
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