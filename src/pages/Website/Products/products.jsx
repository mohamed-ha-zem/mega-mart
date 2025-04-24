import { use, useContext, useEffect, useState } from "react"
import { Axios } from "../../../Api/Axios/axios"
import { PRO, pro } from "../../../Api/api"
import { Menu } from "../Context/contextMenu"
import TranseFormDate from "../../../helpers/transFormDate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faStar as faStarSolid, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import Loading from "../../../components/Loading"
import PaginatedItems from "../../DashBoard/pagination/pagination"
import { Link } from "react-router-dom"
import { motion } from 'framer-motion';
import { MarginLeft } from "../Context/marginContextj"
import { WindowSize } from "../Context/contextWindowSize"

export default function Porducts(){
    const [products , setProducts] = useState([])
    const [page , setPage] = useState(1)
    const [limit , setLimit] = useState(3)
    const [total , setTotal] = useState(0)
    const [loading , setLoading] = useState(false)

    const marginLeft = useContext(MarginLeft)
    const windowSize = useContext(WindowSize)
    const menu = useContext(Menu)
    const [search , setSearch] = useState("")
    const [filterDataBySearch , setFilterDataBySearch] = useState([])
    const [date , setDate] = useState("")
    const filterDataByDate = products.filter((item) => TranseFormDate(item.created_at) === date)
    const showWhithSearchAndDate = filterDataBySearch.filter((item) => TranseFormDate(item.created_at) === date)
    // const showWhichData = search.length !== 0 ? showWhithSearchAndDate : filterDataByDate
    const showWhichData = search.length !== 0 && date.length !== 0 ? showWhithSearchAndDate : 
        search.length !== 0 && date.length === 0 ? filterDataBySearch : 
        search.length === 0 && date.length !== 0 ? filterDataByDate : 
        products
        
    async function getSearchData(){
        try{
            const res = await Axios.post(`${pro}/search?title=${search}`)
            console.log(res)
            setFilterDataBySearch(res.data)
        }catch(err){
            console.log(err)
        } 
    }
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            search.length !== 0 && getSearchData()
        } , 500)

        return () => clearTimeout(delaySearch)
    } , [search])

    useEffect(() => {
        windowSize.windowSize < 767 ? marginLeft.setMarginLeft("0px") : marginLeft.setMarginLeft("65px")
    } , [windowSize.windowSize])
    
    async function handleDelete(id){
        try{
            const res = await Axios.delete(`${pro}/${id}`)
            setProducts((prev) => prev.filter((item) => item.id !== id))
            console.log(res)
        }catch(err){
            console.log(err)
        } 
    }

    useEffect(() => {
        setLoading(true)
        Axios.get(`/${PRO}?limit=${limit}&page=${page}`, {
        }).then((data) => {
            setProducts(data.data.data)
            setTotal(data.data.total)
            console.log(data.data)
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))
    } , [limit , page])

  // Animation variants للـ cards
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
        hover: { scale: 1.05, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)', transition: { duration: 0.3 } },
    };

    // Animation للصور
    const imageVariants = {
        hover: { scale: 1.1, transition: { duration: 0.3 } },
    };

    // Animation للأزرار
    const buttonVariants = {
        hover: { scale: 1.1 },
        tap: { scale: 0.95, transition: { duration: 0.2 } },
    };

    const priceVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
        hover: { scale: 1.1, transition: { duration: 0.2 } },
    };

    const discountVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.2 } },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-300 p-6 w-screen" style={{ marginLeft: marginLeft.marginLeft}}>
        {loading && <Loading />}
        {menu.isOpen ? <div style={{backgroundColor: "rgb(0 0 0 / 65%)" , width: "98.5vw" , height: "100vh" , position: "absolute", overflow: "hidden" , top: "0px" , left: "0px"}}></div>: <div></div>}

        {/* Search and Date Inputs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-7xl" style={{ marginRight: marginLeft.marginLeft}}>
            <form className="flex-1">
            <input
                type="search"
                placeholder="ابحث بالاسم..."
                className="w-full p-4 rounded-xl border border-blue-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                onChange={(e) => setSearch(e.target.value)}
            />
            </form>
            <form className="flex-1">
            <input
                type="date"
                className="w-full p-4 rounded-xl border border-blue-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                onChange={(e) => setDate(e.target.value)}
            />
            </form>
        </div>

        {/* Products Cards */}
        <div className="max-w-7xl mx-auto">
            <motion.h1
            className="text-4xl font-extrabold text-blue-900 mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            >
            Products Page
            </motion.h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginRight: marginLeft.marginLeft}}>
            {showWhichData.map((product) => (
                <motion.div
                key={product.id}
                className="bg-white rounded-2xl p-6 shadow-xl border border-yellow-100 hover:border-yellow-300 transition-colors"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                >
                <motion.img
                    src={product.images[0]?.image || '/assets/default-product.png'}
                    alt={product.title}
                    className="w-full h-56 object-contain rounded-lg mb-4"
                    variants={imageVariants}
                    whileHover="hover"
                />
                <h2 className="text-xl font-bold text-blue-800 truncate">
                    <span className="text-red-600">title: </span> {product.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    <span className="font-medium text-red-600">description: </span> {product.description}
                </p>
                <motion.div
                className="mt-3 flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm"
                initial="hidden"
                animate="visible"
                >
                    <motion.div className="flex items-center gap-2" variants={priceVariants}>
                    <p className="text-xl font-bold text-blue-800 bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
                        {product.price - product.discount}$
                    </p>
                    <motion.del
                        className="text-sm text-white bg-red-500 px-2 py-1 rounded-full"
                        variants={discountVariants}
                    >
                        {product.price}$
                    </motion.del>
                    </motion.div>
                </motion.div>
                <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium text-red-600">created_at: </span>{' '}
                    {TranseFormDate(product.created_at)}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium text-red-600">updated_at: </span>{' '}
                    {TranseFormDate(product.updated_at)}
                </p>
                <div className="mt-4 flex gap-3 justify-center items-center">
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                        to={`${product.id}`}
                        className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold no-underline"
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Link>
                    </motion.div>
                    <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold"
                    >
                    <FontAwesomeIcon icon={faTrashCan} />
                    </motion.button>
                </div>
                </motion.div>
            ))}
            </div>
        </div>

        {/* Pagination and Limit */}
        <div className="flex flex-col items-end max-w-7xl mt-8" style={{ marginRight: marginLeft.marginLeft}}>
            <motion.select
            className="mb-4 p-3 rounded-lg border border-blue-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setLimit(e.target.value)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            >
            <option value="3">اختر الحد</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
            </motion.select>
            <PaginatedItems itemsPerPage={limit} data={showWhichData} setPage={setPage} total={total} />
        </div>
        </div>
    );
    // return (
    //     <>
    //         <div>
    //             <ShowTable header={header} data={products} delete={handleDelete} limit={limit} setLimit={setLimit} page={page} setPage={setPage} loading={loading} total={total} search={"title"} searchLink={pro}/>
    //         </div>
    //     </>
    // );
    
}