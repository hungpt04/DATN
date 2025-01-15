import React from 'react';

const SalesTable = ({ salesData }) => {
    return (
        <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
                <tr>
                    <th className="py-2 px-4 bg-gray-100">Tháng</th>
                    <th className="py-2 px-4 bg-gray-100">Số lượng đơn</th>
                    <th className="py-2 px-4 bg-gray-100">Doanh thu (triệu VND)</th>
                </tr>
            </thead>
            <tbody>
                {salesData.map((item, index) => (
                    <tr key={index} className="border-b">
                        <td className="py-2 px-4 text-center">{item.month}</td>
                        <td className="py-2 px-4 text-center">{item.orders}</td>
                        <td className="py-2 px-4 text-center">{item.revenue.toLocaleString('vi-VN')}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SalesTable;
