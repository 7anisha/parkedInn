import API from "./api"

const AdminAPI = {
    dashboard: (startDate: string, endDate: string) => {
        return API.get(`/admin/dashboard?start_date=${startDate}&end_date=${endDate}`)
    }
}

export default AdminAPI