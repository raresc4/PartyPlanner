import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function BaseLayout({ children }) {
return (<>
    <div className="flex flex-col bg-white w-full h-full">
        <Navbar/>
        {children}
    </div>
    </>);
};