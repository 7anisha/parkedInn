import API from "./api"

const AuthAPI = {
    login: (email: string, password: string) => {
        return API.post('/auth/login', { email, password })
    },
    signup: (email: string, mobile: string, password: string, name: string) => {
        return API.post('/auth/signup', { email, mobile, password, name })
    },
    googleLogin: (name: string, email: string, mobile: string, avatar: string, provider_id: string) => {
        return API.post('/auth/google-login', { name, email, mobile, avatar, provider_id })
    },
    verifyEmail: (token: string) => {
        return API.post('/auth/verify-email', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
    forgotPassword: (email: string) => {
        return API.post('/auth/forgot-password', { email })
    },
    resetPassword: (email: string, password: string, token: string) => {
        return API.post('/auth/reset-password', { email, password }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

export default AuthAPI