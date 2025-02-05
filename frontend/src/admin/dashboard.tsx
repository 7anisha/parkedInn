/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminAPI from "../api/admin";
import dayjs from "dayjs";

const Dashboard = () => {
    const [date, setDate] = useState('today');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({});

    useEffect(() => {
        let startDate, endDate;
        switch (date) {
            case 'today':
                startDate = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
                endDate = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'yesterday':
                startDate = dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
                endDate = dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'this_week':
                startDate = dayjs().startOf('week').format('YYYY-MM-DD HH:mm:ss');
                endDate = dayjs().endOf('week').format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'last_week':
                startDate = dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD HH:mm:ss');
                endDate = dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'this_month':
                startDate = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
                endDate = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'last_month':
                startDate = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss');
                endDate = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss');
                break;
            default:
                startDate = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
                endDate = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
                break;
        }
        AdminAPI.dashboard(startDate, endDate).then(response => {
            setData(response.data)
        }).finally(() => {
            setLoading(false);
        });
    }, [date]);

    if (loading) return <div className="relative h-40">
        <span className="loading loading-dots loading-lg absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
    </div>

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <select className="select" value={date} onChange={(e) => setDate(e.target.value)}>
                    <option disabled selected>Select duration</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="this_week">This week</option>
                    <option value="last_week">Last week</option>
                    <option value="this_month">This month</option>
                    <option value="last_month">Last month</option>
                </select>
            </div>
            <div className="stats max-md:stats-vertical max-md:w-full shadow mt-4">
                <div className="stat">
                    <div className="stat-title">Revenue</div>
                    <div className="stat-value">
                        {data.revenue}
                    </div>
                    <div className="stat-desc"><span className="text-success">↗︎ 22%</span> from yesterday</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Reservations</div>
                    <div className="stat-value">
                        {data.reservations}
                    </div>
                    <div className="stat-desc"><span className="text-success">↗︎ 22%</span> from last week</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Average reservation price</div>
                    <div className="stat-value">
                        {data.average_reservation_price}
                    </div>
                    <div className="stat-desc"><span className="text-success">↗︎ 22%</span> from last week</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Average reservation duration</div>
                    <div className="stat-value">
                        {data.average_reservation_duration}
                    </div>
                    <div className="stat-desc">Hours</div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;