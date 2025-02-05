import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./layout";
import Dashboard from "./dashboard";
import Page from "./page";
import Test from "./test"

const USER_CONFIG = {
    title: "Users",
    singularTitle: "User",
    key: "users",
    acl: {
        add: false,
        edit: false,
        delete: true
    },
    fields: [
        { field: "avatar", title: "Avatar", type: 'image', required: true, modify: false, table: false },
        { field: "name", title: "Name", type: 'text', required: true, modify: true, table: true },
        { field: "email", title: "Email", type: 'email', required: true, modify: false, table: true },
        { field: "mobile", title: "Mobile", type: 'text', required: true, modify: false, table: true },
        { field: "status", title: "Status", type: 'string', required: true, modify: false, table: true },
        { field: "provider", title: "Provider", type: 'string', required: true, modify: false, table: true },
        { field: "created_at", title: "Created at", type: 'date', required: true, modify: false, table: true },
        { field: "last_login_ip", title: "Last login IP", type: 'string', required: true, modify: false, table: false },
        { field: "last_login_at", title: "Last login at", type: 'date', required: true, modify: false, table: false },
    ]
}

const PARKING_CONFIG = {
    title: "Parkings",
    singularTitle: "Parking",
    key: "parkings",
    acl: {
        add: true,
        edit: true,
        delete: true
    },
    fields: [
        { field: "title", title: "Title", type: 'text', required: true, modify: true, table: true },
        { field: "address", title: "Address", type: 'text', required: true, modify: true, table: false },
        { field: "lat", title: "Latitude", type: 'number', required: true, modify: true, table: true },
        { field: "lng", title: "Longitude", type: 'number', required: true, modify: true, table: true },
        { field: "id", title: "Spaces", type: 'link', link: '/parkings/id/spaces', required: true, modify: false, table: true },
        { field: "rating", title: "Rating", type: 'number', required: true, modify: true, table: true },
        { field: "reviews_count", title: "Reviews count", type: 'number', required: true, modify: true, table: true },
        { field: "thumbnail", title: "Thumbnail URL", type: 'image', required: true, modify: true, table: false },
        { field: "disabled_access", title: "Disabled access", type: 'boolean', required: true, modify: true, table: false },
        { field: "special_guard", title: "Special guard", type: 'boolean', required: true, modify: true, table: false },
        { field: "created_at", title: "Created at", type: 'date', required: true, modify: false, table: true },
    ]
}

const RESERVATION_CONFIG = {
    title: "Reservations",
    singularTitle: "Reservation",
    key: "reservations",
    acl: {
        add: false,
        edit: false,
        delete: false
    },
    fields: [
        { field: "price", title: "Price", type: 'text', required: true, modify: false, table: true },
        { field: "payment_id", title: "Payment ID", type: 'text', required: true, modify: false, table: true },
        { field: "payment_status", title: "Payment Status", type: 'text', required: true, modify: false, table: true },
        { field: "parking_title", title: "Parking", type: 'text', required: true, modify: false, table: true },
        { field: "space", title: "Space", type: 'text', required: true, modify: false, table: true },
        { field: "slot", title: "Slot", type: 'text', required: true, modify: false, table: true },
        { field: "checkin_time", title: "Check-in Time", type: 'date', required: true, modify: false, table: true },
        { field: "duration_in_hours", title: "Duration (hours)", type: 'text', required: true, modify: false, table: true },
        { field: "user_name", title: "User", type: 'text', required: true, modify: false, table: true },
        { field: "created_at", title: "Created at", type: 'date', required: true, modify: false, table: true },
    ]
}

const SPACE_CONFIG = {
    title: "Spaces",
    singularTitle: "Space",
    key: "parkings/:id/spaces",
    acl: {
        add: true,
        edit: true,
        delete: true
    },
    fields: [
        { field: "title", title: "Title", type: 'text', required: true, modify: true, table: true },
        { field: "price", title: "Price", type: 'number', required: true, modify: true, table: true },
        { field: "price_type", title: "Price type", type: 'enum', options: ["FIXED", "PER_HOUR"], required: true, modify: true, table: true },
        { field: "capacity", title: "Capacity", type: 'number', required: true, modify: false, table: true },
        { field: "floor_plan", title: "Floor plan", type: "floor-plan", required: true, modify: true, table: false },
        { field: "created_at", title: "Created at", type: 'date', required: true, modify: false, table: true },
    ]
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <AdminLayout />,
        children: [
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: '/users',
                element: <Page config={USER_CONFIG} key="users" />
            },
            {
                path: '/parkings',
                children: [
                    {
                        path: '',
                        element: <Page config={PARKING_CONFIG} key="parkings" />
                    },
                    {
                        path: ':id/spaces',
                        element: <Page config={SPACE_CONFIG} key="spaces" />
                    }
                ]
            },
            {
                path: '/reservations',
                element: <Page config={RESERVATION_CONFIG} key="reservations" />
            },
            {
                path: '/test',
                element: <Test />
            },
            {
                path: '*',
                element: <div className="hero min-h-[calc(100svh-76px)]">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <h1 className="text-5xl font-bold">404</h1>
                            <p className="py-6">
                                Hey! Got lost? Navigate back to home
                            </p>
                            <a href="/" className="btn btn-primary">Go to home</a>
                        </div>
                    </div>
                </div>
            }
        ]
    },
]);

const Admin = () => <RouterProvider router={router} />;

export default Admin;