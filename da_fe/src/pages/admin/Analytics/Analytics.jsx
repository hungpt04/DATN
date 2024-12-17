import React, { useState, useEffect } from 'react';
import { FaMoneyBill, FaShoppingCart, FaChartLine, FaBox, FaCheckCircle, FaTimesCircle, FaUndo } from 'react-icons/fa';
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

    // Thêm state mới cho thống kê
    const [statistics, setStatistics] = useState({
        today: {
            products: 0,
            successOrders: 0,
            cancelOrders: 0,
            returnOrders: 0,
        },
        thisWeek: {
            products: 0,
            successOrders: 0,
            cancelOrders: 0,
            returnOrders: 0,
        },
        thisMonth: {
            products: 0,
            successOrders: 0,
            cancelOrders: 0,
            returnOrders: 0,
        },
        thisYear: {
            products: 0,
            successOrders: 0,
            cancelOrders: 0,
            returnOrders: 0,
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

                // Sử dụng mock data nếu gặp lỗi
                setStatistics({
                    today: {
                        products: 50,
                        successOrders: 20,
                        cancelOrders: 5,
                        returnOrders: 2,
                    },
                    thisWeek: {
                        products: 350,
                        successOrders: 150,
                        cancelOrders: 30,
                        returnOrders: 15,
                    },
                    thisMonth: {
                        products: 1500,
                        successOrders: 700,
                        cancelOrders: 120,
                        returnOrders: 50,
                    },
                    thisYear: {
                        products: 18000,
                        successOrders: 8500,
                        cancelOrders: 1500,
                        returnOrders: 600,
                    },
                });
            }
        };

        fetchMonthlySales();
        fetchSuccessfulOrders();
        fetchStatistics();
    }, []);

    // Tính tỷ lệ tăng trưởng
    const calculateGrowthRate = () => {
        if (salesData.length < 2) return '0%';
        const currentMonth = salesData[salesData.length - 1].revenue;
        const previousMonth = salesData[salesData.length - 2].revenue;
        const growthRate = ((currentMonth - previousMonth) / previousMonth) * 100;
        return `${growthRate.toFixed(1)}%`;
    };

    // Render phần thống kê chi tiết
    const renderStatisticsSection = (title, data) => {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
                <div className="grid grid-cols-2 gap-4">
                    <StatCard
                        title="Sản phẩm"
                        value={data.products}
                        icon={<FaBox className="text-blue-500" />}
                        className="flex-grow"
                    />
                    <StatCard
                        title="Đơn thành công"
                        value={data.successOrders}
                        icon={<FaCheckCircle className="text-green-500" />}
                        className="flex-grow"
                    />
                    <StatCard
                        title="Đơn hủy"
                        value={data.cancelOrders}
                        icon={<FaTimesCircle className="text-red-500" />}
                        className="flex-grow"
                    />
                    <StatCard
                        title="Đơn trả"
                        value={data.returnOrders}
                        icon={<FaUndo className="text-yellow-500" />}
                        className="flex-grow"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Thống Kê Doanh Số</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Tổng Doanh Thu"
                    value={`${(totalRevenue / 1000000).toFixed(2)} triệu VND`}
                    icon={<FaMoneyBill />}
                />
                <StatCard title="Tổng Đơn Hàng" value={totalOrders} icon={<FaShoppingCart />} />
                <StatCard title="Tăng Trưởng" value={calculateGrowthRate()} icon={<FaChartLine />} />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="grid grid-rows-2 gap-6">
                    <div>{renderStatisticsSection('Hôm nay', statistics.today)}</div>
                    <div>{renderStatisticsSection('Tuần này', statistics.thisWeek)}</div>
                </div>
                <div className="grid grid-rows-2 gap-6">
                    <div>{renderStatisticsSection('Tháng này', statistics.thisMonth)}</div>
                    <div>{renderStatisticsSection('Năm nay', statistics.thisYear)}</div>
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
