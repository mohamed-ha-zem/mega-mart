import { useContext, useEffect, useState } from "react"
import { MarginLeft } from "../pages/Website/Context/marginContextj"
import { WindowSize } from "../pages/Website/Context/contextWindowSize"
import { Menu } from "../pages/Website/Context/contextMenu"
import { Link } from "react-router-dom"
import PaginatedItems from "../pages/DashBoard/pagination/pagination"
import Loading from "./Loading"
import { Axios } from "../Api/Axios/axios"
import TranseFormDate from "../helpers/transFormDate"

export default function ShowTable(props){
    const marginLeft = useContext(MarginLeft)
    const windowSize = useContext(WindowSize)
    const menu = useContext(Menu)
    const [search , setSearch] = useState("")
    const [filterDataBySearch , setFilterDataBySearch] = useState([])
    const [date , setDate] = useState("")
    const filterDataByDate = props.data.filter((item) => TranseFormDate(item.created_at) === date)
    const showWhithSearchAndDate = filterDataBySearch.filter((item) => TranseFormDate(item.created_at) === date)
    // const showWhichData = search.length !== 0 ? showWhithSearchAndDate : filterDataByDate
    const showWhichData = search.length !== 0 && date.length !== 0 ? showWhithSearchAndDate : 
        search.length !== 0 && date.length === 0 ? filterDataBySearch : 
        search.length === 0 && date.length !== 0 ? filterDataByDate : 
        props.data
        
    async function getSearchData(){
        try{
            const res = await Axios.post(`${props.searchLink}/search?title=${search}`)
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

    // const filterData = props.data.filter((item) => {
    //     return item[props.search].toLocaleLowerCase().includes(search.toLocaleLowerCase())
    // })

    const currentUser = props.currentUser || false

    const showHeader = 
        <tr>
            <th>id</th>
            {props.header.map((item , index) => <th key={index}>{item.name}</th>)}
            <th >Action</th>
        </tr>

    const showData = showWhichData.map((item , key) => {
        return(
        <tr>
            <td>{key + 1}</td>
            {props.header.map((item2) => {
                return(
                    <td key={item2.id}>
                        {
                            item2.key === "images" ? item[item2.key].map((image , index) => <img style={{width: "60px"}} key={index} src={image.image} /> ) :
                            item2.key === "created_at" || item2.key === "updated_at" ? TranseFormDate(item[item2.key]):
                            item[item2.key] === "1995" ? "admin" :
                            item[item2.key] === "1996" ? "Writer" :
                            item[item2.key] === "1999" ? "User" :
                            item[item2.key] === "2001" ? "Product Manager" : // Removed duplicate "2001"
                            // item2.key === "image" ? <img src={item[item2.key]} style={{width: "60px"}} /> :
                            item[item2.key]
                        }
                        {currentUser && item[item2.key] === currentUser.name && " (You)"}
                    </td>
                )
            })}
            <td>
                <div className="actions">
                    <Link to={`${item.id}`} className="edit-btn text-decoration-none">edit</Link>
                    {item.id !== currentUser.id && 
                    <button onClick={() => props.delete(item.id)} className="delete-btn">delete</button>}
                </div>
            </td>
        </tr>
        )
    })
    return(
        <>
            {props.loading && <Loading/>}
            {menu.isOpen ? <div style={{backgroundColor: "rgb(0 0 0 / 65%)" , width: "98.5vw" , height: "100vh" , position: "absolute", overflow: "hidden"}}></div>: <div></div>}
            <div style={{ padding: "20px" }}>
                <form>
                    <input type="search" className="search" onChange={(e) => setSearch(e.target.value)}/>
                </form>
                <form>
                    <input type="date" className="search" onChange={(e) => setDate(e.target.value)}/>
                </form>
                <table className="users" style={{marginLeft: marginLeft.marginLeft}}>
                    <thead>
                        {showHeader}
                    </thead>
                    <tbody>
                        {props.data.length === 0 ? (
                            <tr style={{fontWeight:"bold",fontSize:"30px",display:"flex",justifyContent:"center",width:"90vw"}}>
                                <td colSpan={props.header.length + 1} style={{border: "0"}}>Looding...</td>
                            </tr> 
                        ) : (
                            showData
                        )}
                    </tbody>
                </table>
            </div>
            <div style={{display: "flex" , flexDirection: "column" , alignItems: "flex-end"}}>
                <select style={{marginLeft: "100px"}} onChange={(e) => props.setLimit(e.target.value)}>
                    <option value="3">select Limit</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                </select>
                <PaginatedItems itemsPerPage={props.limit} data={props.data} setPage={props.setPage} total={props.total}/>
            </div>
        </>
    )
}