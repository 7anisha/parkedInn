import { useEffect, useState } from "react"
import { useUser } from "../../contexts/use-user"
import AuthModal from "../AuthModal"
import ProfileAPI from "../../api/profile"
import { Link, useNavigate } from "react-router-dom"
import ThemeSwitch from "../ThemeSwitch"

const Navbar = () => {
    const [loading, setLoading] = useState(true)
    const { user, setUser } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setLoading(true)
            ProfileAPI.get()
                .then(response => setUser(response.data))
                .catch(() => {
                    localStorage.removeItem('token')
                    setUser(null)
                }).finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [setUser])

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        navigate('/')
    }

    return <div className="navbar bg-base-100 px-10 fixed top-0 left-0 h-[76px] z-10 max-md:px-4 drop-shadow">
        <div className="flex-none max-md:flex-1">
            <div className="drawer">
                <input id="side-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex items-center space-x-4">
                    <label htmlFor="side-drawer" className="drawer-button hidden max-md:block"><span className="iconify text-2xl mingcute--menu-fill hidden max-md:block"></span></label>
                    <Link to="/" className="font-semibold text-2xl flex items-center space-x-2">
                        <img src="/logo.png" className="w-8" />
                        <span>ParkedInn</span>
                    </Link>
                </div>
                <div className="drawer-side z-10">
                    <label htmlFor="side-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        <li className="-mb-4 flex flex-row justify-between items-center">
                            <span className="text-lg">Menu</span>
                            <span className="iconify text-2xl mingcute--close-fill float-right" onClick={() => document.getElementById('side-drawer')?.click()}></span>
                        </li>
                        <div className="divider"></div>
                        <li><Link className="text-lg" to="/" onClick={() => document.getElementById('side-drawer')?.click()}>Home</Link></li>
                        <li><Link className="text-lg" to="/parkings" onClick={() => document.getElementById('side-drawer')?.click()}>Find parking</Link></li>
                        {user ? <li><Link className="text-lg" to="/reservations" onClick={() => document.getElementById('side-drawer')?.click()}>My reservations</Link></li> : null}
                    </ul>
                </div>
            </div>
        </div>
        <div className="flex-1 max-md:flex-none gap-2 ml-6">
            <ul className="menu menu-horizontal px-1 flex max-md:hidden">
                <li>
                    <Link to="/" className="text-lg">Home</Link>
                </li>
                <li>
                    <Link to="/parkings" className="text-lg">
                        Find parking
                    </Link>
                </li>
                {user ? <li>
                    <Link to="/reservations" className="text-lg">
                        My reservations
                    </Link>
                </li> : null}
            </ul>
        </div>
        <div className="flex-none gap-2">
            <ThemeSwitch />
            {loading ? null : (user ? <div className="flex items-center">
                <div className="mr-4 text-lg block max-md:hidden">{user.name}</div>
                <div className="dropdown dropdown-end z-10">
                    <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle avatar ${user.avatar ? "" : "placeholder"}`}>
                        <div className="w-10 rounded-full bg-green-800">
                            {user.avatar ? <img src={user.avatar} alt="Avatar" /> : <span className="text-white">{user.name[0]}</span>}
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                        <li><a className="text-base pt-2" onClick={logout}>Logout</a></li>
                    </ul>
                </div>
            </div> : <>
                <AuthModal />
            </>)}
        </div>
    </div>
}

export default Navbar