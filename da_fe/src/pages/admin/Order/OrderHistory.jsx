import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';
import axios from 'axios';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import swal from 'sweetalert';
import numeral from 'numeral';

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

    const [usedVoucher, setUsedVoucher] = useState(null);

    const [productPrices, setProductPrices] = useState({});

    const formatCurrency = (money) => {
        return numeral(money).format('0,0') + ' ₫';
    };

    const handleMoneyChange = (e) => {
        const value = e.target.value.replace(/,/g, '').replace(/\D/g, ''); // Remove commas and non-numeric characters
        setCustomerMoney(value ? parseInt(value, 10) : 0);
    };

    // useEffect(() => {
    //     const fetchProductPrices = async () => {
    //         if (!currentOrder || !billDetails.length) return;

    //         const uniqueProductIds = new Set();
    //         // Kết hợp cả sản phẩm và sản phẩm trả hàng
    //         const uniqueDetails = billDetails
    //             .filter(
    //                 (detail) =>
    //                     detail.hoaDonCT &&
    //                     detail.hoaDonCT.hoaDon.id === currentOrder.id &&
    //                     (detail.hoaDonCT.trangThai === 1 || detail.hoaDonCT.trangThai === 2),
    //             )
    //             .filter((detail) => {
    //                 const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
    //                 if (isUnique) {
    //                     uniqueProductIds.add(detail.hoaDonCT.id);
    //                 }
    //                 return isUnique;
    //             });

    //         const pricePromises = uniqueDetails.map(async (detail) => {
    //             try {
    //                 const response = await axios.get(
    //                     `http://localhost:8080/api/san-pham-khuyen-mai/san-pham-ct/${detail.hoaDonCT.sanPhamCT.id}`,
    //                 );

    //                 return {
    //                     [detail.hoaDonCT.id]:
    //                         response.data.length > 0
    //                             ? {
    //                                 originalPrice: detail.hoaDonCT.giaBan,
    //                                 discountedPrice: response.data[0].giaKhuyenMai,
    //                                 promotion: response.data[0],
    //                             }
    //                             : {
    //                                 originalPrice: detail.hoaDonCT.giaBan,
    //                                 discountedPrice: detail.hoaDonCT.giaBan,
    //                                 promotion: null,
    //                             },
    //                 };
    //             } catch (error) {
    //                 console.error('Error fetching product promotion:', error);
    //                 return {
    //                     [detail.hoaDonCT.id]: {
    //                         originalPrice: detail.hoaDonCT.giaBan,
    //                         discountedPrice: detail.hoaDonCT.giaBan,
    //                         promotion: null,
    //                     },
    //                 };
    //             }
    //         });

    //         const priceResults = await Promise.all(pricePromises);
    //         const priceMap = priceResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    //         setProductPrices(priceMap);
    //     };

    //     fetchProductPrices();
    // }, [billDetails]);

    useEffect(() => {
        const fetchProductPrices = async () => {
            if (!currentOrder || !billDetails.length) return;

            const uniqueProductIds = new Set();
            // Kết hợp cả sản phẩm và sản phẩm trả hàng
            const uniqueDetails = billDetails
                .filter(
                    (detail) =>
                        detail.hoaDonCT &&
                        detail.hoaDonCT.hoaDon.id === currentOrder.id &&
                        (detail.hoaDonCT.trangThai === 1 || detail.hoaDonCT.trangThai === 2),
                )
                .filter((detail) => {
                    const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                    if (isUnique) {
                        uniqueProductIds.add(detail.hoaDonCT.id);
                    }
                    return isUnique;
                });

            const pricePromises = uniqueDetails.map(async (detail) => {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/api/san-pham-khuyen-mai/san-pham/${detail.hoaDonCT.sanPhamCT.id}`,
                    );

                    if (response.data.length > 0) {
                        const promotion = response.data[0];
                        // Kiểm tra trạng thái khuyến mãi
                        if (promotion.khuyenMai.trangThai === 0 || promotion.khuyenMai.trangThai === 2) {
                            // Nếu trạng thái là 0 hoặc 2, sử dụng giá gốc
                            return {
                                [detail.hoaDonCT.id]: {
                                    originalPrice: detail.hoaDonCT.giaBan,
                                    discountedPrice: detail.hoaDonCT.giaBan, // Giá gốc
                                    promotion: null,
                                },
                            };
                        }
                        // Nếu có khuyến mãi hợp lệ, sử dụng giá khuyến mãi
                        return {
                            [detail.hoaDonCT.id]: {
                                originalPrice: detail.hoaDonCT.giaBan,
                                discountedPrice: detail.hoaDonCT.giaBan * (1 - promotion.khuyenMai.giaTri / 100),
                                promotion: promotion,
                            },
                        };
                    }

                    // Nếu không có khuyến mãi, trả về giá gốc
                    return {
                        [detail.hoaDonCT.id]: {
                            originalPrice: detail.hoaDonCT.giaBan,
                            discountedPrice: detail.hoaDonCT.giaBan,
                            promotion: null,
                        },
                    };
                } catch (error) {
                    console.error('Error fetching product promotion:', error);
                    return {
                        [detail.hoaDonCT.id]: {
                            originalPrice: detail.hoaDonCT.giaBan,
                            discountedPrice: detail.hoaDonCT.giaBan,
                            promotion: null,
                        },
                    };
                }
            });

            const priceResults = await Promise.all(pricePromises);
            const priceMap = priceResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setProductPrices(priceMap);
        };

        fetchProductPrices();
    }, [billDetails]);

    useEffect(() => {
        const loadPaymentHistory = async (hoaDonId) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/thanh-toan/hoa-don/${hoaDonId}`);
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
        setShippingFee(currentOrder.phiShip);
    }, [currentOrder]);

    // Thêm hàm để lấy giá khuyến mãi
    // const getProductPrice = async (sanPhamCT) => {
    //     try {
    //         const response = await axios.get(
    //             `http://localhost:8080/api/san-pham-khuyen-mai/san-pham-ct/${sanPhamCT.id}`,
    //         );

    //         if (response.data.length > 0) {
    //             // Nếu có khuyến mãi, sử dụng giá khuyến mãi
    //             return {
    //                 originalPrice: sanPhamCT.donGia,
    //                 discountedPrice: response.data[0].giaKhuyenMai,
    //                 promotion: response.data[0],
    //             };
    //         }

    //         // Nếu không có khuyến mãi, trả về giá gốc
    //         return {
    //             originalPrice: sanPhamCT.donGia,
    //             discountedPrice: sanPhamCT.donGia,
    //             promotion: null,
    //         };
    //     } catch (error) {
    //         console.error('Error fetching product promotion:', error);
    //         return {
    //             originalPrice: sanPhamCT.donGia,
    //             discountedPrice: sanPhamCT.donGia,
    //             promotion: null,
    //         };
    //     }
    // };

    const getProductPrice = async (sanPhamCT) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/san-pham-khuyen-mai/san-pham/${sanPhamCT.id}`);

            if (response.data.length > 0) {
                const promotion = response.data[0];
                // Kiểm tra trạng thái khuyến mãi
                if (promotion.khuyenMai.trangThai === 0 || promotion.khuyenMai.trangThai === 2) {
                    // Nếu có khuyến mãi nhưng trạng thái là 0 hoặc 2, sử dụng giá gốc
                    return {
                        originalPrice: sanPhamCT.donGia,
                        discountedPrice: sanPhamCT.donGia,
                        promotion: null,
                    };
                }
                // Nếu có khuyến mãi, sử dụng giá khuyến mãi
                return {
                    originalPrice: sanPhamCT.donGia,
                    discountedPrice: sanPhamCT.donGia * (1 - promotion.khuyenMai.giaTri / 100),
                    promotion: promotion,
                };
            }

            // Nếu không có khuyến mãi, trả về giá gốc
            return {
                originalPrice: sanPhamCT.donGia,
                discountedPrice: sanPhamCT.donGia,
                promotion: null,
            };
        } catch (error) {
            console.error('Error fetching product promotion:', error);
            return {
                originalPrice: sanPhamCT.donGia,
                discountedPrice: sanPhamCT.donGia,
                promotion: null,
            };
        }
    };

    // Sửa đổi useEffect tính tổng tiền
    useEffect(() => {
        const calculateTotal = async () => {
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

            // Tính tổng tiền với giá khuyến mãi
            const totalPromises = uniqueDetails.map(async (detail) => {
                const priceInfo = await getProductPrice(detail.hoaDonCT.sanPhamCT);
                return detail.hoaDonCT.soLuong * priceInfo.discountedPrice;
            });

            const totals = await Promise.all(totalPromises);
            const totalItems = totals.reduce((sum, current) => sum + current, 0);

            setTotalAmount(totalItems);
        };

        calculateTotal();
    }, [billDetails, currentOrder]);

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

    const handleOpenModal = () => {
        setPaymentAmount(totalAmount);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // const handleSavePayment = async () => {
    //     const paymentData = {
    //         taiKhoan: { id: 1 }, // Thay đổi id này nếu cần
    //         hoaDon: { id: currentOrder.id },
    //         ma: null,
    //         tongTien: totalAmount,
    //         phuongThucThanhToan: paymentMethod === 'chuyen-khoan' ? 'Chuyển khoản' : 'Tiền mặt', // Sử dụng giá trị từ state
    //         ngayTao: new Date(),
    //         trangThai: 1,
    //     };

    //     try {
    //         const response = await axios.post('http://localhost:8080/api/thanh-toan', paymentData);
    //         swal('Thành công!', 'Thanh toán đã được lưu!', 'success');

    //         // Cập nhật paymentHistory ngay lập tức
    //         setPaymentHistory((prevHistory) => [
    //             ...prevHistory,
    //             {
    //                 ...paymentData,
    //                 id: response.data.id, // Giả sử API trả về id của thanh toán vừa tạo
    //                 ngayTao: new Date().toISOString(), // Cập nhật thời gian tạo
    //             },
    //         ]);

    //         // Cập nhật trạng thái hóa đơn
    //         const updatedOrder = { ...currentOrder, trangThai: 5 }; // 5 là trạng thái "Đã thanh toán"
    //         setCurrentOrder(updatedOrder);

    //         // Cập nhật sự kiện
    //         handleConfirmPayment();

    //         handleCloseModal(); // Đóng modal
    //     } catch (error) {
    //         console.error('Có lỗi xảy ra khi lưu thanh toán!', error);
    //         swal('Thất bại!', 'Có lỗi xảy ra khi lưu thanh toán!', 'error');
    //     }
    // };

    const handleSavePayment = async () => {
        const paymentData = {
            taiKhoan: { id: 1 },
            hoaDon: { id: currentOrder.id },
            ma: null,
            tongTien: totalAmount,
            phuongThucThanhToan: paymentMethod === 'chuyen-khoan' ? 'Chuyển khoản' : 'Tiền mặt',
            ngayTao: new Date(),
            trangThai: 1,
        };

        try {
            // Thanh toán
            const response = await axios.post('http://localhost:8080/api/thanh-toan', paymentData);

            // Cập nhật số lượng trong kho cho từng sản phẩm
            // for (const detail of billDetails) {
            //     if (detail.hoaDonCT.trangThai === 1) {
            //         // Chỉ cập nhật sản phẩm chưa trả
            //         await axios.put(
            //             `http://localhost:8080/api/san-pham-ct/update-quantity/${detail.hoaDonCT.sanPhamCT.id}`,
            //             {
            //                 soLuong: detail.hoaDonCT.sanPhamCT.soLuong - detail.hoaDonCT.soLuong,
            //             },
            //         );
            //     }
            // }

            swal('Thành công!', 'Thanh toán đã được lưu!', 'success');

            // Các logic cập nhật state còn lại giữ nguyên
            setPaymentHistory((prevHistory) => [
                ...prevHistory,
                {
                    ...paymentData,
                    id: response.data.id,
                    ngayTao: new Date().toISOString(),
                },
            ]);

            const updatedOrder = { ...currentOrder, trangThai: 5 };
            setCurrentOrder(updatedOrder);

            handleConfirmPayment();
            handleCloseModal();
        } catch (error) {
            console.error('Có lỗi xảy ra khi lưu thanh toán!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi lưu thanh toán!', 'error');
        }
    };

    const getButtonLabel = (status) => {
        // Kiểm tra xem hóa đơn đã được thanh toán chưa
        const isPaid = paymentHistory.some(
            (payment) => payment.hoaDon.id === currentOrder.id && payment.trangThai === 1,
        );

        switch (status) {
            case 1:
                return 'Xác nhận đơn hàng';
            case 2:
                return 'Xác nhận giao hàng';
            case 3:
                return 'Xác nhận lấy hàng';
            case 4:
                // Nếu đã thanh toán, chuyển button thành "Hoàn thành"
                return isPaid ? 'Hoàn thành' : 'Thanh toán';
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
            case 9:
                return { label: 'Trả hàng', color: '#f54278' }; // Thêm trường hợp cho trạng thái 9
            default:
                return { label: 'Không xác định', color: '#f54278' };
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

    const loadVoucherById = async (voucherId) => {
        try {
            if (voucherId) {
                const voucherResponse = await axios.get(`http://localhost:8080/api/voucher/by-id/${voucherId}`);
                console.log('Voucher Response:', voucherResponse.data);
                setUsedVoucher(voucherResponse.data);
            }
        } catch (error) {
            console.error('Failed to fetch materials', error);
        }
    };

    useEffect(() => {
        loadVoucherById(currentOrder.idVoucher);
    }, []);

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

    useEffect(() => {
        console.log('Hoa ddonw: ', productPrices);
    }, []);

    useEffect(() => {
        // Tính toán tổng tiền cuối cùng bao gồm giảm giá và phí ship
        const calculateFinalTotal = () => {
            if (!totalAmount) return 0;

            // Tính giảm giá từ voucher
            const discountAmount = usedVoucher ? calculateDiscountAmount(totalAmount) : 0;

            // Tổng tiền = tổng tiền hàng - giảm giá + phí ship
            const finalTotal = totalAmount - discountAmount + shippingFee;

            // Chỉ cập nhật nếu khác giá trị hiện tại
            if (currentOrder && Math.abs(currentOrder.tongTien - finalTotal) > 0.01) {
                setCurrentOrder((prev) => ({
                    ...prev,
                    tongTien: finalTotal,
                }));
            }
        };

        calculateFinalTotal();
    }, [totalAmount, shippingFee, usedVoucher]);

    const handleConfirmOrder = async () => {
        try {
            // Cập nhật số lượng sản phẩm trong kho ngay khi xác nhận đơn hàng
            for (const detail of billDetails) {
                if (detail.hoaDonCT.trangThai === 1) {
                    // Chỉ cập nhật sản phẩm chưa trả
                    await axios.put(
                        `http://localhost:8080/api/san-pham-ct/update-quantity/${detail.hoaDonCT.sanPhamCT.id}`,
                        {
                            soLuong: detail.hoaDonCT.sanPhamCT.soLuong - detail.hoaDonCT.soLuong,
                        },
                    );
                }
            }

            // Cập nhật trạng thái đơn hàng
            const result = await updateBillStatus(currentOrder.id, 2);

            if (result) {
                setCurrentOrder((prevOrder) => ({ ...prevOrder, trangThai: 2 }));
                await addOrderHistory('Chờ giao hàng', 2);
                setEvents((prevEvents) => [
                    ...prevEvents,
                    { title: 'Chờ giao hàng', subtitle: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }), color: '#ebd534' },
                ]);
                swal('Thành công!', 'Chờ giao hàng!', 'success');
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận đơn hàng:', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi xác nhận đơn hàng!', 'error');
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
        try {
            // Cập nhật số lượng sản phẩm trong kho dựa trên số lượng đã chỉnh sửa
            for (const detail of billDetails) {
                if (detail.hoaDonCT.trangThai === 1) {
                    // Log thông tin chi tiết để kiểm tra
                    console.log('Detail:', detail);
                    console.log('Original Quantity:', detail.hoaDonCT.sanPhamCT.soLuong);
                    console.log('Order Quantity:', detail.hoaDonCT.soLuong);

                    // Lấy số lượng ban đầu từ đơn hàng gốc (trước khi chỉnh sửa)
                    const originalQuantity = detail.hoaDonCT.soLuong;

                    // Tính số lượng chênh lệch
                    const quantityDifference = detail.hoaDonCT.soLuong - originalQuantity;

                    console.log('Original Quantity:', originalQuantity);
                    console.log('Quantity Difference:', quantityDifference);

                    // Chỉ cập nhật nếu có sự thay đổi số lượng
                    if (quantityDifference !== 0) {
                        const response = await axios.put(
                            `http://localhost:8080/api/san-pham-ct/update-quantity/${detail.hoaDonCT.sanPhamCT.id}`,
                            {
                                soLuong: detail.hoaDonCT.sanPhamCT.soLuong - quantityDifference,
                            },
                        );

                        console.log('Update Response:', response.data);

                        // Cập nhật số lượng ban đầu để lần sau tính toán chính xác
                        detail.hoaDonCT.soLuongBanDau = detail.hoaDonCT.soLuong;
                    }
                }
            }

            // Cập nhật trạng thái đơn hàng
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
        } catch (error) {
            console.error('Lỗi khi xác nhận giao hàng:', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi xác nhận giao hàng!', 'error');
        }
    };

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
        // Kiểm tra xem hóa đơn đã được thanh toán chưa
        const isPaid = paymentHistory.some(
            (payment) => payment.hoaDon.id === currentOrder.id && payment.trangThai === 1,
        );

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
                // Nếu đã thanh toán, chuyển sang hoàn thành
                if (isPaid) {
                    await handleConfirmComplete();
                } else {
                    handleOpenModal();
                }
                break;
            case 5:
                await handleConfirmComplete();
                break;
            default:
                break;
        }
    };

    // Sửa lại hàm calculateDiscountAmount để nhận tham số totalAmount
    const calculateDiscountAmount = (totalAmount) => {
        if (!usedVoucher) return 0;

        // Kiểm tra kiểu giảm giá
        if (usedVoucher.kieuGiaTri === 0) {
            // Giảm theo %
            const discountPercentage = usedVoucher.giaTri / 100;
            const discountAmount = totalAmount * discountPercentage;
            const finalDiscount = Math.min(discountAmount, usedVoucher.giaTriMax);

            return finalDiscount;
        } else if (usedVoucher.kieuGiaTri === 1) {
            // Giảm cố định
            return Math.min(usedVoucher.giaTri, totalAmount);
        }

        return 0;
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
                        className="bg-white text-[#2f19ae ] border border-[#2f19ae] hover:bg-[#2f19ae] hover:text-white font-medium py-1 px-2 rounded mx-1 transition duration-200"
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
                            .filter(
                                (detail) =>
                                    detail.hoaDonCT &&
                                    detail.hoaDonCT.hoaDon.id === currentOrder.id &&
                                    detail.hoaDonCT.trangThai === 1,
                            )
                            .filter((detail) => {
                                const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                                if (isUnique) {
                                    uniqueProductIds.add(detail.hoaDonCT.id);
                                }
                                return isUnique;
                            });

                        return uniqueDetails.length > 0 ? (
                            <>
                                {uniqueDetails.map((detail) => {
                                    const priceInfo = productPrices[detail.hoaDonCT.id] || {
                                        originalPrice: detail.hoaDonCT.giaBan,
                                        discountedPrice: detail.hoaDonCT.giaBan,
                                        promotion: null,
                                    };

                                    return (
                                        <div key={detail.hoaDonCT.id} className="flex items-center border-b py-4">
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
                                                    <div className="flex items-center space-x-2">
                                                        {priceInfo.promotion ? (
                                                            <>
                                                                <div className="text-red-500">
                                                                    {priceInfo.discountedPrice.toLocaleString()} VND
                                                                </div>
                                                                <div className="text-gray-400 line-through">
                                                                    {priceInfo.originalPrice.toLocaleString()} VND
                                                                </div>
                                                                <div className="text-green-500 font-bold">
                                                                    {Math.round(
                                                                        ((priceInfo.originalPrice -
                                                                            priceInfo.discountedPrice) /
                                                                            priceInfo.originalPrice) *
                                                                            100,
                                                                    )}
                                                                    % off
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-gray-400">
                                                                {priceInfo.originalPrice.toLocaleString()} VND
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        Size: {detail.hoaDonCT.sanPhamCT.trongLuong.ten}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Phần còn lại của render giữ nguyên */}
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
                                                        currentOrder.trangThai === 7 ||
                                                        detail.hoaDonCT.soLuong >= detail.hoaDonCT.sanPhamCT.soLuong
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : ''
                                                    }`}
                                                    onClick={() => increaseQuantity(detail)}
                                                    disabled={
                                                        currentOrder.trangThai === 3 ||
                                                        currentOrder.trangThai === 4 ||
                                                        currentOrder.trangThai === 5 ||
                                                        currentOrder.trangThai === 6 ||
                                                        currentOrder.trangThai === 7 ||
                                                        detail.hoaDonCT.soLuong >= detail.hoaDonCT.sanPhamCT.soLuong
                                                    }
                                                >
                                                    {' + '}
                                                </button>
                                            </div>
                                            <div className="text-gray-500 text-sm ml-2">
                                                Còn {detail.hoaDonCT.sanPhamCT.soLuong} sản phẩm trong kho
                                            </div>
                                            <div className="text-red-500 font-bold ml-8">
                                                {(
                                                    detail.hoaDonCT.soLuong *
                                                    (priceInfo.discountedPrice || detail.hoaDonCT.giaBan)
                                                ).toLocaleString()}{' '}
                                                VND
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <div className="text-gray-500 font-semibold text-center py-4">Không có sản phẩm nào.</div>
                        );
                    })()}
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 mt-4">
                    <h2 className="text-lg font-semibold mb-4">DANH SÁCH TRẢ HÀNG</h2>
                    {(() => {
                        const uniqueProductIds = new Set();
                        const uniqueReturnedDetails = billDetails
                            .filter(
                                (detail) =>
                                    detail.hoaDonCT &&
                                    detail.hoaDonCT.hoaDon.id === currentOrder.id &&
                                    detail.hoaDonCT.trangThai === 2,
                            )
                            .filter((detail) => {
                                const isUnique = !uniqueProductIds.has(detail.hoaDonCT.id);
                                if (isUnique) {
                                    uniqueProductIds.add(detail.hoaDonCT.id);
                                }
                                return isUnique;
                            });

                        return uniqueReturnedDetails.length > 0 ? (
                            <>
                                {uniqueReturnedDetails.map((detail) => {
                                    const priceInfo = productPrices[detail.hoaDonCT.id] || {
                                        originalPrice: detail.hoaDonCT.giaBan,
                                        discountedPrice: detail.hoaDonCT.giaBan,
                                        promotion: null,
                                    };

                                    return (
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
                                                    <div className="flex items-center space-x-2">
                                                        {priceInfo.promotion ? (
                                                            <>
                                                                <div className="text-red-500">
                                                                    {priceInfo.discountedPrice.toLocaleString()} VND
                                                                </div>
                                                                <div className="text-gray-400 line-through">
                                                                    {priceInfo.originalPrice.toLocaleString()} VND
                                                                </div>
                                                                <div className="text-green-500 font-bold">
                                                                    {Math.round(
                                                                        ((priceInfo.originalPrice -
                                                                            priceInfo.discountedPrice) /
                                                                            priceInfo.originalPrice) *
                                                                            100,
                                                                    )}
                                                                    % off
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-gray-400">
                                                                {priceInfo.originalPrice.toLocaleString()} VND
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        Size: {detail.hoaDonCT.sanPhamCT.trongLuong.ten}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Phần còn lại của render giữ nguyên */}
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
                                                        currentOrder.trangThai === 7 ||
                                                        detail.hoaDonCT.soLuong >= detail.hoaDonCT.sanPhamCT.soLuong
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : ''
                                                    }`}
                                                    onClick={() => increaseQuantity(detail)}
                                                    disabled={
                                                        currentOrder.trangThai === 3 ||
                                                        currentOrder.trangThai === 4 ||
                                                        currentOrder.trangThai === 5 ||
                                                        currentOrder.trangThai === 6 ||
                                                        currentOrder.trangThai === 7 ||
                                                        detail.hoaDonCT.soLuong >= detail.hoaDonCT.sanPhamCT.soLuong
                                                    }
                                                >
                                                    {' + '}
                                                </button>
                                            </div>
                                            <div className="text-gray-500 text-sm ml-2">
                                                Còn {detail.hoaDonCT.sanPhamCT.soLuong} sản phẩm trong kho
                                            </div>
                                            <div className="text-red-500 font-bold ml-8">
                                                {(
                                                    detail.hoaDonCT.soLuong *
                                                    (priceInfo.discountedPrice || detail.hoaDonCT.giaBan)
                                                ).toLocaleString()}{' '}
                                                VND
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
                                    );
                                })}
                            </>
                        ) : (
                            <div className="text-gray-500 font-semibold text-center py-4">
                                Không có sản phẩm trả hàng nào.
                            </div>
                        );
                    })()}
                </div>
                <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-md mt-6">
                    <div>
                        <p className="text-gray-700 font-medium">
                            Phiếu giảm giá: {usedVoucher ? usedVoucher.ma : 'Không có'}
                        </p>
                        <p className="text-gray-700 font-medium">
                            Giảm giá từ cửa hàng:{' '}
                            <span className="font-bold">{usedVoucher ? usedVoucher.giaTri : 0}%</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-700 font-medium">
                            Tổng tiền hàng: <span className="font-bold">{totalAmount.toLocaleString()} VND</span>
                        </p>
                        <p className="text-gray-700 font-medium">
                            Giảm giá:{' '}
                            <span className="font-bold">
                                {calculateDiscountAmount(totalAmount).toLocaleString()} VND
                            </span>
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
                            <span className="font-bold text-red-500">{currentOrder.tongTien.toLocaleString()} VND</span>
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
                                value={`${currentOrder.tongTien.toLocaleString()} VND`}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Tiền khách đưa</label>
                            <input
                                type="text"
                                value={formatCurrency(customerMoney)}
                                onChange={handleMoneyChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Tiền thừa</label>
                            <input
                                type="text"
                                value={`${Math.max(0, customerMoney - currentOrder.tongTien).toLocaleString()} VND`}
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
                            <button
                                className={`bg-orange-500 text-white px-4 py-2 rounded ${
                                    customerMoney < currentOrder.tongTien ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                onClick={() => {
                                    if (parseFloat(customerMoney) < currentOrder.tongTien) {
                                        swal(
                                            'Thất bại!',
                                            'Số tiền khách đưa phải lớn hơn hoặc bằng tổng tiền!',
                                            'warning',
                                        );
                                    } else {
                                        handleSavePayment(); // Gọi hàm lưu thanh toán nếu hợp lệ
                                    }
                                }}
                                disabled={customerMoney < currentOrder.tongTien} // Disable button nếu tiền khách đưa không đủ
                            >
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
