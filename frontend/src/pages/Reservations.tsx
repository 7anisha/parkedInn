/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRef, useEffect, useState } from "react";
import ReservationAPI from "../api/reservation";
import { useUser } from "../contexts/use-user";
import { useAuthModal } from "../contexts/use-auth-modal";
import dayjs from "dayjs";
import FloorPlanVizualizer from "../utils/floor-plan-vizualizer";

const ReservationRender = ({ reservation, setSelectedReservation, setFloorPlan, tag }: any) => {
    const checkinTime = dayjs(reservation.checkin_time)
    const checkoutTime = dayjs(reservation.checkin_time).add(reservation.duration_in_hours, 'hours')
    return <div className="card bordered md:card-side w-full bg-base-200 mb-4">
        <figure>
            <img
                src={reservation.parking.thumbnail}
                className="md:h-full md:w-60 md:object-cover"
                alt="Album" />
        </figure>
        <div className="card-body">
            <h2 className="card-title">{reservation.parking.title}</h2>
            <p>Space - {reservation.space}, {reservation.slot}</p>
            <p>{checkinTime.format("DD MMM, YYYY h:mm A")} - {checkoutTime.format(checkinTime.isSame(checkoutTime, "day") ? "h:mm A" : "DD MMM, YYYY h:mm A")}</p>
            <p>Price - ₹{reservation.price}</p>
            <div className="flex space-x-4 max-md:flex-col max-md:space-x-0 max-md:space-y-2">
                <button className="btn btn-primary w-fit max-md:w-full" onClick={() => setSelectedReservation({ ...reservation, tag })}>View</button>
                {tag === "past" || <>
                    <a className="btn btn-outline" target="_blank" href={`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${reservation?.lat},${reservation?.lng}`}>Navigate to parking</a>
                    <button className="btn btn-outline" onClick={() => {
                        ReservationAPI.navigate(reservation.id).then((res) => {
                            setFloorPlan(res.data);
                        });
                    }}>
                        Navigate to my slot
                    </button>
                </>}
            </div>
        </div>
    </div>
}

const INITIAL_FLOOR_PLAN = { floor_plan: {}, booked_slots: [], slot: "" }

const Reservations = () => {
    const { user } = useUser();
    const { showModal } = useAuthModal();
    const reserveRef = createRef<HTMLDialogElement>();
    const navigationRef = createRef<HTMLDialogElement>();
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<any>({ active: [], upcoming: [], past: [] });
    const [selectedReservation, setSelectedReservation] = useState<any>({});
    const [floorPlan, setFloorPlan] = useState(INITIAL_FLOOR_PLAN);

    useEffect(() => {
        if (Object.keys(floorPlan?.floor_plan).length > 0) {
            navigationRef.current?.showModal();
        } else {
            navigationRef.current?.close();
        }
    }, [floorPlan, navigationRef])

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            if (!user) {
                showModal()
                setLoading(false)
            } else {
                ReservationAPI.list()
                    .then(response => setReservations(response.data))
                    .catch(() => setReservations({ active: [], upcoming: [], past: [] }))
                    .finally(() => setLoading(false))
            }
        }, 100)
    }, [user, showModal]);

    useEffect(() => {
        if (selectedReservation.id) {
            reserveRef.current?.showModal();
        }
    }, [selectedReservation, reserveRef])

    const closeModal = () => {
        reserveRef.current?.close();
        setSelectedReservation({});
    }

    return <div>
        <div className="hero bg-base-200 py-8">
            <div className="hero-content text-center">
                <div className="max-w-2xl">
                    <h1 className="text-3xl font-bold">My reservations</h1>
                </div>
            </div>
        </div>
        <div className="px-4">
            {reservations.active.length ? <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">Active reservations</h2>
                {(reservations.active || []).map((reservation: any) => <ReservationRender key={reservation.id} reservation={reservation} setFloorPlan={setFloorPlan} setSelectedReservation={setSelectedReservation} tag="active" />)}
            </div> : null}
            {reservations.upcoming.length ? <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">Upcoming reservations</h2>
                {(reservations.upcoming || []).map((reservation: any) => <ReservationRender key={reservation.id} reservation={reservation} setFloorPlan={setFloorPlan} setSelectedReservation={setSelectedReservation} tag="upcoming" />)}
            </div> : null}
            {reservations.past.length ? <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">Past reservations</h2>
                {(reservations.past || []).map((reservation: any) => <ReservationRender key={reservation.id} reservation={reservation} setFloorPlan={setFloorPlan} setSelectedReservation={setSelectedReservation} tag="past" />)}
            </div> : null}
        </div>
        {loading ? <div className="mt-12 flex justify-center items-center">
            <span className="loading loading-dots loading-lg" />
        </div> : (!reservations.active.length && !reservations.upcoming.length && !reservations.past.length ? <div className="w-full mt-16">
            <h1 className="text-xl text-center">No reservations found</h1>
        </div> : null)}
        <dialog ref={reserveRef} className="modal z-10">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Reservation</h3>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-5" onClick={closeModal}>✕</button>
                </form>
                <div className="divider"></div>
                <div className="flex flex-col justify-center items-center">
                    <img src={selectedReservation.qr_code} alt="QR Code" className="h-60 w-60 rounded object-cover" />
                    <div className="space-y-2 w-full mt-4">
                        <div className="font-semibold">Reservation ID: {selectedReservation.id}</div>
                        <div className="font-semibold">Parking space: {selectedReservation.space}</div>
                        <div className="font-semibold">Check-in time: {dayjs(selectedReservation.checkin_time).format("DD MMM, YYYY h:mm A")}</div>
                        <div className="font-semibold">Duration: {selectedReservation.duration_in_hours} hours</div>
                        <div className="font-semibold">Total price: ₹{selectedReservation.price}</div>
                        <div className="font-semibold">Directions: <a className="link link-primary" target="_blank" href={`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${selectedReservation?.parking?.lat},${selectedReservation?.parking?.lng}`}>Navigate</a></div>
                    </div>
                </div>
                <div className="modal-action">
                    <button className="btn btn-primary w-full" onClick={closeModal}>Close</button>
                </div>
            </div>
        </dialog>
        <dialog ref={navigationRef} className="modal z-20">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Navigate to my slot</h3>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-5" onClick={() => setFloorPlan(INITIAL_FLOOR_PLAN)}>✕</button>
                </form>
                <div className="divider"></div>
                {floorPlan?.floor_plan && <FloorPlanVizualizer
                    plan={floorPlan?.floor_plan}
                    booked={floorPlan?.booked_slots}
                    current={floorPlan?.slot}
                    width={{ md: 200, lg: 450 }}
                />}
                <div className="modal-action">
                    <button className="btn btn-primary w-full" onClick={() => setFloorPlan(INITIAL_FLOOR_PLAN)}>Close</button>
                </div>
            </div>
        </dialog>
    </div>
}

export default Reservations