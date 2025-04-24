import { createContext, useState } from "react";

export const Cart = createContext("")

export default function CartContext({children}){
    const [cart , setCart] = useState(false)

    return (
        <Cart.Provider value={{cart , setCart}}>{children}</Cart.Provider>
    )
}




