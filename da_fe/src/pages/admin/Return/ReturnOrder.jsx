import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function ReturnOrder() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const orderId = query.get('orderId');
    const [billDetails, setBillDetails] = useState([]);
    const [bills, setBills] = useState([]);
    const [returnItems, setReturnItems] = useState([]); // Danh sách sản phẩm trả
    const navigate = useNavigate();
    const [usedVoucher, setUsedVoucher] = useState(null);

    const [productPrices, setProductPrices] = useState({});

    // Thêm hàm lấy giá khuyến mãi
    const getProductPrice = async (sanPhamCT) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/san-pham-khuyen-mai/san-pham-ct/${sanPhamCT.id}`,
            );

            if (response.data.length > 0) {
                // Nếu có khuyến mãi, sử dụng giá khuyến mãi
                return {
                    originalPrice: sanPhamCT.donGia,
                    discountedPrice: response.data[0].giaKhuyenMai,
                    promotion: response.data[0],
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

    // Thêm useEffect để tìm nạp giá khuyến mãi
    useEffect(() => {
        const fetchProductPrices = async () => {
            if (!billDetails.length) return;

            const uniqueProductIds = new Set();
            const uniqueDetails = billDetails
                .filter((detail) => detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === Number(orderId))
                .filter((detail) => {
                    const isUnique = !uniqueProductIds.has(detail.hoaDonCT.sanPhamCT.id);
                    if (isUnique) {
                        uniqueProductIds.add(detail.hoaDonCT.sanPhamCT.id);
                    }
                    return isUnique;
                });

            const pricePromises = uniqueDetails.map(async (detail) => {
                try {
                    const priceInfo = await getProductPrice(detail.hoaDonCT.sanPhamCT);
                    return {
                        [detail.hoaDonCT.sanPhamCT.id]: priceInfo,
                    };
                } catch (error) {
                    console.error('Error fetching product price:', error);
                    return {
                        [detail.hoaDonCT.sanPhamCT.id]: {
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
    }, [billDetails, orderId]);

    const loadBillDetailsWithImages = async (hoaDonId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/hoa-don-ct/with-images/${hoaDonId}`);
            setBillDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch BillDetails with images', error);
        }
    };

    const loadBillWithId = async (hoaDonId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/hoa-don/${hoaDonId}`);
            setBills(response.data);

            console.log('Hóa đơn: ', response.data);
            console.log('Vao chờ: ', response.data.idVoucher);

            // Nếu có voucher ID, load thông tin voucher
            if (response.data.idVoucher) {
                const voucherResponse = await axios.get(
                    `http://localhost:8080/api/voucher/by-id/${response.data.idVoucher}`,
                );
                console.log('Voucher Response:', voucherResponse.data);
                setUsedVoucher(voucherResponse.data);
            }
        } catch (error) {
            console.error('Failed to fetch Bill Details', error);
        }
    };

    useEffect(() => {
        loadBillDetailsWithImages(orderId);
        loadBillWithId(orderId);
    }, [orderId]);

    const handleCheckboxChange = (item) => {
        if (returnItems.some((i) => i.hoaDonCT.id === item.hoaDonCT.id)) {
            setReturnItems(returnItems.filter((i) => i.hoaDonCT.id !== item.hoaDonCT.id));
        } else {
            setReturnItems([...returnItems, { ...item, soLuong: 1 }]); // Thêm sản phẩm với số lượng 1
        }
    };

    const uniqueProductIds = new Set();

    const uniqueDetails = billDetails.filter((detail) => {
        if (detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === Number(orderId)) {
            const isUnique = !uniqueProductIds.has(detail.hoaDonCT.sanPhamCT.id);
            if (isUnique) {
                uniqueProductIds.add(detail.hoaDonCT.sanPhamCT.id);
                return true;
            }
        }
        return false;
    });

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

    const updateBillDetailStatus = async (hoaDonCTId, status) => {
        try {
            const response = await fetch(`http://localhost:8080/api/hoa-don-ct/update-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hoaDonCTId, status }), // Đảm bảo rằng bạn đang gửi ID đúng
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

    const addOrderHistory = async (description, status) => {
        const historyData = {
            taiKhoan: { id: 1 }, // ID tài khoản (nếu có)
            hoaDon: { id: Number(orderId), trangThai: status }, // ID hóa đơn
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

    const handleReturnOrder = async () => {
        // Cập nhật trạng thái hóa đơn
        const billUpdateResponse = await updateBillStatus(orderId, 9);
        if (billUpdateResponse) {
            // Cập nhật trạng thái cho từng hóa đơn chi tiết đã chọn
            for (const item of returnItems) {
                await updateBillDetailStatus(item.hoaDonCT.id, 2); // Cập nhật trạng thái cho hóa đơn chi tiết
            }

            // Thêm lịch sử đơn hàng
            await addOrderHistory('Trả hàng', 9); // Mô tả và trạng thái
            navigate('/admin/tra-hang');
            swal('Thành công!', 'Trả hàng thành công!', 'success');
        } else {
            swal('Thất bại!', 'Có lỗi xảy ra khi trả hàng!', 'error');
        }
    };

    useEffect(() => {
        console.log('voucher: ', usedVoucher);
    }, []);

    const calculateDiscountAmount = () => {
        if (!usedVoucher) return 0;

        console.log('Used Voucher:', usedVoucher);
        console.log('Return Items:', returnItems);

        // Tính tổng tiền gốc của các sản phẩm trả
        const totalReturnPrice = returnItems.reduce(
            (total, item) => total + item.hoaDonCT.soLuong * item.hoaDonCT.giaBan,
            0,
        );

        console.log('Total Return Price:', totalReturnPrice);

        // Loại bỏ điều kiện kiểm tra dieuKienNhoNhat
        // Kiểm tra kiểu giảm giá
        if (usedVoucher.kieuGiaTri === 0) {
            // Giảm theo %
            const discountPercentage = usedVoucher.giaTri / 100;
            const discountAmount = totalReturnPrice * discountPercentage;
            const finalDiscount = Math.min(discountAmount, usedVoucher.giaTriMax);

            console.log('Discount Percentage:', discountPercentage);
            console.log('Discount Amount:', discountAmount);
            console.log('Final Discount:', finalDiscount);

            return finalDiscount;
        } else if (usedVoucher.kieuGiaTri === 1) {
            // Giảm cố định
            return Math.min(usedVoucher.giaTri, totalReturnPrice);
        }

        return 0;
    };

    // Sửa đổi các hàm tính toán để sử dụng giá khuyến mãi
    const calculateTotalReturnPrice = () => {
        return returnItems.reduce((total, item) => {
            const priceInfo = productPrices[item.hoaDonCT.sanPhamCT.id] || {
                discountedPrice: item.hoaDonCT.giaBan,
            };
            return total + item.hoaDonCT.soLuong * priceInfo.discountedPrice;
        }, 0);
    };

    const calculateRefundAmount = () => {
        const totalReturnPrice = returnItems.reduce((total, item) => {
            const priceInfo = productPrices[item.hoaDonCT.sanPhamCT.id] || {
                discountedPrice: item.hoaDonCT.giaBan,
            };
            return total + item.hoaDonCT.soLuong * priceInfo.discountedPrice;
        }, 0);

        const discountAmount = calculateDiscountAmount(totalReturnPrice);
        return totalReturnPrice - discountAmount;
    };

    return (
        <div className="p-4">
            <div className="border rounded-lg p-4 mb-4">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left w-1/2">Sản phẩm</th>
                            <th className="text-center w-1/4">Số lượng</th>
                            <th className="text-right w-1/4">Đơn giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueDetails.length > 0 ? (
                            uniqueDetails.map((item) => {
                                const priceInfo = productPrices[item.hoaDonCT.sanPhamCT.id] || {
                                    originalPrice: item.hoaDonCT.giaBan,
                                    discountedPrice: item.hoaDonCT.giaBan,
                                    promotion: null,
                                };

                                return (
                                    <tr className="border-t" key={item.hoaDonCT.id}>
                                        <td className="flex items-center py-2">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                onChange={() => handleCheckboxChange(item)}
                                            />
                                            <img
                                                src={item.link}
                                                alt={item.hoaDonCT.sanPhamCT.sanPham.ten}
                                                className="w-12 h-12 mr-2"
                                            />
                                            <span>
                                                {item.hoaDonCT.sanPhamCT.sanPham.ten} [
                                                {item.hoaDonCT.sanPhamCT.trongLuong.ten}]
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center">
                                                <span className="px-2">{item.hoaDonCT.soLuong} </span>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            {priceInfo.promotion ? (
                                                <>
                                                    <span className="text-red-500 mr-2">
                                                        {priceInfo.discountedPrice.toLocaleString()} đ
                                                    </span>
                                                    <span className="line-through text-gray-400">
                                                        {priceInfo.originalPrice.toLocaleString()} đ
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{priceInfo.originalPrice.toLocaleString()} đ</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">
                                    Không có sản phẩm nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex">
                <div className="w-2/3 border rounded-lg p-4 mr-4">
                    <h2 className="font-bold mb-2">Danh sách sản phẩm trả</h2>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left whitespace-nowrap">Sản phẩm</th>
                                <th className="text-left whitespace-nowrap">Số lượng</th>
                                <th className="text-left whitespace-nowrap">Tổng</th>
                                <th className="text-left whitespace-nowrap">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <img
                                            src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-illustration-download-in-svg-png-gif-file-formats--missing-error-business-pack-illustrations-8019228.png?f=webp"
                                            alt="No data found"
                                            className="mx-auto mb-2 w-[200px] h-[200px]"
                                        />
                                        <span>No Data Found</span>
                                    </td>
                                </tr>
                            ) : (
                                returnItems.map((item, index) => {
                                    // Lấy thông tin giá từ productPrices
                                    const priceInfo = productPrices[item.hoaDonCT.sanPhamCT.id] || {
                                        originalPrice: item.hoaDonCT.giaBan,
                                        discountedPrice: item.hoaDonCT.giaBan,
                                        promotion: null,
                                    };

                                    return (
                                        <tr key={index}>
                                            <td className="whitespace-nowrap">
                                                {item.hoaDonCT.sanPhamCT.sanPham.ten}[
                                                {item.hoaDonCT.sanPhamCT.trongLuong.ten}]
                                            </td>
                                            <td className="whitespace-nowrap text-center">{item.hoaDonCT.soLuong}</td>
                                            <td className="whitespace-nowrap">
                                                {priceInfo.promotion ? (
                                                    <div>
                                                        <span className="text-red-500 mr-2">
                                                            {(
                                                                item.hoaDonCT.soLuong * priceInfo.discountedPrice
                                                            ).toLocaleString()}{' '}
                                                            đ
                                                        </span>
                                                        <span className="line-through text-gray-400">
                                                            {(
                                                                item.hoaDonCT.soLuong * priceInfo.originalPrice
                                                            ).toLocaleString()}{' '}
                                                            đ
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>
                                                        {(
                                                            item.hoaDonCT.soLuong * priceInfo.originalPrice
                                                        ).toLocaleString()}{' '}
                                                        đ
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    placeholder="Ghi chú"
                                                    className="border rounded p-1"
                                                    style={{ width: '150px', height: '40px' }}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="w-1/3 border rounded-lg p-4 bg-gray-100">
                    <h2 className="font-bold text-green-600 mb-2">Thông tin hoàn trả</h2>
                    <div className="mb-2 font-bold">
                        <i className="fas fa-user mr-2"></i>
                        <span>Khách hàng:</span>
                        <span className="ml-2">Nguyen Van A</span>
                    </div>
                    <div className="mb-2 font-bold">
                        <i className="fas fa-user mr-2"></i>
                        <span>Người nhận:</span>
                        <span className="ml-2">{bills.tenNguoiNhan}</span>
                    </div>
                    <div className="mb-2 font-bold">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <span>Địa chỉ:</span>
                        <span className="ml-2">{bills.diaChiNguoiNhan}</span>
                    </div>
                    <div className="mb-2">
                        <span>Tổng tiền</span>
                        <span className="float-right">
                            {returnItems.length > 0 ? calculateTotalReturnPrice().toLocaleString() : '0'} đ
                        </span>
                    </div>
                    <div className="mb-2">
                        <span>Giảm giá</span>
                        <span className="float-right text-red-600">{calculateDiscountAmount().toLocaleString()} ₫</span>
                    </div>
                    <div className="mb-2">
                        <div className="mb-2">
                            <span>Số tiền hoàn trả</span>
                            <span className="float-right">{calculateRefundAmount().toLocaleString()} ₫</span>
                        </div>
                    </div>
                    <button className="w-full bg-[#2f19ae] text-white py-2 rounded" onClick={handleReturnOrder}>
                        TRẢ HÀNG
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReturnOrder;
