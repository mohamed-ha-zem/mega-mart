import { useContext, useEffect, useState } from "react"
import { Axios } from "../../../Api/Axios/axios"
import { cat, CAT } from "../../../Api/api"
import TranseFormDate from "../../../helpers/transFormDate"
import { Menu } from "../Context/contextMenu"
import Loading from "../../../components/Loading"
import PaginatedItems from "../../DashBoard/pagination/pagination"
import { Link } from "react-router-dom"
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { MarginLeft } from "../Context/marginContextj"
import { WindowSize } from "../Context/contextWindowSize"

export default function Categories(){
    const [categories , setCategories] = useState([])
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
        const filterDataByDate = categories.filter((item) => TranseFormDate(item.created_at) === date)
        const showWhithSearchAndDate = filterDataBySearch.filter((item) => TranseFormDate(item.created_at) === date)
        // const showWhichData = search.length !== 0 ? showWhithSearchAndDate : filterDataByDate
        const showWhichData = search.length !== 0 && date.length !== 0 ? showWhithSearchAndDate : 
            search.length !== 0 && date.length === 0 ? filterDataBySearch : 
            search.length === 0 && date.length !== 0 ? filterDataByDate : 
            categories
            
        async function getSearchData(){
            try{
                const res = await Axios.post(`${cat}/search?title=${search}`)
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
            const res = await Axios.delete(`${cat}/${id}`)
            setCategories((prev) => prev.filter((item) => item.id !== id))
            console.log(res)
        }catch(err){
            console.log(err)
        } 
    }

    useEffect(() => {
        setLoading(true)
        Axios.get(`/${CAT}?limit=${limit}&page=${page}`)
        .then((data) => {
            setCategories(data.data.data)
            setTotal(data.data.total)
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))
    } , [limit , page])

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-blue-100 to-yellow-100 p-4 w-screen" style={{marginLeft: marginLeft.marginLeft}}>
                {loading && <Loading />}
                {menu.isOpen ? <div style={{backgroundColor: "rgb(0 0 0 / 65%)" , width: "98.5vw" , height: "100vh" , position: "absolute", overflow: "hidden" , top: "0px" , left: "0px"}}></div>: <div></div>}

                {/* Search and Date Inputs */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 max-w-7xl mx-auto">
                    <form className="flex-1">
                    <input
                        type="search"
                        placeholder="ابحث بالاسم..."
                        className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    </form>
                    <form className="flex-1">
                    <input
                        type="date"
                        className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                        onChange={(e) => setDate(e.target.value)}
                    />
                    </form>
                </div>

                {/* Categories Cards */}
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-blue-800 mb-6">Categories Page</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {showWhichData.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-xl p-5 shadow-lg border border-yellow-200 hover:shadow-xl hover:scale-105 transition-transform duration-300"
                        >
                            <h2 className="text-xl font-bold text-blue-700 truncate">
                            <span className="text-red-700">Name: </span>{category.title}
                            </h2>
                            <img
                            className="w-40 brightness-100"
                            alt="image"
                            src={category.image}
                            style={{ filter: 'none' }} // إلغاء أي تأثير dim
                            />
                            <p className="text-sm text-gray-700">
                            <span className="font-medium text-red-600">Created_at:</span>{' '}
                            {TranseFormDate(category.created_at)}
                            </p>
                            <p className="text-sm text-gray-700">
                            <span className="font-medium text-red-600">Update_at:</span>{' '}
                            <span className="truncate">{TranseFormDate(category.updated_at)}</span>
                            </p>
                            <div className="actions">
                            <Link to={`${category.id}`} className="edit-btn text-decoration-none">
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </Link>
                            <button onClick={() => handleDelete(category.id)} className="delete-btn">
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Pagination and Limit */}
                <div className="flex flex-col items-end max-w-7xl mx-auto mt-6">
                    <select
                    className="mb-4 p-2 rounded-lg border border-blue-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setLimit(e.target.value)}
                    >
                    <option value="3">اختر الحد</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    </select>
                    <PaginatedItems itemsPerPage={limit} data={categories} setPage={setPage} total={total} />
                </div>
            </div>
        </>
    );
    // return (
    //     <>
    //         <div>
    //             <ShowTable header={header} data={categories} delete={handleDelete} limit={limit} setLimit={setLimit} page={page} setPage={setPage} loading={loading} total={total} search={"title"} searchLink={cat}/>
    //         </div>
    //     </>
    // );
    
}