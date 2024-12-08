import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Trích xuất thông tin từ query params
        const searchParams = new URLSearchParams(location.search);
        const billId = searchParams.get('vnp_TxnRef');
        const amount = searchParams.get('vnp_Amount');
        const responseCode = searchParams.get('vnp_ResponseCode');

        const fetchOrderDetails = async () => {
            try {
                // Gọi API để lấy chi tiết đơn hàng
                const response = await axios.get(`http://localhost:8080/api/hoa-don/${billId}`);
                setOrderDetails(response.data);
            } catch (error) {
                console.error('Lỗi tải thông tin đơn hàng:', error);
            }
        };

        // Chỉ fetch nếu thanh toán thành công
        if (responseCode === '00' && billId) {
            fetchOrderDetails();
        }
    }, [location]);

    const handleBackToHome = () => {
        navigate('/');
    };

    // Format số tiền
    const formatCurrency = (amount) => {
        // Đối với VNPay, amount được gửi ở đơn vị xu (VD: 550000000 = 5,500,000 VND)
        const formattedAmount = amount ? (parseInt(amount) / 100).toLocaleString() : '0';
        return `${formattedAmount} ₫`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                <div className="mb-6">
                    <svg
                        className="mx-auto h-16 w-16 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">Đặt Hàng Thành Công</h2>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-2">
                        Giá trị đơn hàng:
                        <span className="font-bold text-green-600 ml-2">
                            {formatCurrency(location.search.match(/vnp_Amount=(\d+)/)?.[1])}
                        </span>
                    </p>
                    <p className="text-gray-600 mb-2">
                        Mã đơn hàng:
                        <span className="font-bold ml-2">{location.search.match(/vnp_TxnRef=(\d+)/)?.[1]}</span>
                    </p>
                </div>

                <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã đặt hàng tại cửa hàng chúng tôi. Đơn hàng của bạn đang được xử lý.
                </p>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBackToHome}
                    sx={{
                        backgroundColor: '#2f19ae',
                        '&:hover': { backgroundColor: '#1f0c73' },
                    }}
                >
                    Quay về trang chủ
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
