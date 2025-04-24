import { createContext, useState } from "react";

export const MarginLeft = createContext("");

export default function MarginLeftContext({ children }) {
    const [marginLeft, setMarginLeft] = useState("65px");

    return (
        <MarginLeft.Provider value={{ marginLeft, setMarginLeft }}>
            {children}
        </MarginLeft.Provider>
    );
}
