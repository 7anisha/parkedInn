import Admin from "./admin"
import AuthModalProvider from "./contexts/use-auth-modal"
import ThemeProvider from "./contexts/use-theme"
import ToastProvider from "./contexts/use-toast"
import UserProvider from "./contexts/use-user"
import Pages from "./pages"

const App = () => {
  const isAdmin = import.meta.env.VITE_APP_ROLE === "admin"

  return (
    <UserProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthModalProvider>
            {isAdmin ? <Admin /> : <Pages />}
          </AuthModalProvider>
        </ToastProvider>
      </ThemeProvider>
    </UserProvider>
  )
}

export default App
