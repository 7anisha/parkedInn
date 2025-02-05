/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import API from "../../api/api";
import AuthAPI from "../../api/auth";
import { useAuthModal } from "../../contexts/use-auth-modal";
import { useUser } from "../../contexts/use-user";

type ErrorType = {
    [key: string]: string | string[]
}

const LoginForm = () => {
    const { setMode, closeModal } = useAuthModal()
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorType>({});
    const { setUser } = useUser();

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log(tokenResponse)
            axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            }).then((res) => {
                AuthAPI.googleLogin(res.data.name, res.data.email, "", res.data.picture, res.data.sub).then((response) => {
                    localStorage.setItem('token', response.data.auth_token)
                    API.defaults.headers.common['Authorization'] = `Bearer ${response.data.auth_token}`
                    setUser(response.data.user)
                    closeModal()
                }).catch((error) => {
                    console.error(error)
                    setErrors(error.response.data.errors)
                })
            });
        },
    });

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const email = event.currentTarget.email.value
        const password = event.currentTarget.password.value
        setLoading(true)
        try {
            const response = await AuthAPI.login(email, password)
            localStorage.setItem('token', response.data.auth_token)
            API.defaults.headers.common['Authorization'] = `Bearer ${response.data.auth_token}`
            setUser(response.data.user)
            closeModal()
        } catch (error: any) {
            console.error(error)
            setErrors(error.response.data.errors)
        } finally {
            setLoading(false)
        }
    }

    return <>
        <form onSubmit={handleLogin}>
            <label className="label">
                <span className={`label-text ${errors?.mobile ? "text-red-600" : ""}`}>Email / Mobile {errors?.mobile}</span>
            </label>
            <input
                type="text"
                name="email"
                placeholder="Enter your email or mobile"
                className={`input input-bordered w-full mb-4 ${errors?.mobile ? "input-error" : ""}`}
                onChange={() => setErrors((errors: any) => ({ ...errors, mobile: "" }))}
            />
            <label className="label">
                <span className={`label-text ${errors?.password ? "text-red-600" : ""}`}>Password {errors?.password}</span>
            </label>
            <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className={`input input-bordered w-full mb-4 ${errors?.password ? "input-error" : ""}`}
                onChange={() => setErrors((errors: ErrorType) => ({ ...errors, password: "" }))}
            />
            {errors?.base && <div className="alert alert-error mt-2 mb-4 text-sm flex flex-col items-start">{errors?.base}</div>}
            <button type="submit" className="btn btn-primary w-full text-white" disabled={loading}>
                {loading && <span className="iconify mingcute--loading-fill animate-spin text-lg"></span>}
                Login
            </button>
        </form>
        <div className="flex justify-between mt-4">
            <button className="btn btn-ghost hover:bg-transparent p-0 text-primary h-fit min-h-fit" onClick={() => setMode('forgot password')}>Forgot password?</button>
            <button className="btn btn-ghost hover:bg-transparent p-0 text-primary h-fit min-h-fit" onClick={() => setMode('signup')}>Create an account</button>
        </div>
        <div className="divider">OR</div>
        <button className="btn btn-outline hover:bg-white hover:text-black" onClick={() => login()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 128 128"><path fill="#fff" d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.3 74.3 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.2 36.2 0 0 1-13.93 5.5a41.3 41.3 0 0 1-15.1 0A37.2 37.2 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.3 38.3 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.3 34.3 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.2 61.2 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38" /><path fill="#e33629" d="M44.59 4.21a64 64 0 0 1 42.61.37a61.2 61.2 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.3 34.3 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21" /><path fill="#f8bd00" d="M3.26 51.5a63 63 0 0 1 5.5-15.9l20.73 16.09a38.3 38.3 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9" /><path fill="#587dbd" d="M65.27 52.15h59.52a74.3 74.3 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68" /><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.2 37.2 0 0 0 14.08 6.08a41.3 41.3 0 0 0 15.1 0a36.2 36.2 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.7 63.7 0 0 1 8.75 92.4" /></svg>
            Continue with Google
        </button>
    </>
}

export default LoginForm