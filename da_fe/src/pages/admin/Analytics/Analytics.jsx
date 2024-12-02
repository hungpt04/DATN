import React, { useState, useEffect } from 'react';
import { FaMoneyBill, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import StatCard from './ThongKe/StatCard';
import SalesChart from './ThongKe/SalesChart.js';
import SalesTable from './ThongKe/SalesTable.js.js';
import axios from 'axios';

function Analytic() {
    const [salesData, setSalesData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [successfulOrders, setSuccessfulOrders] = useState([]);

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

        fetchMonthlySales();
        fetchSuccessfulOrders();
    }, []);

    // Tính tỷ lệ tăng trưởng
    const calculateGrowthRate = () => {
        if (salesData.length < 2) return '0%';
        const currentMonth = salesData[salesData.length - 1].revenue;
        const previousMonth = salesData[salesData.length - 2].revenue;
        const growthRate = ((currentMonth - previousMonth) / previousMonth) * 100;
        return `${growthRate.toFixed(1)}%`;
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
