/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ReservationAPI from "../api/reservation";
import dayjs from "dayjs";

const VerifyReservation = () => {
    const [reservation, setReservation] = useState<any>({});
    const [error, setError] = useState<string>("");
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') || "";

    useEffect(() => {
        ReservationAPI.verify(token).then((res) => {
            setReservation(res.data);
        }).catch((err) => {
            console.error(err);
            setError(err.data.message || "Invalid token");
        });
    }, [token]);

    return (<div>
        <div className="hero bg-base-200 py-8">
            <div className="hero-content text-center">
                <div className="max-w-2xl">
                    <h1 className="text-3xl font-bold">Reservation</h1>
                </div>
            </div>
        </div>
        {error ? <div className="w-full mt-16">
            <h1 className="text-xl text-center">{error}</h1>
        </div> : null}
        <div className="flex flex-col justify-center items-center">
            <div className="space-y-2 max-md:w-full w-1/2 px-4 mt-4">
                <div className="font-semibold">Reservation ID: {reservation.id}</div>
                <div className="font-semibold">Parking: {reservation.parking?.title}</div>
                <div className="font-semibold">Space: {reservation.space}</div>
                <div className="font-semibold">Check-in time: {dayjs(reservation.checkin_time).format("DD MMM, YYYY h:mm A")}</div>
                <div className="font-semibold">Duration: {reservation.duration_in_hours} hours</div>
                <div className="font-semibold">Total price: ₹{reservation.price}</div>
            </div>
        </div>
    </div>
    );
}

export default VerifyReservation;