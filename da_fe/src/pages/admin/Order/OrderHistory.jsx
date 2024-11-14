import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';
import axios from 'axios';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import swal from 'sweetalert';

const OrderHistory = () => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [customerMoney, setCustomerMoney] = useState(0);
    const [transactionCode, setTransactionCode] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentHistory, setPaymentHistory] = useState([]);

    const { order } = location.state || {};
    const [totalAmount, setTotalAmount] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [currentOrder, setCurrentOrder] = useState(order);
    const [paymentMethod, setPaymentMethod] = useState('chuyen-khoan'); // Thêm state cho phương thức thanh toán
    const [events, setEvents] = useState([]);
    const [billDetails, setBillDetails] = useState([]);

    useEffect(() => {
        const calculateTotal = () => {
            const uniqueProductIds = new Set();
            const uniqueDetails = billDetails.filter((detail) => {
                if (detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === currentOrder.id) {
                    const isUnique = !uniqueProductIds.has(detail.hoaDonCT.sanPhamCT.id);
                    if (isUnique) {
                        uniqueProductIds.add(detail.hoaDonCT.sanPhamCT.id);
                        return true;
                    }
                }
                return false;
            });

            const totalItems = uniqueDetails.reduce((total, detail) => {
                return total + detail.hoaDonCT.soLuong * detail.hoaDonCT.giaBan;
            }, 0);

            const total = totalItems + shippingFee;
            setTotalAmount(total);
        };

        calculateTotal();
    }, [billDetails, shippingFee, currentOrder]);

    useEffect(() => {
        const loadPaymentHistory = async (hoaDonId) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/thanh-toan/hoa-don/${hoaDonId}`);
                console.log('Payment history response:', response.data); // Log dữ liệu nhận được
                // Kiểm tra xem response.data có phải là mảng hay không
                if (Array.isArray(response.data)) {
                    setPaymentHistory(response.data);
                } else {
                    // Nếu không phải là mảng, bạn có thể lưu trữ đối tượng đó trong mảng
                    setPaymentHistory([response.data]);
                }
            } catch (error) {
                console.error('Failed to fetch payment history', error);
            }
        };

        if (currentOrder && currentOrder.id) {
            loadPaymentHistory(currentOrder.id);
        }
    }, [currentOrder]);

    useEffect(() => {
        if (currentOrder && currentOrder.id) {
            const loadBillDetailsWithImages = async (hoaDonId) => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/hoa-don-ct/with-images/${hoaDonId}`);
                    setBillDetails(response.data);
                } catch (error) {
                    console.error('Failed to fetch BillDetails with images', error);
                }
            };

            loadBillDetailsWithImages(currentOrder.id);
        }
    }, [currentOrder]);

    console.log(paymentHistory);

    const handleOpenModal = () => {
        setPaymentAmount(totalAmount);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSavePayment = async () => {
        const paymentData = {
            taiKhoan: { id: 1 }, // Thay đổi id này nếu cần
            hoaDon: { id: currentOrder.id },
            ma: null,
            tongTien: totalAmount,
            phuongThucThanhToan: paymentMethod === 'chuyen-khoan' ? 'Chuyển khoản' : 'Tiền mặt', // Sử dụng giá trị từ state
            ngayTao: new Date(),
            trangThai: 1,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/thanh-toan', paymentData);
            swal('Thành công!', 'Thanh toán đã được lưu!', 'success');

            // Cập nhật paymentHistory ngay lập tức
            setPaymentHistory((prevHistory) => [
                ...prevHistory,
                {
                    ...paymentData,
                    id: response.data.id, // Giả sử API trả về id của thanh toán vừa tạo
                    ngayTao: new Date().toISOString(), // Cập nhật thời gian tạo
                },
            ]);

            // Cập nhật trạng thái hóa đơn
            const updatedOrder = { ...currentOrder, trangThai: 5 }; // 5 là trạng thái "Đã thanh toán"
            setCurrentOrder(updatedOrder);

            // Cập nhật sự kiện
            handleConfirmPayment();

            handleCloseModal(); // Đóng modal
        } catch (error) {
            console.error('Có lỗi xảy ra khi lưu thanh toán!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi lưu thanh toán!', 'error');
        }
    };

    const getButtonLabel = (status) => {
        switch (status) {
            case 1:
                return 'Xác nhận đơn hàng';
            case 2:
                return 'Xác nhận giao hàng';
            case 3:
                return 'Xác nhận lấy hàng';
            case 4:
                return 'Thanh toán';
            case 5:
                return 'Hoàn thành';
            case 6:
                return 'Đơn hàng đã hoàn thành';
            case 8:
                return 'Đơn hàng đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 1:
                return { label: 'Chờ xác nhận', color: '#ebd534' };
            case 2:
                return { label: 'Chờ giao hàng', color: '#34e5eb' };
            case 3:
                return { label: 'Đang vận chuyển', color: '#345feb' };
            case 4:
                return { label: 'Đã giao hàng', color: '#e342f5' };
            case 5:
                return { label: 'Đã thanh toán', color: '#42f5e0' };
            case 6:
                return { label: 'Chờ thanh toán', color: '#f58d42' };
            case 7:
                return { label: 'Hoàn thành', color: '#4caf50' };
            case 8:
                return { label: 'Đã hủy', color: '#f5425d' };
            default:
                return { label: 'Không xác định', color: 'bg-gray-200 text-gray-800' };
        }
    };

    const getStatusLabelTT = (status) => {
        switch (status) {
            case 1:
                return { label: 'Đã thanh toán', color: '#ebd534' };
            default:
                return { label: 'Không xác định', color: 'bg-gray-200 text-gray-800' };
        }
    };

    const addOrderHistory = async (description, status) => {
        const historyData = {
            taiKhoan: { id: 1 }, // ID tài khoản (nếu có)
            hoaDon: { id: currentOrder.id, trangThai: status }, // ID hóa đơn
            moTa: description, // Mô tả trạng thái
            ngayTao: new Date(), // Ngày tạo
            trangThai: status, // Trạng thái mới
        };

        try {
            await axios.post('http://localhost:8080/api/lich-su-don-hang', historyData);
        } catch (error) {
            console.error('Failed to add order history', error);
        }
    };

    const handleDeleteDetail = async (detailId) => {
        try {
            await axios.delete(`http://localhost:8080/api/hoa-don-ct/${detailId}`);
            setBillDetails((prevDetails) => prevDetails.filter((detail) => detail.hoaDonCT.id !== detailId));
            swal('Thành công!', 'Chi tiết hóa đơn đã được xóa!', 'success');
        } catch (error) {
            console.error('Có lỗi xảy ra khi xóa chi tiết hóa đơn!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi xóa chi tiết hóa đơn!', 'error');
        }
    };

    const decreaseQuantity = async (detail) => {
        const currentQuantity = detail.hoaDonCT.soLuong;

        if (currentQuantity <= 1) {
            swal('Thất bại!', 'Số lượng phải lớn hơn 1!', 'warning');
            return;
        }

        const updatedDetail = {
            ...detail.hoaDonCT,
            soLuong: currentQuantity - 1,
        };

        try {
            await axios.put(`http://localhost:8080/api/hoa-don-ct/${detail.hoaDonCT.id}`, updatedDetail);
            setBillDetails((prevDetails) =>
                prevDetails.map((d) => (d.hoaDonCT.id === detail.hoaDonCT.id ? { ...d, hoaDonCT: updatedDetail } : d)),
            );
        } catch (error) {
            console.error('Có lỗi xảy ra khi giảm số lượng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi giảm số lượng!', 'error');
        }
    };

    const increaseQuantity = async (detail) => {
        const updatedDetail = {
            ...detail.hoaDonCT,
            soLuong: detail.hoaDonCT.soLuong + 1,
        };

        try {
            await axios.put(`http://localhost:8080/api/hoa-don-ct/${detail.hoaDonCT.id}`, updatedDetail);
            setBillDetails((prevDetails) =>
                prevDetails.map((d) => (d.hoaDonCT.id === detail.hoaDonCT.id ? { ...d, hoaDonCT: updatedDetail } : d)),
            );
        } catch (error) {
            console.error('Có lỗi xảy ra khi tăng số lượng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi tăng số lượng!', 'error');
        }
    };

    const updateBillStatus = async (hoaDonId, status) => {
        try {
            const response = await fetch(`http://localhost:8080/api/hoa-don/update-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hoaDonId, status }), // Đảm bảo rằng bạn đang gửi ID đúng
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating bill status:', error);
            return null;
        }
    };

    const handleConfirmOrder = async () => {
        const result = await updateBillStatus(currentOrder.id, 2);
        if (result) {
            setCurrentOrder((prevOrder) => ({ ...prevOrder, trangThai: 2 }));
            await addOrderHistory('Chờ giao hàng', 2); // Thêm lịch sử
            setEvents((prevEvents) => [
                ...prevEvents,
                { title: 'Chờ giao hàng', subtitle: new Date().toLocaleString(), color: '#ebd534' },
            ]);
            swal('Thành công!', 'Chờ giao hàng!', 'success');
        }
    };

    const handleCancelOrder = async () => {
        const result = await updateBillStatus(currentOrder.id, 8);
        await addOrderHistory('Đã hủy', 8); // Thêm lịch sử
        if (result) {
            setCurrentOrder((prevOrder) => ({ ...prevOrder, trangThai: 8 }));
            setEvents((prevEvents) => [
                ...prevEvents,
                { title: 'Đơn hàng đã bị hủy', subtitle: new Date().toLocaleString(), color: '#eb3a34' },
            ]);
            swal('Thành công!', 'Đơn hàng đã được hủy!', 'success');
        }
    };

    const handleConfirmShipping = async () => {
        const result = await updateBillStatus(currentOrder.id, 3);
        if (result) {
            setCurrentOrder((prevOrder) => ({ ...prevOrder, trangThai: 3 }));
            await addOrderHistory('Đang vận chuyển', 3); // Thêm lịch sử
            setEvents((prevEvents) => [
                ...prevEvents,
                { title: 'Đang vận chuyển', subtitle: new Date().toLocaleString(), color: '#34e5eb' },
            ]);
            swal('Thành công!', 'Đơn hàng đang được vận chuyển!', 'success');
        }
    };

    useEffect(() => {
        // Kiểm tra localStorage để lấy trạng thái đơn hàng
        const storedOrder = localStorage.getItem('currentOrder');
        if (storedOrder) {
            setCurrentOrder(JSON.parse(storedOrder));
        } else {
            setCurrentOrder(order);
        }
    }, [order]);

    useEffect(() => {
        // Lưu trạng thái đơn hàng vào localStorage khi nó thay đổi
        if (currentOrder) {
            localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        }
    }, [currentOrder]);

    const handleConfirmDelivery = async () => {
        const result = await updateBillStatus(currentOrder.id, 4);
        if (result) {
            setCurrentOrder((prevOrder) => ({ ...prevOrder, trangThai: 4 }));
            await addOrderHistory('Đã giao hàng', 4); // Thêm lịch sử
            setEvents((prevEvents) => [
                ...prevEvents,
                { title: 'Đã giao hàng', subtitle: new Date().toLocaleString(), color: '#345feb' },
            ]);
            swal('Thành công!', 'Đơn hàng đã được giao!', 'success');
        }
    };

    const handleConfirmPayment = async () => {
        const result = await updateBillStatus(currentOrder.id, 5);
        if (result) {
            setCurrentOrder((prevOrder) => ({ ...prevOrder, trangThai: 5 }));
            await addOrderHistory('Đã thanh toán', 5); // Thêm lịch sử
            setEvents((prevEvents) => [
                ...prevEvents,
                { title: 'Đã thanh toán', subtitle: new Date().toLocaleString(), color: '#ba34eb' },
            ]);
            swal('Thành công!', 'Đơn hàng đã được thanh toán!', 'success');
        }
    };

    const handleConfirmComplete = async () => {
        const result = await updateBillStatus(currentOrder.id, 7);
        if (result) {
            setCurrentOrder((prevOrder) => ({ ...prevOrder, trangThai: 7 }));
            await addOrderHistory('Đã hoàn thành', 7); // Thêm lịch sử
            setEvents((prevEvents) => [
                ...prevEvents,
                { title: 'Đã hoàn thành', subtitle: new Date().toLocaleString(), color: '#4caf50' },
            ]);
            swal('Thành công!', 'Đơn hàng đã được hoàn thành!', 'success');
        }
    };

    useEffect(() => {
        const loadOrderHistory = async () => {
            if (currentOrder && currentOrder.id) {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/api/lich-su-don-hang/hoa-don/${currentOrder.id}`,
                    );
                    setEvents(
                        response.data.map((history) => ({
                            title: getStatusLabel(history.trangThai).label,
                            subtitle: new Date(history.ngayTao).toLocaleString(),
                            color: getStatusLabel(history.trangThai).color,
                        })),
                    );
                } catch (error) {
                    console.error('Failed to fetch order history', error);
                }
            }
        };

        loadOrderHistory();
    }, [currentOrder]);

    const handleButtonClick = async () => {
        switch (currentOrder.trangThai) {
            case 1:
                await handleConfirmOrder();
                break;
            case 2:
                await handleConfirmShipping();
                break;
            case 3:
                await handleConfirmDelivery();
                break;
            case 4:
                handleOpenModal();
                break;
            case 5:
                await handleConfirmComplete();
                break;
            default:
                break;
        }
    };

    if (!currentOrder) {
        return <div>Không tìm thấy thông tin đơn hàng.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-lg font-bold mb-4">Lịch sử đơn hàng</h1>
            <div className="bg-white shadow-md rounded-lg p-4">
                <Timeline>
                    {events.map((event, index) => (
                        <TimelineEvent key={index} title={event.title} subtitle={event.subtitle} color={event.color} />
                    ))}
                </Timeline>
                {currentOrder.trangThai < 7 && currentOrder.loaiHoaDon !== 'Tại quầy' && (
                    <button
                        onClick={handleButtonClick}
                        className="bg-white text-[#2f19ae] border border-[#2f19ae] hover:bg-[#2f19ae] hover:text-white font-medium py-1 px-2 rounded mx-1 transition duration-200"
                    >
                        {getButtonLabel(currentOrder.trangThai)}
                    </button>
                )}
                {currentOrder.trangThai < 4 && currentOrder.loaiHoaDon !== 'Tại quầy' && (
                    <button
                        onClick={handleCancelOrder}
                        className="bg-white text-[#2f19ae] border border-[#2f19ae] hover:bg-[#2f19ae] hover:text-white font-medium py-1 px-2 rounded mx-1 transition duration-200"
                    >
                        Hủy đơn
                    </button>
                )}
            </div>
            <div className="p-4">
                <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Thông tin đơn hàng</h2>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                            <span className="font-semibold">Mã:</span> {currentOrder.ma}
                        </div>
                        <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                            <span className="font-semibold">Tên khách hàng:</span>{' '}
                            {currentOrder.taiKhoan ? currentOrder.taiKhoan.hoTen : 'Khách lẻ'}
                        </div>
                        <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                            <span className="font-semibold">Sđt người nhận:</span> {currentOrder.sdtNguoiNhan}
                        </div>
                        <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                            <span className="font-semibold">Loại:</span>
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                {currentOrder.loaiHoaDon}
                            </span>
                        </div>
                        <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                            <span className="font-semibold">Tên người nhận:</span> {currentOrder.tenNguoiNhan}
                        </div>
                        <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                            <span className="font-semibold">Trạng thái:</span>
                            <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                                {getStatusLabel(currentOrder.trangThai).label}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Lịch sử thanh toán</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="border-b-2 p-2 whitespace-nowrap">Số tiền</th>
                                <th className="border-b-2 p-2 whitespace-nowrap">Thời gian</th>
                                <th className="border-b-2 p-2 whitespace-nowrap">Loại giao dịch</th>
                                <th className="border-b-2 p-2 whitespace-nowrap">PTTT</th>
                                <th className="border-b-2 p-2 whitespace-nowrap">Trạng thái</th>
                                <th className="border-b-2 p-2 whitespace-nowrap">Ghi chú</th>
                                <th className="border-b-2 p-2 whitespace-nowrap">Nhân viên xác nhận</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.length > 0 ? (
                                paymentHistory.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="border-b p-2 whitespace-nowrap">
                                            {payment.tongTien?.toLocaleString() ?? 'N/A'} đ
                                        </td>
                                        <td className="border-b p-2 whitespace-nowrap">
                                            {new Date(payment.ngayTao).toLocaleString('vi-VN') ?? 'N/A'}
                                        </td>
                                        <td className="border-b p-2 whitespace-nowrap">
                                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                                Thanh toán
                                            </span>
                                        </td>
                                        <td className="border-b p-2 whitespace-nowrap">
                                            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                                {payment.phuongThucThanhToan ?? 'N/A'}
                                            </span>
                                        </td>
                                        <td className="border-b p-2 whitespace-nowrap">
                                            <span className={`bg-green-100 text-green-600 px-2 py-1 rounded`}>
                                                {getStatusLabelTT(payment.trangThai)?.label ?? 'N/A'}
                                            </span>
                                        </td>
                                        <td className="border-b p-2 whitespace-nowrap">{payment.ghiChu ?? '-'}</td>
                                        <td className="border-b p-2 whitespace-nowrap">
                                            {payment.nhanVienXacNhan ?? '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="border-b p-2 text-center text-gray-500 whitespace-nowrap"
                                    >
                                        Không có lịch sử thanh toán nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 mt-4">
                    <h2 className="text-lg font-semibold mb-4">DANH SÁCH SẢN PHẨM</h2>
                    {(() => {
                        const uniqueProductIds = new Set();
                        const uniqueDetails = billDetails
                            .filter((detail) => detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === currentOrder.id)
                            .filter((detail) => {
                                const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                                if (isUnique) {
                                    uniqueProductIds.add(detail.hoaDonCT.id);
                                }
                                return isUnique;
                            });

                        return uniqueDetails.length > 0 ? (
                            <>
                                {uniqueDetails.map((detail) => (
                                    <div key={detail.hoaDonCT.id} className="flex items-center border-b py-4">
                                        <input className="mr-4" type="checkbox" />
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <img
                                                    src={detail.link || 'default_image.jpg'}
                                                    alt={detail.hoaDonCT.sanPhamCT.sanPham.ten}
                                                    className="w-20 h-20 object-cover"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-gray-800 font-semibold">
                                                    {detail.hoaDonCT.sanPhamCT.sanPham.ten}
                                                </div>
                                                <div className="text-gray-400 line-through">
                                                    {detail.hoaDonCT.giaBan.toLocaleString()} VND
                                                </div>
                                                <div className="text-gray-600">
                                                    Size: {detail.hoaDonCT.sanPhamCT.trongLuong.ten}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center ml-auto">
                                            <button
                                                className={`border border-gray-300 px-2 py-1 ${
                                                    currentOrder.trangThai === 3 ||
                                                    currentOrder.trangThai === 4 ||
                                                    currentOrder.trangThai === 5 ||
                                                    currentOrder.trangThai === 6 ||
                                                    currentOrder.trangThai === 7
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : ''
                                                }`}
                                                onClick={() => decreaseQuantity(detail)}
                                                disabled={
                                                    currentOrder.trangThai === 3 ||
                                                    currentOrder.trangThai === 4 ||
                                                    currentOrder.trangThai === 5 ||
                                                    currentOrder.trangThai === 6 ||
                                                    currentOrder.trangThai === 7
                                                }
                                            >
                                                {' - '}
                                            </button>
                                            <span className="mx-2">{detail.hoaDonCT.soLuong}</span>
                                            <button
                                                className={`border border-gray-300 px-2 py-1 ${
                                                    currentOrder.trangThai === 3 ||
                                                    currentOrder.trangThai === 4 ||
                                                    currentOrder.trangThai === 5 ||
                                                    currentOrder.trangThai === 6 ||
                                                    currentOrder.trangThai === 7
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : ''
                                                }`}
                                                onClick={() => increaseQuantity(detail)}
                                                disabled={
                                                    currentOrder.trangThai === 3 ||
                                                    currentOrder.trangThai === 4 ||
                                                    currentOrder.trangThai === 5 ||
                                                    currentOrder.trangThai === 6 ||
                                                    currentOrder.trangThai === 7
                                                }
                                            >
                                                {' + '}
                                            </button>
                                        </div>
                                        <div className="text-red-500 font-bold ml-8">
                                            {(detail.hoaDonCT.soLuong * detail.hoaDonCT.giaBan).toLocaleString()} VND
                                        </div>
                                        <button
                                            className={`ml-4 text-red-500 ${
                                                currentOrder.trangThai === 3 ||
                                                currentOrder.trangThai === 4 ||
                                                currentOrder.trangThai === 5 ||
                                                currentOrder.trangThai === 6 ||
                                                currentOrder.trangThai === 7
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : ''
                                            }`}
                                            onClick={() => handleDeleteDetail(detail.hoaDonCT.id)}
                                            disabled={
                                                currentOrder.trangThai === 3 ||
                                                currentOrder.trangThai === 4 ||
                                                currentOrder.trangThai === 5 ||
                                                currentOrder.trangThai === 6 ||
                                                currentOrder.trangThai === 7
                                            }
                                        >
                                            <TrashIcon className="w-5" />
                                        </button>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="text-gray-500 font-semibold text-center py-4">
                                Không có chi tiết hóa đơn nào.
                            </div>
                        );
                    })()}
                </div>
                <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-md mt-6">
                    <div>
                        <p className="text-gray-700 font-medium">Phiếu giảm giá:</p>
                        <p className="text-gray-700 font-medium">
                            Giảm giá từ cửa hàng: <span className="font-bold">0%</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-700 font-medium">
                            Tổng tiền hàng: <span className="font-bold">{totalAmount.toLocaleString()} VND</span>
                        </p>
                        <p className="text-gray-700 font-medium">
                            Giảm giá: <span className="font-bold"> 0 VND</span>
                        </p>
                        <div className="flex items-center justify-end">
                            <p className="text-gray-700 font-medium mr-2 ">Phí vận chuyển:</p>
                            <input
                                type="text"
                                value={shippingFee}
                                className="border border-gray-300 rounded px-2 py-1 w-20 text-right"
                                readOnly
                            />
                        </div>
                        <p className="text-gray-700 font-medium mt-2">
                            Tổng tiền:{' '}
                            <span className="font-bold text-red-500">{totalAmount.toLocaleString()} VND</span>
                        </p>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-center text-xl font-semibold mb-4">Xác nhận thanh toán</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Tổng tiền</label>
                            <input
                                type="text"
                                value={`${totalAmount.toLocaleString()} VND`}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Tiền khách đưa</label>
                            <input
                                type="number"
                                value={customerMoney}
                                onChange={(e) => setCustomerMoney(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Tiền thừa</label>
                            <input
                                type="text"
                                value={`${Math.max(0, customerMoney - totalAmount).toLocaleString()} VND`}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Ghi chú</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Phương thức thanh toán:</label>
                            <div className="flex items-center mt-1">
                                <input
                                    type="radio"
                                    id="chuyen-khoan"
                                    name="payment-method"
                                    className="mr-2"
                                    checked={paymentMethod === 'chuyen-khoan'}
                                    onChange={() => setPaymentMethod('chuyen-khoan')}
                                />
                                <label htmlFor="chuyen-khoan" className="mr-4">
                                    Chuyển khoản
                                </label>
                                <input
                                    type="radio"
                                    id="tien-mat"
                                    name="payment-method"
                                    className="mr-2"
                                    checked={paymentMethod === 'tien-mat'}
                                    onChange={() => setPaymentMethod('tien-mat')}
                                />
                                <label htmlFor="tien-mat">Tiền mặt</label>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Mã giao dịch *</label>
                            <input
                                type="text"
                                value={transactionCode}
                                onChange={(e) => setTransactionCode(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleCloseModal}>
                                Đóng
                            </button>
                            <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleSavePayment}>
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
