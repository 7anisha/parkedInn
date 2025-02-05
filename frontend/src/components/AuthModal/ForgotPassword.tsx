/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import AuthAPI from "../../api/auth";
import { useAuthModal } from "../../contexts/use-auth-modal";
import { useToast } from "../../contexts/use-toast";

type ErrorType = {
    [key: string]: string | string[]
}

const ForgotPasswordForm = () => {
    const { closeModal } = useAuthModal()
    const { showToast } = useToast()
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorType>({});

    const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const email = event.currentTarget.email.value
        setLoading(true)
        try {
            const response = await AuthAPI.forgotPassword(email)
            showToast(response.data.message, 'success')
            closeModal()
        } catch (error: any) {
            console.log(error)
            setErrors(error.response.data?.errors || {})
        } finally {
            setLoading(false)
        }
    }

    return <>
        <form onSubmit={handleReset}>
            <label className="label">
                <span className={`label-text ${errors.email ? "text-red-600" : ""}`}>Email / Mobile {errors.email}</span>
            </label>
            <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className={`input input-bordered w-full mb-4 ${errors.email ? "input-error" : ""}`}
                onChange={() => setErrors((errors: any) => ({ ...errors, email: "" }))}
            />
            {errors.base && <div className="alert alert-error mt-2 mb-4 text-sm flex flex-col items-start">{errors.base}</div>}
            <button type="submit" className="btn btn-primary w-full text-white mt-4" disabled={loading}>
                {loading && <span className="iconify mingcute--loading-fill animate-spin text-lg"></span>}
                Send password reset link
            </button>
        </form>
    </>
}

export default ForgotPasswordForm