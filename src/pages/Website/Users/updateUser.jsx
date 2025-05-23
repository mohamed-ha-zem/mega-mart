import { useEffect, useState } from "react";
import { USER } from "../../../Api/api";
import { motion } from "framer-motion";
import Loading from "../../../components/Loading";
import { Axios } from "../../../Api/Axios/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateUser() {
  // State for loading, button disable, and form inputs
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // Navigation and URL params
  const nav = useNavigate();
  const { id } = useParams();

  // Fetch user data on component mount
  useEffect(() => {
    setLoading(true);
    Axios.get(`${USER}/${id}`)
      .then((data) => {
        setName(data.data.name);
        setEmail(data.data.email);
        setLoading(false);
      })
      .then(() => setDisable(false))
      .catch(() => nav("/dashBoard/users/page/404"));
  }, []);

  // Handle form submission to update user
  async function update(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Axios.post(`${USER}/edit/${id}`, {
        name: name,
        email: email,
        role: role,
      });
      setLoading(false);
      console.log(res);
      window.location.pathname = "/dashBoard/users";
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <>
      {/* Show loading spinner when loading */}
      {loading && <Loading />}
      {/* Main container with gradient background */}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-teal-800 to-emerald-600 p-4 relative bottom-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Form with animation and responsive styling */}
        <motion.form
          onSubmit={update}
          className="bg-white bg-opacity-90 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Form title with spring animation */}
          <motion.h1
            className="text-3xl font-bold mb-6 text-center text-emerald-500"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
          >
            Update User
          </motion.h1>

          {/* Name input field */}
          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center border-4 border-emerald-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faUserCircle} className="text-teal-600 mr-2" />
              <input
                className="w-full outline-none text-gray-700"
                type="text"
                placeholder="Name..."
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Email input field */}
          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center border-4 border-emerald-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faEnvelope} className="text-teal-600 mr-2" />
              <input
                className="w-full outline-none text-gray-700"
                type="email"
                placeholder="Email..."
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Role select dropdown */}
          <motion.div
            className="mb-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <select
              className="w-full p-2 text-lg font-bold text-gray-700 bg-transparent border-4 border-emerald-400 rounded-lg focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="1995">Admin</option>
              <option value="1999">User</option>
              <option value="2001">Product Manager</option>
            </select>
          </motion.div>

          {/* Submit button with conditional styling and animation */}
          <motion.button
            disabled={disable}
            type="submit"
            className={`w-full py-3 rounded-full text-white font-bold shadow-lg ${
              disable ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-teal-500"
            }`}
            whileHover={disable ? {} : { scale: 1.05, boxShadow: "0 0 20px rgba(16,185,129,0.5)" }}
            whileTap={disable ? {} : { scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Update
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}