/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "./api"

const ParkingAPI = {
    list: (lat: number, lng: number, search: string, radius: number, disabled: boolean, special: boolean) => {
        return API.get('/parkings?lat=' + lat + '&lng=' + lng + '&search=' + search + '&radius=' + radius + '&disabled_access=' + disabled + '&special_guard=' + special)
    },
    generatePaymentLink: (data: any) => {
        return API.post('/parkings/generate-payment-link', data)
    },
    checkAvailability: (data: any) => {
        return API.post('/parkings/check-availability', data)
    }
}

export default ParkingAPI