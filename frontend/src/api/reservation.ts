import API from "./api"

const ReservationAPI = {
    list: () => {
        return API.get('/reservations')
    },
    get: (id: number) => {
        return API.get(`/reservations/${id}`)
    },
    verify: (token: string) => {
        return API.get(`/reservations/verify?token=${token}`)
    },
    navigate: (id: number) => {
        return API.get(`/reservations/${id}/navigate`)
    }
}

export default ReservationAPI