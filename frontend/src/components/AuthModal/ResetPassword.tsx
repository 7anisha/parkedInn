/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import AuthAPI from "../../api/auth";
import { useAuthModal } from "../../contexts/use-auth-modal";

const ResetPassword = () => {
    const { setMode, setMessage } = useAuthModal()
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') ?? "";
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setMode('login');
        }
    }, [token, setMode])

    const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const email = event.currentTarget.email.value
        const password = event.currentTarget.password.value
        setError("");
        setLoading(true);
        AuthAPI.resetPassword(email, password, token).then(() => {
            setMessage("Password reset successfully");
            setMode('login');
            window.history.replaceState({}, document.title, window.location.pathname);
        }).catch((error: any) => {
            setError(error.response.data.error || "Something went wrong");
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <>
            <form onSubmit={handleResetPassword}>
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input
                    type="text"
                    name="email"
                    placeholder="Enter your email or mobile"
                    className="input input-bordered w-full mb-4"
                />
                <label className="label">
                    <span className="label-text">New password</span>
                </label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="input input-bordered w-full mb-4"
                />
                {error && <div className="alert alert-error mt-2 mb-4 text-sm flex flex-col items-start">{error}</div>}
                <button type="submit" className="btn btn-primary w-full text-white" disabled={loading}>
                    {loading && <span className="iconify mingcute--loading-fill animate-spin text-lg"></span>}
                    Reset password
                </button>
            </form>
        </>
    );
}

export default ResetPassword;