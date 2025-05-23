import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseURL, REGISTER } from "../../Api/api";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Loading from "../../components/Loading";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export function FormuseFormik() {
  const [ErrorEmail, setErrorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const cookie = new Cookies();
  const navigate = useNavigate();

  const registerSchema = Yup.object({
    name: Yup.string().min(3).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(8).required(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: registerSchema,
    onSubmit: register,
  });

  async function register(values) {
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/${REGISTER}`, values);
      setLoading(false);
      const token = res.data.token;
      cookie.set("e-commerse", token);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      console.log(err);
      if (err.status === 422) {
        setErrorEmail(err.response.data.message);
      }
    }
  }

  const focus = useRef(null);

  useEffect(() => {
    focus.current.focus();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-blue-600 to-green-500 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.form
          onSubmit={formik.handleSubmit}
          className="bg-white bg-opacity-90 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className={`text-3xl font-bold mb-6 text-center ${
              formik.errors.name && formik.touched.name ||
              formik.errors.email && formik.touched.email ||
              formik.errors.password && formik.touched.password
                ? "text-red-500"
                : "text-green-500"
            }`}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          >
            Register Now
          </motion.h1>

          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className={`flex items-center border-4 rounded-lg p-2 ${
                formik.errors.name && formik.touched.name
                  ? "border-red-500"
                  : "border-green-400"
              }`}
            >
              <i className="fa-regular fa-circle-user text-purple-500 mr-2"></i>
              <input
                className="w-full outline-none text-gray-700"
                type="text"
                placeholder="Name..."
                name="name"
                autoComplete="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                ref={focus}
              />
            </div>
            {formik.errors.name && formik.touched.name && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formik.errors.name}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className={`flex items-center border-4 rounded-lg p-2 ${
                formik.errors.email && formik.touched.email || ErrorEmail
                  ? "border-red-500"
                  : "border-green-400"
              }`}
            >
              <i className="fa-regular fa-envelope text-purple-500 mr-2"></i>
              <input
                className="w-full outline-none text-gray-700"
                type="email"
                placeholder="Email..."
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.email && formik.touched.email && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formik.errors.email}
              </motion.p>
            )}
            {ErrorEmail && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {ErrorEmail}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            className="mb-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              className={`flex items-center border-4 rounded-lg p-2 ${
                formik.errors.password && formik.touched.password
                  ? "border-red-500"
                  : "border-green-400"
              }`}
            >
              <i className="fa-solid fa-key text-purple-500 mr-2"></i>
              <input
                className="w-full outline-none text-gray-700"
                type="password"
                placeholder="Password..."
                name="password"
                autoComplete="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.password && formik.touched.password && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formik.errors.password}
              </motion.p>
            )}
          </motion.div>

          <motion.button
            type="submit"
            className={`w-full py-3 rounded-full text-white font-bold shadow-lg ${
              formik.errors.name && formik.touched.name ||
              formik.errors.email && formik.touched.email ||
              formik.errors.password && formik.touched.password
                ? "bg-gradient-to-r from-red-600 to-orange-600"
                : "bg-gradient-to-r from-green-500 to-yellow-400"
            }`}
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0,255,0,0.5)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Register
          </motion.button>

          <motion.a
            href="http://127.0.0.1:8000/login-google"
            className="flex items-center justify-center mt-4 p-3 bg-white border-2 border-gray-200 rounded-full shadow-md hover:bg-gray-100 no-underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </motion.a>
        </motion.form>
      </motion.div>
    </>
  );
}

export default function Register() {
  return (
    <div>
      <FormuseFormik />
    </div>
  );
}