import { Link, Outlet, useLocation } from "react-router-dom"
import ThemeSwitch from "../components/ThemeSwitch";

const AdminLayout = () => {
    const location = useLocation();
    const path = location.pathname;

    return <div className="relative max-md:mt-[76px] max-md:h-[calc(100vh-76px)]">
        <div className="drawer lg:drawer-open">
            <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <div className="navbar bg-base-100 px-10 fixed top-0 left-0 h-[76px] z-10 max-md:px-4 drop-shadow">
                    <label htmlFor="admin-drawer">
                        <span className="iconify text-2xl mingcute--menu-fill hidden max-md:block"></span>
                    </label>
                    <div className="flex-1">
                        <Link to="/" className="btn btn-ghost text-2xl">ParkedInn Admin</Link>
                    </div>
                    <ThemeSwitch />
                </div>
                <div className="mt-[76px] min-h-[calc(100vh-76px)] max-md:mt-0 max-md:min-h-[unset]">
                    <Outlet />
                </div>
            </div>
            <div className="drawer-side sticky top-[76px] h-[calc(100vh-76px)] max-md:fixed">
                <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <li className={`rounded-lg ${path === "/" ? "bg-slate-800" : ""}`}>
                        <Link to="/" className={`text-lg ${path === "/" ? "text-slate-100 focus:text-slate-100" : ""}`} onClick={() => document.getElementById('admin-drawer')?.click()}>Dashboard</Link>
                    </li>
                    <li className={`rounded-lg ${path.endsWith("/users") ? "bg-slate-800" : ""}`}>
                        <Link to="/users" className={`text-lg ${path.endsWith("/users") ? "text-slate-100 focus:text-slate-100" : ""}`} onClick={() => document.getElementById('admin-drawer')?.click()}>Users</Link>
                    </li>
                    <li className={`rounded-lg ${path.endsWith("/parkings") ? "bg-slate-800" : ""}`}>
                        <Link to="/parkings" className={`text-lg ${path.endsWith("/parkings") ? "text-slate-100 focus:text-slate-100" : ""}`} onClick={() => document.getElementById('admin-drawer')?.click()}>Parking spots</Link>
                    </li>
                    <li className={`rounded-lg ${path.endsWith("/reservations") ? "bg-slate-800" : ""}`}>
                        <Link to="/reservations" className={`text-lg ${path.endsWith("/reservations") ? "text-slate-100 focus:text-slate-100" : ""}`} onClick={() => document.getElementById('admin-drawer')?.click()}>Reservations</Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
}

export default AdminLayout;