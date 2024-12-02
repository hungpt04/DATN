import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

const SalesChart = ({ salesData }) => {
    const data = {
        labels: salesData.map((item) => item.month),
        datasets: [
            {
                label: 'Doanh thu (triệu VND)',
                data: salesData.map((item) => item.revenue),
                borderColor: '#3b82f6',
                backgroundColor: '#bfdbfe',
                fill: true,
            },
        ],
    };

    return <Line data={data} />;
};

export default SalesChart;
