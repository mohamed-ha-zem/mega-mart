import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTag } from "@fortawesome/free-solid-svg-icons";
import { cat } from "../../../Api/api";
import { Axios } from "../../../Api/Axios/axios";
import Loading from "../../../components/Loading";

export default function AddCategory() {
  // State for loading and form inputs
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  // Handle form submission to add category
  async function add(e) {
    e.preventDefault();
    setLoading(true);
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("image", image);

    try {
      const res = await Axios.post(`${cat}/add`, formdata);
      setLoading(false);
      console.log(res);
      window.location.pathname = "/dashBoard/categories";
    } catch (err) {
      console.log(err);
      setLoading(false);
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
        {/* Form with smooth slide-in animation */}
        <motion.form
          onSubmit={add}
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
            Add Category
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
            disabled={title.length <= 1}
            type="submit"
            className={`w-full py-3 rounded-full text-white font-bold shadow-lg ${
              title.length > 1 ? "bg-gradient-to-r from-pink-500 to-cyan-400" : "bg-gray-400 cursor-not-allowed"
            }`}
            whileHover={
              title.length > 1
                ? { scale: 1.1, boxShadow: "0 0 25px rgba(236,72,153,0.7)", rotate: 3 }
                : {}
            }
            whileTap={title.length > 1 ? { scale: 0.9, rotate: -3 } : {}}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
            whileInView={{
              background:
                title.length > 1
                  ? [
                      "linear-gradient(to right, #ec4899, #22d3ee)",
                      "linear-gradient(to right, #22d3ee, #ec4899)",
                      "linear-gradient(to right, #ec4899, #22d3ee)",
                    ]
                  : "linear-gradient(to right, #9ca3af, #9ca3af)",
              transition: { duration: 2, repeat: Infinity, repeatType: "reverse" },
            }}
          >
            Add
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}