/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ParkingAPI from "../api/parking";
import { useUser } from "../contexts/use-user";
import { useAuthModal } from "../contexts/use-auth-modal";
import dayjs from "dayjs";
import ReservationAPI from "../api/reservation";
import { useToast } from "../contexts/use-toast";
import FloorPlanVizualizer from "../utils/floor-plan-vizualizer";
import { useNavigate } from "react-router-dom";

const Instamojo = (window as any).Instamojo;

const INITIAL_FLOOR_PLAN = { floor_plan: {}, booked_slots: [], slot: "" }

const Parkings = () => {
    const { user } = useUser()
    const { showToast } = useToast();
    const { showModal } = useAuthModal();
    const navigate = useNavigate();
    const modalRef = useRef<HTMLDialogElement>(null);
    const reserveRef = useRef<HTMLDialogElement>(null);
    const successRef = useRef<HTMLDialogElement>(null);
    const chooseSlotRef = useRef<HTMLDialogElement>(null);
    const navigationRef = useRef<HTMLDialogElement>(null);
    const [parkings, setParkings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [fetchingLocation, setFetchingLocation] = useState(true);
    const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
    const [mobileFilters, setMobileFilters] = useState({ radius: 10, disabled: false, special: false, search: "" });
    const [filters, setFilters] = useState({ radius: 10, disabled: false, special: false, search: "" });
    const [modalData, setModalData] = useState<any>({});
    const [formValues, setFormValues] = useState<any>({});
    const [reservationData, setReservationData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [availabilities, setAvailabilities] = useState<any>({});
    const [loadingAvailabilities, setLoadingAvailabilities] = useState(false);
    const [floorPlan, setFloorPlan] = useState(INITIAL_FLOOR_PLAN);

    useEffect(() => {
        const handlePopState = () => {
            reserveRef.current?.close();
            Instamojo.close();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        if (Object.keys(floorPlan?.floor_plan).length > 0) {
            navigationRef.current?.showModal();
        } else {
            navigationRef.current?.close();
        }
    }, [floorPlan, navigationRef])


    const selectedSpace = modalData.spaces?.find((space: any) => space.title === formValues.space);

    useEffect(() => {
        if (!modalData.id || !formValues.checkin_time || !formValues.duration) return;
        setLoadingAvailabilities(true);
        const timeout = setTimeout(() => {
            ParkingAPI.checkAvailability({ parking_id: modalData.id, checkin_time: formValues.checkin_time, duration_in_hours: formValues.duration }).then((res) => {
                setAvailabilities(res.data);
                setFormValues((prev: any) => ({ ...prev, slot: res.data?.[prev.space]?.auto_allocated_slot }));
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setLoadingAvailabilities(false);
            });
        }, 1000);

        return () => clearTimeout(timeout);
    }, [formValues.checkin_time, formValues.duration, modalData.id]);

    useEffect(() => {
        if (fetchingLocation) return;
        setLoading(true);
        const timeout = setTimeout(() => {
            ParkingAPI.list(location.lat, location.lng, filters.search, filters.radius, filters.disabled, filters.special).then((res) => {
                setParkings(res.data);
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setLoading(false);
            });
        }, 1000);

        return () => clearTimeout(timeout);
    }, [location, filters, fetchingLocation]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (geolocation) => {
            const lat = geolocation.coords.latitude, lng = geolocation.coords.longitude;
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const address = response.data.display_name;
            setLocation({ lat, lng, address });
            setFetchingLocation(false);
        }, () => {
            setFetchingLocation(false);
        });

        Instamojo.configure({
            handlers: {
                onOpen: () => {
                    navigate("/parkings?modalOpen=true", { state: { modalOpen: "true" } });
                    setGenerating(false);
                    reserveRef.current?.close();
                },
                onClose: () => {
                    Instamojo.close();
                },
                onSuccess: (response: any) => {
                    ReservationAPI.get(response.paymentId).then((res) => {
                        Instamojo.close();
                        setReservationData(res.data);
                        successRef.current?.showModal();
                    });
                },
                onFailure: (response: any) => {
                    console.log("Instamojo payment failed", response);
                    setErrors({ base: response.message });
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setMobileFilters(filters);
    }, [filters]);

    const handleReserve = (e: any) => {
        e.preventDefault();
        const currentDate = new Date();
        const checkin_time = formValues.checkin_time.split(':');
        currentDate.setHours(parseInt(checkin_time[0]));
        currentDate.setMinutes(parseInt(checkin_time[1]));
        currentDate.setSeconds(0);

        const data = {
            parking_id: modalData.id,
            space: formValues.space,
            slot: formValues.slot,
            duration_in_hours: formValues.duration,
            checkin_time: currentDate,
        };

        setGenerating(true);
        return ParkingAPI.generatePaymentLink(data).then((res) => {
            Instamojo.open(res.data.url);
        }).catch(() => {
            showToast("Failed to generate payment link", "error");
            setGenerating(false);
        });

    }

    const closeModal = () => {
        reserveRef.current?.close();
        setReservationData({});
        setErrors({});
        setFormValues({});
    }

    return (
        <div className="flex justify-start items-stretch h-full">
            <ul className="menu fixed top-[76px] h-full left-0 bg-base-200 text-base-content w-80 block max-md:hidden p-4">
                <li className="text-slate-500 mt-4">Search</li>
                <div className="mt-4 w-full">
                    <div className="form-control">
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="text"
                                className="grow"
                                placeholder="Where are you going?"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                    clipRule="evenodd" />
                            </svg>
                        </label>
                    </div>
                </div>
                <li className="text-slate-500 mt-4">Radius</li>
                <div className="mt-4 w-full">
                    <div className="form-control">
                        <input type="range" min={0} max={100} value={filters.radius} className="range" onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })} />
                    </div>
                    <div className="mt-4">{filters.radius} km</div>
                </div>
                <li className="text-slate-500 mt-8">Specifications</li>
                <div className="flex justify-start mt-2">
                    <div className="form-control">
                        <label className="label cursor-pointer flex space-x-2">
                            <input type="checkbox" className="checkbox" checked={filters.disabled} onChange={() => setFilters({ ...filters, disabled: !filters.disabled })} />
                            <span className="label-text">Disabled access</span>
                        </label>
                    </div>
                </div>
                <div className="flex justify-start mt-2">
                    <div className="form-control">
                        <label className="label cursor-pointer flex space-x-2">
                            <input type="checkbox" className="checkbox" checked={filters.special} onChange={() => setFilters({ ...filters, special: !filters.special })} />
                            <span className="label-text">Special guard</span>
                        </label>
                    </div>
                </div>
            </ul>
            <div className="w-full ml-80 max-md:ml-0">
                <div className="p-8 max-md:p-4">
                    {location.address ? <h2>Parking spots near <a className="link link-primary">{location.address}</a></h2> : <div>&nbsp;</div>}
                    {!fetchingLocation && <div className={`flex space-x-2 ${location.address ? "mt-8" : "-mt-8"}`}>
                        <button
                            className="btn btn-outline hidden max-md:block"
                            onClick={() => modalRef.current?.showModal()}
                        >
                            Filters
                        </button>
                        <div className="form-control w-full hidden max-md:block">
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <input
                                    type="text"
                                    className="w-full"
                                    placeholder="Where are you going?"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                        clipRule="evenodd" />
                                </svg>
                            </label>
                        </div>
                    </div>}
                    {loading ? <div className="mt-12 flex justify-center items-center">
                        <span className="loading loading-dots loading-lg" />
                    </div> : <div className="mt-8">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {parkings.map((parking) => (
                                <div className="card bordered" key={parking.id}>
                                    <figure>
                                        <img src={parking.thumbnail} className="h-60 w-full object-cover" alt="Thumbnail" />
                                    </figure>
                                    <div className="card-body flex flex-col justify-between items-stretch w-full">
                                        <div>
                                            <h2 className="card-title">{parking.title}</h2>
                                            <div>{parking.address}</div>
                                        </div>
                                        <div className="w-full">
                                            <div className="flex w-full">
                                                <div className="">
                                                    <div className="stat-title">Distance</div>
                                                    <div className="stat-value text-lg">{parking.distance || "-"}</div>
                                                    <div className="stat-desc">{parking.duration}</div>
                                                </div>
                                                <div className="divider divider-horizontal" />
                                                <div className="">
                                                    <div className="stat-title">Price</div>
                                                    <div className="stat-value text-lg">₹{Math.min(...parking.spaces.map((x: any) => x.price))} {Math.min(...parking.spaces.map((x: any) => x.price)) === Math.max(...parking.spaces.map((x: any) => x.price)) ? "" : ` - ₹${Math.max(...parking.spaces.map((x: any) => x.price))}`}</div>
                                                    <div className="stat-desc">{parking.price_type?.toLowerCase()?.replace('_', ' ')}</div>
                                                </div>
                                                <div className="divider divider-horizontal" />
                                                <div className="">
                                                    <div className="stat-title">Rating</div>
                                                    <div className="stat-value text-lg">{parking.rating} / 5</div>
                                                    <div className="stat-desc">{parking.reviews_count} reviews</div>
                                                </div>
                                            </div>
                                            {parking.disabled_access && <div className="mt-4">
                                                <span className="iconify mingcute--disabled-2-line" /> <span>Disabled access</span>
                                            </div>}
                                            {parking.special_guard && <div className="mt-4">
                                                <span className="iconify mingcute--user-1-line" /> <span>Special guard</span>
                                            </div>}
                                        </div>
                                        <button
                                            className="btn btn-primary mt-4 w-full"
                                            onClick={() => {
                                                if (!user) {
                                                    showModal();
                                                    return;
                                                }
                                                setModalData(parking);
                                                setFormValues({ duration: 2, space: parking.spaces[0].title, checkin_time: dayjs().format("HH:mm") });
                                                reserveRef.current?.showModal();
                                            }}
                                        >
                                            Reserve
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {parkings.length === 0 && <div className="h-48 w-full flex justify-center items-center">
                            No parkings to show!
                        </div>}
                    </div>}
                </div>
            </div>
            <dialog ref={modalRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <ul className="menu">
                        <li className="text-slate-500 mt-4">Radius</li>
                        <div className="mt-4 w-full">
                            <div className="form-control">
                                <input type="range" min={0} max={100} value={mobileFilters.radius} className="range" onChange={(e) => setMobileFilters({ ...mobileFilters, radius: parseInt(e.target.value) })} />
                            </div>
                            <div className="mt-4">{mobileFilters.radius} km</div>
                        </div>
                        <li className="text-slate-500 mt-8">Specifications</li>
                        <div className="flex justify-start mt-2">
                            <div className="form-control">
                                <label className="label cursor-pointer flex space-x-2">
                                    <input type="checkbox" className="checkbox" checked={mobileFilters.disabled} onChange={() => setMobileFilters({ ...mobileFilters, disabled: !mobileFilters.disabled })} />
                                    <span className="label-text">Disabled access</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-start mt-2">
                            <div className="form-control">
                                <label className="label cursor-pointer flex space-x-2">
                                    <input type="checkbox" className="checkbox" checked={mobileFilters.special} onChange={() => setMobileFilters({ ...mobileFilters, special: !mobileFilters.special })} />
                                    <span className="label-text">Special guard</span>
                                </label>
                            </div>
                        </div>
                    </ul>
                    <button
                        className="btn btn-primary mt-4 w-full"
                        onClick={() => {
                            setFilters(mobileFilters)
                            modalRef.current?.close()
                        }}>
                        Apply
                    </button>
                </div>
            </dialog>
            <dialog ref={reserveRef} className="modal z-10">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Reserve {modalData.title}</h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-5" onClick={closeModal}>✕</button>
                    </form>
                    <div className="divider"></div>
                    <form className="space-y-2" onSubmit={handleReserve}>
                        <div>
                            <label className="label">
                                <span className="label-text">Preferred parking space</span>
                            </label>
                            <div className="join">
                                {(modalData.spaces || []).map((space: { title: string, available: number }) => <div className="form-control" key={space.title}>
                                    <input
                                        type="radio"
                                        name="space"
                                        value={space.title}
                                        aria-label={space.title}
                                        className="join-item btn"
                                        checked={space.title === formValues.space}
                                        onChange={(e: any) => setFormValues((prev: any) => ({ ...prev, space: e.target.value }))}
                                    />
                                </div>)}
                            </div>
                        </div>
                        {loadingAvailabilities ? <span className="iconify mingcute--loading-fill animate-spin" /> : <>
                            <div className="mt-2">
                                {formValues?.slot === availabilities[formValues.space]?.auto_allocated_slot ? `Auto allocated slot: ${availabilities[formValues.space] ? availabilities[formValues.space].auto_allocated_slot : "-"}` : `Selected slot: ${formValues.slot}`}
                                {availabilities[formValues.space] && <button type="button" className="btn btn-outline btn-sm ml-2 max-sm:ml-0 max-sm:my-2" onClick={() => chooseSlotRef.current?.showModal()}>Choose your slot</button>}
                                <div>Available slots: {availabilities[formValues.space] ? availabilities[formValues.space].count : "-"}</div>
                            </div>
                        </>}
                        <div>
                            <label className="label">
                                <span className="label-text">Duration</span>
                            </label>
                            <div className="font-semibold m-2 mt-0">{formValues.duration} hours</div>
                            <input
                                value={formValues.duration}
                                min={1}
                                max={8}
                                onChange={(e) => {
                                    let value = parseInt(e.target.value);
                                    if (value < 1) value = 1;
                                    if (value > 8) value = 8;
                                    setFormValues((prev: any) => ({ ...prev, duration: value }));
                                }}
                                type="range"
                                className="range"
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Check-in time</span>
                            </label>
                            <input
                                type="time"
                                name="checkin_time"
                                value={formValues.checkin_time ? formValues.checkin_time : dayjs().format("HH:mm")}
                                onChange={(e) => setFormValues((prev: any) => ({ ...prev, checkin_time: e.target.value }))}
                                placeholder="Enter the check-in time"
                                className={`input input-bordered w-full mb-4 "input-error" : ""}`}
                            />
                        </div>
                        <div className="divider"></div>
                        <div className="font-semibold">Total price: ₹{selectedSpace?.price_type === "FIXED" ? selectedSpace?.price : (selectedSpace?.price * formValues.duration)}</div>
                        {errors.base && <div className="alert alert-error mt-2 mb-4 text-sm flex flex-col items-start">{errors.base}</div>}
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary w-full" disabled={generating || loadingAvailabilities}>
                                {(generating) && <span className="text-xl iconify mingcute--loading-fill animate-spin mr-2"></span>}
                                <span>Continue</span>
                            </button>
                        </div>
                    </form>
                </div>
            </dialog >
            <dialog ref={successRef} className="modal z-10">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Reservation successful</h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-5" onClick={closeModal}>✕</button>
                    </form>
                    <div className="divider"></div>
                    <div className="flex flex-col justify-center items-center">
                        <img src={reservationData.qr_code} alt="QR Code" className="h-56 w-5h-56 rounded object-cover" />
                        <div className="space-y-2 w-full mt-4">
                            <div className="font-semibold">Reservation ID: {reservationData.id}</div>
                            <div className="font-semibold">Parking: {modalData.title}</div>
                            <div className="font-semibold">Slot: {reservationData.space}, {reservationData.slot}</div>
                            <div className="font-semibold">Check-in time: {dayjs(reservationData.checkin_time).format("DD MMM, YYYY h:mm A")}</div>
                            <div className="font-semibold">Duration: {reservationData.duration_in_hours} hours</div>
                            <div className="font-semibold">Total price: ₹{reservationData.price}</div>
                            <div className="font-semibold">
                                <div className="flex space-x-4 mt-2 pr-4">
                                    <a className="btn btn-outline w-1/2" target="_blank" href={`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${modalData?.lat},${modalData?.lng}`}>Navigate to parking</a>
                                    <button className="btn btn-outline w-1/2" onClick={() => {
                                        ReservationAPI.navigate(reservationData.id).then((res) => {
                                            setFloorPlan(res.data);
                                        });
                                    }}>
                                        Navigate to my slot
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-primary w-full" onClick={() => successRef.current?.close()}>Close</button>
                    </div>
                </div>
            </dialog>
            <dialog ref={chooseSlotRef} className="modal z-20">
                <div className="modal-box max-w-none w-1/2 max-md:w-[90%]">
                    <h3 className="font-bold text-lg">Choose your slot</h3>
                    <div className="divider"></div>
                    <div className="flex flex-col justify-center items-center">
                        {selectedSpace?.floor_plan && <FloorPlanVizualizer
                            plan={selectedSpace.floor_plan}
                            width={{ md: 300, lg: 600 }}
                            current={formValues?.slot}
                            booked={availabilities[formValues.space]?.booked_slots}
                            onSelect={(slot: string) => setFormValues((prev: any) => ({ ...prev, slot }))}
                        />}
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-primary w-full" onClick={() => chooseSlotRef.current?.close()}>Save</button>
                    </div>
                </div>
            </dialog>
            <dialog ref={navigationRef} className="modal z-30">
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
        </div >
    );
}

export default Parkings;