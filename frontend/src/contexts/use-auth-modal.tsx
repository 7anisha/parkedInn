/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useState } from "react"

export type ModeType = 'login' | 'signup' | 'forgot password' | 'reset password'

type AuthModalContextType = {
    mode: ModeType
    setMode: (mode: ModeType) => void
    modalRef: React.RefObject<HTMLDialogElement> | null
    showModal: () => void
    closeModal: () => void
    message: string
    setMessage: (msg: string) => void
}

const AuthModalContext = createContext<AuthModalContextType>({
    mode: 'login',
    setMode: () => { },
    modalRef: null,
    showModal: () => { },
    closeModal: () => { },
    message: "",
    setMessage: () => { },

})

const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const [mode, setMode] = useState<ModeType>('login')
    const [message, setMessage] = useState<string>('')

    const closeModal = () => {
        modalRef.current?.close();
    }

    const showModal = () => {
        modalRef.current?.showModal();
    }

    return (
        <AuthModalContext.Provider value={{ closeModal, showModal, modalRef, mode, setMode, message, setMessage }}>
            {children}
        </AuthModalContext.Provider>
    )
}

export const useAuthModal = () => {
    const context = useContext(AuthModalContext)
    if (context === undefined) {
        throw new Error('useAuthModal must be used within a AuthModalProvider')
    }
    return context
}

export default AuthModalProvider