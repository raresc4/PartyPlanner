import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function BaseLayout({ children }) {
return (<>
    <div className="w-[100vw] h-[100vh] flex flex-col items-start pt-2 pl-2 pr-2 justify-between">
        <Navbar/>
        {children}
    </div>
    </>);
};