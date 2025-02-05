import API from "./api"

const ProfileAPI = {
    get: () => {
        return API.get('/profile')
    }
}

export default ProfileAPI