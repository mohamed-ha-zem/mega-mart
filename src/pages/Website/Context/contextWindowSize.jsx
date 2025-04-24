import { createContext, useEffect, useState } from "react";

export const WindowSize = createContext(null)

export default function WindowSizeContext({children}){
    const [windowSize , setWindowSize] = useState(window.innerWidth)

    useEffect(() => {
        function setWindowsize(){
            setWindowSize(window.innerWidth)
        }
        window.addEventListener("resize" , setWindowsize)
        return () => {
            window.removeEventListener("resize" , setWindowsize)
        }
    } , [])

    return (
        <WindowSize.Provider value={{windowSize , setWindowSize}}>
            {children}
        </WindowSize.Provider>
    )
}



