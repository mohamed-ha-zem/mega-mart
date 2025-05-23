import { useState } from "react";
import { USER } from "../../../Api/api";
import { motion } from "framer-motion";
import Loading from "../../../components/Loading";
import { Axios } from "../../../Api/Axios/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function AddUser() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  async function update(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Axios.post(`${USER}/add`, {
        name: name,
        email: email,
        password: password,
        role: role,
      });
      setLoading(false);
      console.log(res);
      window.location.pathname = "/dashBoard/users";
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loading />}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-teal-800 to-emerald-600 p-4 relative bottom-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.form
          onSubmit={update}
          className="bg-white bg-opacity-90 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl font-bold mb-6 text-center text-emerald-500"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
          >
            Add User
          </motion.h1>

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
                placeholder="name..."
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </motion.div>

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
                placeholder="email..."
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center border-4 border-emerald-400 rounded-lg p-2 shadow-inner">
              <FontAwesomeIcon icon={faKey} className="text-teal-600 mr-2" />
              <input
                className="w-full outline-none text-gray-700"
                type="password"
                placeholder="password..."
                name="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <select
              className="w-full p-2 text-lg font-bold text-gray-700 bg-transparent border-4 border-emerald-400 rounded-lg focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                chose Role
              </option>
              <option value="1995">admin</option>
              <option value="1999">User</option>
              <option value="2001">Producted Manager</option>
            </select>
          </motion.div>

          <motion.button
            disabled={name.length <= 1 || email.length <= 2 || password.length <= 7 || role === ""}
            type="submit"
            className={`w-full py-3 rounded-full text-white font-bold shadow-lg ${
              name.length > 1 && email.length > 2 && password.length > 7 && role !== ""
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            whileHover={
              name.length > 1 && email.length > 2 && password.length > 7 && role !== ""
                ? { scale: 1.05, boxShadow: "0 0 20px rgba(16,185,129,0.5)" }
                : {}
            }
            whileTap={
              name.length > 1 && email.length > 2 && password.length > 7 && role !== ""
                ? { scale: 0.95 }
                : {}
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            add
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}