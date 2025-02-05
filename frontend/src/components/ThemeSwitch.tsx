import { useTheme } from "../contexts/use-theme";

const ThemeSwitch = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <label className="swap swap-rotate mr-2">
            <input type="checkbox" className="theme-controller" checked={theme === "light"} onChange={() => toggleTheme()} />
            <span className={`iconify mingcute--sun-line swap-on text-2xl`}></span>
            <span className={`iconify mingcute--moon-line swap-off text-2xl`}></span>
        </label>
    )
}

export default ThemeSwitch
