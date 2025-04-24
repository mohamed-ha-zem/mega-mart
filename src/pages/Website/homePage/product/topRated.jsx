import { useEffect, useState } from "react"
import { Axios } from "../../../../Api/Axios/axios"
import Skeleton from 'react-loading-skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { TopRatedProducts } from "../../../../Api/api";
import { NavLink } from "react-router-dom";

export default function TopRated(){

        const [loading , setLoading] = useState(true)
        const [products , setProducts] = useState([])
    
        useEffect(() => {
            Axios.get(`${TopRatedProducts}`).then((data) => setProducts(data.data)).finally(() => setLoading(false))
        } , [])

        return(
        <div className="border-4 border-blue-700 mb-4 mr-7">
            <h1 className="font-bold text-slate-100 bg-blue-700 px-20 py-3">Top Rated</h1>
            <div className="flex flex-col justify-center items-center">
                {loading ?
                    (
                        <div
                        className="cursor-pointer group overflow-hidden p-4 duration-500 hover:duration-500 relative w-64 bg-slate-50 shadow-inner rounded-xl m-3"
                        >
                                {Array.from({length: 5}).map((_ , index) => <div key={index} className="col-lg-3 col-md-6 col-12 mt-2">
                                    <Skeleton height="300px" width="200px" />
                                </div>)}
                        </div>
                    ) : (products.slice(0 , 5).map((item) => {
                            const roundStarts = Math.round(item.rating)
                            const stars = Math.min(roundStarts , 5)
                            const solidStarts = Array.from({length: stars}).map((_ , index) => <FontAwesomeIcon key={index} icon={faStarSolid} className="text-yellow-500"/>)
                            const regularStarts = Array.from({length: 5 - stars}).map((_ , index) => <FontAwesomeIcon key={index} icon={faStarRegular} className="text-yellow-500"/>)
                    
                            return (
                                <NavLink to={`/product/${item.id}`}
                                className="cursor-pointer group overflow-hidden p-4 duration-500 hover:duration-500 relative w-64 bg-slate-50 shadow-inner rounded-xl m-3 no-underline"
                                >
                                    <span className="text-gray-900 font-bold text-xl italic">{item.title}</span>
                                    <p className="text-gray-900">
                                        {item.description}
                                    </p>
                                    <p className="bg-blue-700 text-slate-100 rounded-full w-fit p-2 font-bold">Sale</p>
                                    <img src={item.images[0] && item.images[0].image} className="w-32"/>
                                    <hr className="text-gray-800 w-full" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex">
                                                {solidStarts}
                                                {regularStarts}
                                            </div>
                                            <div className="flex mt-4">
                                                <p className="mr-3 text-2xl text-blue-700">{item.price}$</p>
                                                <del className="text-gray-900">{item.price - item.discount}$</del>
                                            </div>
                                        </div>
                                        <FontAwesomeIcon icon={faCartShopping} className="text-gray-900 text-3xl"/>
                                    </div>
                                </NavLink>
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}