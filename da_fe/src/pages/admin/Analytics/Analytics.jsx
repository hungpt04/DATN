import React, { useState, useEffect } from 'react';
import StatCard from './ThongKe/StatCard';
import SalesChart from './ThongKe/SalesChart.js';
import SalesTable from './ThongKe/SalesTable.js';
import axios from 'axios';

function Analytic() {
    const [salesData, setSalesData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [successfulOrders, setSuccessfulOrders] = useState([]);
    const [timeRange, setTimeRange] = useState('month');

    const [statistics, setStatistics] = useState({
        today: {
            tongdoanhthu: 0,
            products: 0,
            successorders: 0,
            cancelorders: 0,
            returnorders: 0,
        },
        thisWeek: {
            tongdoanhthu: 0,
            products: 0,
            successorders: 0,
            cancelorders: 0,
            returnorders: 0,
        },
        thisMonth: {
            tongdoanhthu: 0,
            products: 0,
            successorders: 0,
            cancelorders: 0,
            returnorders: 0,
        },
        thisYear: {
            tongdoanhthu: 0,
            products: 0,
            successorders: 0,
            cancelorders: 0,
            returnorders: 0,
        },
    });

    useEffect(() => {
        // Lấy dữ liệu doanh số theo tháng
        const fetchMonthlySales = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/hoa-don/monthly-sales');
                setSalesData(response.data);

                // Tính tổng doanh thu và đơn hàng
                const revenue = response.data.reduce((acc, item) => acc + item.revenue, 0);
                const orders = response.data.reduce((acc, item) => acc + item.orders, 0);
                setTotalRevenue(revenue);
                setTotalOrders(orders);
            } catch (error) {
                console.error('Error fetching monthly sales:', error);
            }
        };

        // Lấy đơn hàng thành công
        const fetchSuccessfulOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/hoa-don/successful-orders');
                setSuccessfulOrders(response.data);
            } catch (error) {
                console.error('Error fetching successful orders:', error);
            }
        };

        // Lấy thống kê
        const fetchStatistics = async () => {
            try {
                const todayResponse = await axios.get('http://localhost:8080/api/statistics/today');
                const weekResponse = await axios.get('http://localhost:8080/api/statistics/week');
                const monthResponse = await axios.get('http://localhost:8080/api/statistics/month');
                const yearResponse = await axios.get('http://localhost:8080/api/statistics/year');

                setStatistics({
                    today: todayResponse.data,
                    thisWeek: weekResponse.data,
                    thisMonth: monthResponse.data,
                    thisYear: yearResponse.data,
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchMonthlySales();
        fetchSuccessfulOrders();
        fetchStatistics();
    }, []);

    // Render phần thống kê chi tiết
    const renderStatisticsSection = (title, data) => {

        // Định dạng doanh thu
        const formattedRevenue = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(data.tongdoanhthu);

        return (
            <div className="rounded-lg shadow-md flex flex-col justify-between">
                <h3 className="text-xl text-center mb-4 text-white">{title}</h3>
                <div className='text-center text-sm text-white'>
                    {formattedRevenue}
                </div>
                <div className="flex justify-center items-center space-x-4">
                    <StatCard
                        title="Sản phẩm"
                        value={data.products}
                        className="flex-1 min-w-[120px] p-2 text-sm"
                    />
                    <StatCard
                        title="Đơn thành công"
                        value={data.successorders}
                        className="flex-1 min-w-[120px] p-2 text-sm"
                    />
                    <StatCard
                        title="Đơn hủy"
                        value={data.cancelorders}
                        className="flex-1 min-w-[120px] p-2 text-sm"
                    />
                    <StatCard
                        title="Đơn trả"
                        value={data.returnorders}
                        className="flex-1 min-w-[120px] p-2 text-sm"
                    />
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 className="text-xs font-bold text-gray-800 mb-2">Thống kê</h1>
            <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="grid grid-rows-2 gap-6">
                    <div className='bg-cyan-700 rounded-md'>{renderStatisticsSection('Hôm nay', statistics.today)}</div>
                    <div className='bg-blue-600 rounded-md'>{renderStatisticsSection('Tháng này', statistics.thisMonth)}</div>
                </div>
                <div className="grid grid-rows-2 gap-6">
                    <div className='bg-orange-500 rounded-md'>{renderStatisticsSection('Tuần này', statistics.thisWeek)}</div>
                    <div className='bg-green-700 rounded-md'>{renderStatisticsSection('Năm nay', statistics.thisYear)}</div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Biểu Đồ Doanh Thu</h2>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="border rounded p-2">
                    <option value="week">Tuần</option>
                    <option value="month">Tháng</option>
                    <option value="quarter">Quý</option>
                    <option value="year">Năm</option>
                </select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">Biểu Đồ Doanh Thu</h2>
                <SalesChart salesData={salesData} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Chi Tiết Doanh Thu</h2>
                <SalesTable salesData={salesData} />
            </div>
        </div>
    );
}

export default Analytic;
