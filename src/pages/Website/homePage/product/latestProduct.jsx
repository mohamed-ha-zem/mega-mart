import { useEffect, useState } from "react";
import { Axios } from "../../../../Api/Axios/axios";
import { LatestSale } from "../../../../Api/api";
import ProductHome from "./productHome";
import Skeleton from 'react-loading-skeleton'

export default function LatestProduct(){

    const [loading , setLoading] = useState(true)
    const [products , setProducts] = useState([])

    useEffect(() => {
        Axios.get(`${LatestSale}`)
        .then((data) => setProducts(data.data))
        .finally(() => setLoading(false))
    } , [])
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
      };
    
      return (
        <div className="bg-gradient-to-br from-orange-500 to-pink-300 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h1
              className="text-3xl font-bold text-blue-800 mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              أحدث منتجات التخفيضات
            </motion.h1>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-center"
                    variants={cardVariants}
                  >
                    <Skeleton height={300} width={200} className="rounded-xl" />
                  </motion.div>
                ))
              ) : (
                products?.slice(0, 5).map((item, index) => (
                  <motion.div key={index} variants={cardVariants}>
                    <ProductHome
                      title={item.title}
                      description={item.description}
                      image={item.images[0] && item.images[0].image}
                      price={item.price}
                      discount={item.discount}
                      rating={item.rating}
                      id={item.id}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      );
}