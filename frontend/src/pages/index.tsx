import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Layout from "../components/Layout";
import Parkings from "./Parkings";
import Reservations from "./Reservations";
import VerifyReservation from "./VerifyReservation";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/parkings",
                element: <Parkings />,
            },
            {
                path: "/reservations",
                element: <Reservations />,
            },
            {
                path: "/verify-reservation",
                element: <VerifyReservation />,
            }
        ]
    },
]);

const Pages = () => <RouterProvider router={router} />;

export default Pages;