/* eslint-disable react-hooks/exhaustive-deps */
import LoginForm from "./Login";
import SignupForm from "./Signup";
import ForgotPasswordForm from "./ForgotPassword";
import ResetPasswordForm from "./ResetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthModal } from "../../contexts/use-auth-modal";
import { useEffect } from "react";
import AuthAPI from "../../api/auth";

const AuthModal = () => {
    const { mode, modalRef, message, setMessage, setMode, showModal, closeModal } = useAuthModal();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') ?? "";
    const tokenType = urlParams.get('token-type') ?? "";

    useEffect(() => {
        if (tokenType === "reset-password") {
            setMode('reset password')
            showModal()
        } else if (tokenType === "verify-email") {
            AuthAPI.verifyEmail(token).then(() => {
                setMessage("Your email has been verified. You can now login.")
                setMode('login')
                showModal()
            }).catch((err) => {
                setMessage(err.response.data.error || "Invalid token. Please try again.")
                setMode('login')
                showModal()
            })
        }
    }, [token, tokenType])

    return <>
        <button className="btn btn-ghost border-2 border-primary text-primary" onClick={showModal}>Login</button>
        <dialog ref={modalRef} className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-5" onClick={closeModal}>✕</button>
                </form>
                <div className="flex w-full flex-col border-opacity-50">
                    <h3 className="font-bold text-lg capitalize">{mode}</h3>
                    <div className="divider"></div>
                    {message && <div role="alert" className="alert alert-success mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{message}</span>
                        <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setMessage("")}>✕</button>
                    </div>}
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_KEY}>
                        {mode === 'login' && <LoginForm />}
                        {mode === 'signup' && <SignupForm />}
                        {mode === 'forgot password' && <ForgotPasswordForm />}
                        {mode === 'reset password' && <ResetPasswordForm />}
                    </GoogleOAuthProvider>
                </div>
            </div>
        </dialog>
    </>
}

export default AuthModal