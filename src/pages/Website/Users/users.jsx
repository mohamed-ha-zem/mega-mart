// import { USER, USERS } from "../../../Api/api"
// import { useEffect, useState } from "react"
// import { Axios } from "../../../Api/Axios/axios"
// import ShowTable from "../../../components/Table"

// export default function Users(){
//     const [users , setUsers] = useState([])
//     const [currentUser , setCurrentUser] = useState("")
//     const [page , setPage] = useState(1)
//     const [limit , setLimit] = useState(3)
//     const [total , setTotal] = useState(0)
//     const [loading , setLoading] = useState(false)


//     useEffect(() => {
//         Axios.get(`${USER}`).then((res) => setCurrentUser(res.data))
//     } , [])

//     async function handleDelete(id){
//         try{
//             const res = await Axios.delete(`${USER}/${id}`)
//             setUsers((prev) => prev.filter((item) => item.id !== id))
//             console.log(res)
//         }catch(err){
//             console.log(err)
//         } 
//     }

//     useEffect(() => {
//         setLoading(true)
//         Axios.get(`/${USERS}?limit=${limit}&page=${page}`, {
//         }).then((data) => {
//             setUsers(data.data.data)
//             setTotal(data.data.total)
//             console.log(data.data)
//         })
//         .catch((err) => console.log(err))
//         .finally(() => setLoading(false))
//     } , [limit ,page])

//     const header = [
//         // {
//         //     key: "id",
//         //     name: "id"
//         // },
//         {
//             key: "name",
//             name: "name"
//         },
//         {
//             key: "email",
//             name: "email"
//         },
//         {
//             key: "role",
//             name: "role"
//         },
//         {
//             key: "created_at",
//             name: "created_at"
//         },
//         {
//             key: "updated_at",
//             name:"Last Login"
//         },
//     ]

//     return (
//         <>
//             <ShowTable header={header} data={users} delete={handleDelete} currentUser={currentUser} limit={limit} setLimit={setLimit} page={page} setPage={setPage} loading={loading} total={total} search={"name"} searchLink={USER}/>
//         </>
//     );
    
// }
import { USER, USERS } from "../../../Api/api"
import { useContext, useEffect, useState } from "react"
import { Axios } from "../../../Api/Axios/axios"
import { Menu } from "../Context/contextMenu"
import Loading from "../../../components/Loading"
import PaginatedItems from "../../DashBoard/pagination/pagination"
import { Link } from "react-router-dom"
import TranseFormDate from "../../../helpers/transFormDate"
import { faUserEdit, faUserMinus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { MarginLeft } from "../Context/marginContextj"
import { WindowSize } from "../Context/contextWindowSize"

export default function Users(){
    const [users , setUsers] = useState([])
    const [currentUser , setCurrentUser] = useState("")
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
    const filterDataByDate = users.filter((item) => TranseFormDate(item.created_at) === date)
    const showWhithSearchAndDate = filterDataBySearch.filter((item) => TranseFormDate(item.created_at) === date)
    // const showWhichData = search.length !== 0 ? showWhithSearchAndDate : filterDataByDate
    const showWhichData = search.length !== 0 && date.length !== 0 ? showWhithSearchAndDate : 
        search.length !== 0 && date.length === 0 ? filterDataBySearch : 
        search.length === 0 && date.length !== 0 ? filterDataByDate : 
        users
        
    async function getSearchData(){
        try{
            const res = await Axios.post(`${USER}/search?title=${search}`)
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

    useEffect(() => {
        Axios.get(`${USER}`).then((res) => setCurrentUser(res.data))
    } , [])

    async function handleDelete(id){
        try{
            const res = await Axios.delete(`${USER}/${id}`)
            setUsers((prev) => prev.filter((item) => item.id !== id))
            console.log(res)
        }catch(err){
            console.log(err)
        } 
    }

    useEffect(() => {
        setLoading(true)
        Axios.get(`/${USERS}?limit=${limit}&page=${page}`, {
        }).then((data) => {
            setUsers(data.data.data)
            setTotal(data.data.total)
            console.log(data.data)
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))
    } , [limit ,page])
    
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

                {/* Users Cards */}
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-blue-800 mb-6">Users Page</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {showWhichData.map((user) => (
                        <div
                        key={user.id}
                        className="bg-white rounded-xl p-5 shadow-lg border border-yellow-200 hover:shadow-xl hover:scale-105 transition-transform duration-300"
                        >
                        <h2 className="text-xl font-bold text-blue-700 truncate"><span className="text-red-700">Name: </span>{user.name}{currentUser && user.name === currentUser.name && <span className="text-red-700"> (You)</span>}</h2>
                        <p className="text-sm text-gray-700 mt-2">
                            <span className="font-medium text-red-600">email: </span>{' '}
                            <span className="truncate">{user.email}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-medium text-red-600">Role: </span> 
                            {
                                user.role === "1995" ? "admin" :
                                user.role === "1996" ? "Writer" :
                                user.role === "1999" ? "User" :
                                user.role === "2001" ? "Product Manager" :
                                user.role
                            }
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-medium text-red-600">Created_at:</span> {TranseFormDate(user.created_at)}
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-medium text-red-600">Update_at:</span>{' '}
                            <span className="truncate">{TranseFormDate(user.updated_at)}</span>
                        </p>
                        <div className="actions">
                            <Link to={`${user.id}`} className="edit-btn text-decoration-none"><FontAwesomeIcon icon={faUserEdit} /></Link>
                            {user.id !== currentUser.id && 
                            <button onClick={() => handleDelete(user.id)} className="delete-btn"><FontAwesomeIcon icon={faUserMinus} /></button>}
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
                    <PaginatedItems itemsPerPage={limit} data={users} setPage={setPage} total={total} />
                </div>
            </div>
        </>
    );
}