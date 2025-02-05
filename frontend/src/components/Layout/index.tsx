import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer";

const Layout = () => {
    return <>
        <Navbar />
        <div className="relative mt-[76px] min-h-[calc(100vh-76px)]">
            <Outlet />
        </div>
        <Footer />
    </>
}

export default Layout;