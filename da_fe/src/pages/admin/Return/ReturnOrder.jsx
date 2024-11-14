import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function ReturnOrder() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const orderId = query.get('orderId');
    const [orderDetails, setOrderDetails] = useState([]); // Chi tiết hóa đơn
    const [billDetails, setBillDetails] = useState([]);
    const [bills, setBills] = useState([]);
    const [returnItems, setReturnItems] = useState([]); // Danh sách sản phẩm trả

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
        } catch (error) {
            console.error('Failed to fetch BillDetails with images', error);
        }
    };

    useEffect(() => {
        loadBillDetailsWithImages(orderId);
    }, [orderId]);

    useEffect(() => {
        loadBillWithId(orderId);
    }, [orderId]);

    const handleQuantityChange = (index, change) => {
        const newOrderDetails = [...orderDetails];
        const currentQuantity = newOrderDetails[index].soLuong;
        if (change === 'increase' && currentQuantity < 4) {
            newOrderDetails[index].soLuong += 1;
        } else if (change === 'decrease' && currentQuantity > 0) {
            newOrderDetails[index].soLuong -= 1;
        }
        setOrderDetails(newOrderDetails);
    };

    const handleCheckboxChange = (item) => {
        if (returnItems.includes(item)) {
            setReturnItems(returnItems.filter((i) => i !== item));
        } else {
            setReturnItems([...returnItems, item]);
        }
    };

    const uniqueProductIds = new Set();

    const uniqueDetails = billDetails.filter((detail) => {
        // Kiểm tra xem chi tiết có thuộc hóa đơn đã chọn không
        if (detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === Number(orderId)) {
            const isUnique = !uniqueProductIds.has(detail.hoaDonCT.sanPhamCT.id); // Sử dụng id sản phẩm
            if (isUnique) {
                uniqueProductIds.add(detail.hoaDonCT.sanPhamCT.id); // Thêm id sản phẩm vào tập hợp
                return true; // Giữ lại chi tiết này
            }
        }
        return false; // Bỏ qua chi tiết này nếu không duy nhất hoặc không thuộc hóa đơn đã chọn
    });

    console.log(billDetails);

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
                        {(() => {
                            // Tạo một Set để lưu trữ các ID sản phẩm đã gặp
                            const uniqueProductIds = new Set();

                            // Lọc ra các chi tiết hóa đơn không bị trùng
                            const uniqueDetails = billDetails.filter((detail) => {
                                // Kiểm tra xem chi tiết có thuộc hóa đơn đã chọn không
                                if (detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === Number(orderId)) {
                                    const isUnique = !uniqueProductIds.has(detail.hoaDonCT.sanPhamCT.id); // Sử dụng id sản phẩm
                                    if (isUnique) {
                                        uniqueProductIds.add(detail.hoaDonCT.sanPhamCT.id); // Thêm id sản phẩm vào tập hợp
                                        return true; // Giữ lại chi tiết này
                                    }
                                }
                                return false; // Bỏ qua chi tiết này nếu không duy nhất hoặc không thuộc hóa đơn đã chọn
                            });
                            console.log('Order ID:', orderId);
                            console.log(uniqueDetails);

                            return uniqueDetails.length > 0 ? (
                                uniqueDetails.map((item, index) => (
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
                                                <AddCircleOutlineIcon
                                                    className="cursor-pointer text-[#2f19ae]"
                                                    onClick={() => handleQuantityChange(index, 'increase')}
                                                />
                                                <span className="px-2">{item.hoaDonCT.soLuong} / 4</span>
                                                <RemoveCircleOutlineIcon
                                                    className="cursor-pointer text-[#2f19ae]"
                                                    onClick={() => handleQuantityChange(index, 'decrease')}
                                                />
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            {(item.hoaDonCT.soLuong * item.hoaDonCT.giaBan).toLocaleString()} đ
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">
                                        Không có sản phẩm nào.
                                    </td>
                                </tr>
                            );
                        })()}
                    </tbody>
                </table>
            </div>
            <div className="flex">
                <div className="w-2/3 border rounded-lg p-4 mr-4">
                    <h2 className="font-bold mb-2">Danh sách sản phẩm trả</h2>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Sản phẩm</th>
                                <th className="text-left">Số lượng</th>
                                <th className="text-left">Đơn giá</th>
                                <th className="text-left">Tổng</th>
                                <th className="text-left">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <img
                                            src=" https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-illustration-download-in-svg-png-gif-file-formats--missing-error-business-pack-illustrations-8019228.png?f=webp"
                                            alt="No data found"
                                            className="mx-auto mb-2 w-[200px] h-[200px]"
                                        />
                                        <span>No Data Found</span>
                                    </td>
                                </tr>
                            ) : (
                                returnItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.soLuong}</td>
                                        <td>{item.price} ₫</td>
                                        <td>{item.soLuong * item.price} ₫</td>
                                        <td>
                                            <input type="text" placeholder="Ghi chú" className="border rounded p-1" />
                                        </td>
                                    </tr>
                                ))
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
                            {(() => {
                                const total = uniqueDetails.reduce(
                                    (acc, detail) => acc + detail.hoaDonCT.soLuong * detail.hoaDonCT.giaBan,
                                    0,
                                );
                                return total.toLocaleString();
                            })()}{' '}
                            đ
                        </span>
                    </div>
                    <div className="mb-2">
                        <span>Giảm giá</span>
                        <span className="float-right text-red-600">13.750 ₫</span>
                    </div>
                    <div className="mb-2">
                        <span>Số tiền hoàn trả</span>
                        <span className="float-right">
                            {returnItems.reduce((total, item) => total + item.soLuong * item.price, 0) - 13750} ₫
                        </span>
                    </div>
                    <button className="w-full bg-[#2f19ae] text-white py-2 rounded">TRẢ HÀNG</button>
                </div>
            </div>
        </div>
    );
}

export default ReturnOrder;
