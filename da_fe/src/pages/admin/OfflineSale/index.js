import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import swal from 'sweetalert';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import Swal from 'sweetalert2';

function OfflineSale() {
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // State cho sản phẩm đã chọn\
    const [billDetails, setBillDetails] = useState([]);
    const [quantity, setQuantity] = useState(0);

    const [shippingFee, setShippingFee] = useState(0); // Phí vận chuyển
    const [discount, setDiscount] = useState(0); // Giảm giá
    const [customerPayment, setCustomerPayment] = useState(0); // Khách thanh toán

    const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái modal
    const [deleteDetail, setDeleteDetail] = useState(null); // Lưu lại chi tiết để xóa

    // States for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');
    const [weightFilter, setWeightFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');

    const calculateTotal = () => {
        // Lọc ra các sản phẩm không trùng lặp dựa trên `sanPhamCT.id`
        const uniqueBillDetails = billDetails
            .filter((detail) => detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === selectedBill.id)
            .reduce((acc, detail) => {
                const isDuplicate = acc.some((item) => item.hoaDonCT.sanPhamCT.id === detail.hoaDonCT.sanPhamCT.id);
                if (!isDuplicate) {
                    acc.push(detail);
                }
                return acc;
            }, []);

        // Tính tổng tiền cho các sản phẩm không bị trùng
        const productTotal = uniqueBillDetails.reduce(
            (total, detail) => total + detail.hoaDonCT.soLuong * detail.hoaDonCT.giaBan,
            0,
        );

        // Tính tổng tiền bao gồm phí vận chuyển và giảm giá
        return productTotal + shippingFee - discount;
    };

    const loadBills = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/hoa-don');
            setBills(response.data);
        } catch (error) {
            console.error('Failed to fetch bills', error);
        }
    };

    const loadProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/san-pham-ct/with-images');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch Products', error);
        }
    };

    useEffect(() => {
        loadBills();
        loadProducts();
    }, []);

    const handleAddBillDetail = async (values) => {
        const newBillDetail = {
            sanPhamCT: {
                id: values.sanPhamCTId,
            },
            hoaDon: {
                id: values.hoaDonId,
            },
            soLuong: values.soLuong,
            giaBan: values.giaBan,
            trangThai: values.trangThai === '1' ? 1 : 0,
        };

        try {
            await axios.post('http://localhost:8080/api/hoa-don-ct', newBillDetail);
            swal('Thành công!', 'Chi tiết hóa đơn đã được thêm!', 'success');
            setQuantity(0);
            setShowQuantityModal(false);

            // Cập nhật chi tiết hóa đơn cho hóa đơn hiện tại
            await loadBillDetailsWithImages(values.hoaDonId);
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm chi tiết hóa đơn!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm chi tiết hóa đơn!', 'error');
        }
    };

    const handleProductModal = () => {
        setShowProductModal(true);
    };

    const handleCloseProductModal = () => {
        setShowProductModal(false);
    };

    const handleQuantityModal = (product) => {
        // Nhận sản phẩm đã chọn
        setSelectedProduct(product); // Cập nhật sản phẩm đã chọn
        setShowQuantityModal(true);
    };
    const openDeleteModal = (detail) => {
        setDeleteDetail(detail); // Gán hóa đơn chi tiết vào state
        setIsModalOpen(true); // Mở modal
    };

    const confirmDelete = () => {
        if (deleteDetail) {
            handleDelete(deleteDetail); // Gọi hàm xóa khi xác nhận
            setIsModalOpen(false); // Đóng modal sau khi xóa
            setDeleteDetail(null); // Reset lại detail sau khi xóa
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false); // Đóng modal khi hủy
        setDeleteDetail(null); // Reset lại detail khi hủy
    };

    const handleAddBill = async (values) => {
        if (bills.length >= 6) {
            swal('Thất bại!', 'Chỉ được tạo tối đa 6 hóa đơn!', 'warning');
            return;
        }

        const newBill = {
            ten: values.billName,
            trangThai: values.status === '1' ? 1 : 0,
        };

        try {
            await axios.post('http://localhost:8080/api/hoa-don', newBill);
            swal('Thành công!', 'Hóa đơn đã được thêm!', 'success');

            loadBills();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm hóa đơn!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm hóa đơn!', 'error');
        }
    };

    const handleDelete = async (detail) => {
        try {
            await axios.delete(`http://localhost:8080/api/hoa-don-ct/${detail.id}`);

            // Update the state after the deletion
            setBillDetails((prevDetails) => prevDetails.filter((d) => d.hoaDonCT.id !== detail.id));

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

            // Update the bill details after the API call
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

            // Update the bill details after the API call
            setBillDetails((prevDetails) =>
                prevDetails.map((d) => (d.hoaDonCT.id === detail.hoaDonCT.id ? { ...d, hoaDonCT: updatedDetail } : d)),
            );
        } catch (error) {
            console.error('Có lỗi xảy ra khi tăng số lượng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi tăng số lượng!', 'error');
        }
    };

    const confirmPurchase = async (hoaDonId) => {
        try {
            const response = await fetch('http://localhost:8080/api/hoa-don-ct/confirm-purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hoaDonId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text(); // Nhận chuỗi phản hồi từ server

            // Hiển thị thông báo xác nhận thanh toán thành công
            Swal.fire({
                title: 'Thanh toán thành công!',
                text: data, // Dữ liệu trả về từ server
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                // Sau khi người dùng nhấn "OK", gọi hàm để xóa hóa đơn
                handleDeleteBill(hoaDonId); // Sử dụng hàm handleDeleteBill để xóa hóa đơn
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Hàm handleDeleteBill đã có, cập nhật lại danh sách hóa đơn trong UI
    const handleDeleteBill = async (billId) => {
        try {
            await axios.delete(`http://localhost:8080/api/hoa-don/${billId}`);

            // Remove the deleted bill from the list in state
            setBills((prevBills) => prevBills.filter((bill) => bill.id !== billId));

            // Optional: Reset UI nếu bạn muốn trở về trạng thái ban đầu
            setSelectedBill(null); // Nếu bạn có một state đang lưu hóa đơn được chọn
        } catch (error) {
            console.error('Có lỗi xảy ra khi xóa hóa đơn!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi xóa hóa đơn!', 'error');
        }
    };

    // Filtering products based on search and filter criteria
    const filteredProducts = products.filter((product) => {
        const matchesSearchTerm = product.sanPhamTen.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = brandFilter ? product.thuongHieuTen === brandFilter : true;
        const matchesColor = colorFilter ? product.mauSacTen === colorFilter : true;
        const matchesWeight = weightFilter ? product.trongLuongTen === weightFilter : true;
        const matchesPrice = priceFilter ? product.donGia <= priceFilter : true;

        return matchesSearchTerm && matchesBrand && matchesColor && matchesWeight && matchesPrice;
    });

    console.log(billDetails);

    const loadBillDetailsWithImages = async (hoaDonId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/hoa-don-ct/with-images/${hoaDonId}`);
            setBillDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch BillDetails with images', error);
        }
    };

    const handleBillClick = (bill) => {
        setSelectedBill(bill);
        loadBillDetailsWithImages(bill.id);
    };
    return (
        <div className="h-[500px] flex justify-between items-start p-4">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="font-bold text-xl">Bán hàng</h1>
                    <button
                        className="bg-[#2f19ae] text-white py-2 px-4 rounded-md flex items-center"
                        onClick={() => handleAddBill({ billName: 'Hóa đơn mới', status: '1' })}
                    >
                        <AddIcon style={{ fontSize: 19 }} className="mr-2" />
                        Thêm hóa đơn
                    </button>
                </div>

                {bills.length > 0 ? (
                    <div className="flex items-center border-b-2 border-gray-200 mb-4">
                        {bills.map((bill) => (
                            <div
                                key={bill.id}
                                className={`flex items-center mr-4 cursor-pointer ${
                                    selectedBill?.id === bill.id ? 'border-b-2 border-blue-800 pb-2 text-blue-500' : ''
                                }`}
                                onClick={() => handleBillClick(bill)}
                            >
                                <span className="text-sm text-gray-700">
                                    Hóa đơn {bill.id} - {bill.ten}
                                    <ShoppingCartIcon style={{ fontSize: 18 }} className="mr-2" />
                                </span>
                                {/* Red 'X' icon for deleting the bill */}
                                <span
                                    className="text-red-500 ml-2 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering handleBillClick
                                        handleDeleteBill(bill.id); // Handle delete
                                    }}
                                >
                                    <CloseIcon style={{ fontSize: 18 }} />
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-4">
                        <span className="text-gray-500 text-[50px] mt-[200px]">No data found</span>
                    </div>
                )}

                {selectedBill && (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-blue-700">Sản phẩm</h2>
                            <div className="flex space-x-2">
                                <button className="border border-blue-950 text-blue-900 px-2 py-1 rounded">
                                    QUÉT QR SẢN PHẨM
                                </button>
                                <button
                                    className="border border-blue-950 text-blue-900 px-2 py-1 rounded"
                                    onClick={handleProductModal}
                                >
                                    THÊM SẢN PHẨM
                                </button>
                            </div>
                        </div>
                        <hr className="border-gray-300 mb-4" />

                        {selectedBill && (
                            <div className="mt-4">
                                {/* Các chi tiết hóa đơn */}
                                {(() => {
                                    // Tạo một Set để lưu trữ các ID sản phẩm đã gặp
                                    const uniqueProductIds = new Set();
                                    // Lọc ra các chi tiết hóa đơn không bị trùng
                                    const uniqueDetails = billDetails
                                        .filter(
                                            (detail) =>
                                                detail.hoaDonCT && detail.hoaDonCT.hoaDon.id === selectedBill.id,
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
                                            {uniqueDetails.map((detail) => (
                                                <div
                                                    key={detail.hoaDonCT.id}
                                                    className="flex items-center border-b py-4"
                                                >
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
                                                            className="border border-gray-300 px-2 py-1"
                                                            onClick={() => decreaseQuantity(detail)}
                                                        >
                                                            {' - '}
                                                        </button>
                                                        <span className="mx-2">{detail.hoaDonCT.soLuong}</span>
                                                        <button
                                                            className="border border-gray-300 px-2 py-1"
                                                            onClick={() => increaseQuantity(detail)}
                                                        >
                                                            {' + '}
                                                        </button>
                                                    </div>
                                                    <div className="text-red-500 font-bold ml-8">
                                                        {(
                                                            detail.hoaDonCT.soLuong * detail.hoaDonCT.giaBan
                                                        ).toLocaleString()}{' '}
                                                        VND
                                                    </div>
                                                    <button
                                                        className="ml-4 text-red-500"
                                                        onClick={() => openDeleteModal(detail.hoaDonCT)}
                                                    >
                                                        <TrashIcon className="w-5" />
                                                    </button>
                                                </div>
                                            ))}

                                            {isModalOpen && (
                                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <div className="bg-white p-6 rounded shadow-lg">
                                                        <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
                                                        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                                                        <div className="flex justify-end mt-4">
                                                            <button
                                                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                                                onClick={confirmDelete}
                                                            >
                                                                Có
                                                            </button>
                                                            <button
                                                                className="bg-gray-300 px-4 py-2 rounded"
                                                                onClick={cancelDelete}
                                                            >
                                                                Không
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Phần khách hàng và thanh toán */}
                                            <div className="max-w-full p-4 bg-white mt-20">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h1 className="text-2xl font-bold text-blue-700">Khách hàng</h1>
                                                    <button className="bg-[#2f19ae] text-white px-4 py-2 rounded flex items-center">
                                                        <i className="fas fa-user mr-2"></i> CHỌN KHÁCH HÀNG
                                                    </button>
                                                </div>
                                                <hr className="border-gray-300 my-2" />
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex-1">
                                                        <label className="block text-gray-700">Tên Khách hàng</label>
                                                    </div>
                                                    <div className="flex justify-center flex-1">
                                                        <span className="bg-gray-200 px-4 py-2 rounded">khách lẻ</span>
                                                    </div>
                                                    <div className="flex items-center flex-1 justify-end">
                                                        <label className="block text-gray-700 mr-2">Giao hàng</label>
                                                        <input type="checkbox" className="toggle-checkbox" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end mb-6">
                                                    <div className="w-[202px] pr-2">
                                                        <input
                                                            type="text"
                                                            className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed w-full"
                                                            placeholder="Phiếu giảm giá"
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="w-[202px] pl-2">
                                                        <input
                                                            type="text"
                                                            className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed w-full"
                                                            placeholder="Phần trăm giảm"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                                {/* Phí vận chuyển, Giảm giá và Tổng số tiền */}
                                                <div className="mb-4 flex flex-col items-end space-y-4">
                                                    {/* Tiền hàng */}
                                                    <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700">Tiền hàng:</span>
                                                        <div className="text-gray-500 font-bold ml-4">
                                                            {uniqueDetails
                                                                .reduce(
                                                                    (acc, detail) =>
                                                                        acc +
                                                                        detail.hoaDonCT.soLuong *
                                                                            detail.hoaDonCT.giaBan,
                                                                    0,
                                                                )
                                                                .toLocaleString()}{' '}
                                                            VND
                                                        </div>
                                                    </div>

                                                    {/* Phí vận chuyển */}
                                                    <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700">Phí vận chuyển:</span>
                                                        <input
                                                            type="number"
                                                            value={shippingFee}
                                                            onChange={(e) =>
                                                                setShippingFee(parseFloat(e.target.value) || 0)
                                                            }
                                                            className="ml-4 px-2 py-1 rounded"
                                                        />
                                                    </div>

                                                    {/* Giảm giá */}
                                                    <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700">Giảm giá:</span>
                                                        <input
                                                            type="number"
                                                            value={discount}
                                                            onChange={(e) =>
                                                                setDiscount(parseFloat(e.target.value) || 0)
                                                            }
                                                            className="ml-4 px-2 py-1 rounded"
                                                        />
                                                    </div>

                                                    {/* Tổng số tiền */}
                                                    <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700 font-bold">Tổng số tiền:</span>
                                                        <span className="ml-4 text-red-500 font-bold">
                                                            {(() => {
                                                                const total =
                                                                    uniqueDetails.reduce(
                                                                        (acc, detail) =>
                                                                            acc +
                                                                            detail.hoaDonCT.soLuong *
                                                                                detail.hoaDonCT.giaBan,
                                                                        0,
                                                                    ) +
                                                                    shippingFee -
                                                                    discount;
                                                                return total.toLocaleString();
                                                            })()}{' '}
                                                            VND
                                                        </span>
                                                    </div>

                                                    {/* Khách thanh toán */}
                                                    <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700 font-bold">
                                                            Khách thanh toán:
                                                        </span>
                                                        <input
                                                            type="number"
                                                            value={customerPayment}
                                                            onChange={(e) =>
                                                                setCustomerPayment(parseFloat(e.target.value) || 0)
                                                            }
                                                            className="ml-4 border border-gray-300 px-2 py-1 rounded"
                                                        />
                                                    </div>

                                                    <div className="flex justify-between w-full max-w-[400px] mb-2">
                                                        <span className="text-gray-700 font-bold">Tiền thừa:</span>
                                                        <span className="ml-4 text-red-500 font-bold">
                                                            {(() => {
                                                                const total =
                                                                    uniqueDetails.reduce(
                                                                        (acc, detail) =>
                                                                            acc +
                                                                            detail.hoaDonCT.soLuong *
                                                                                detail.hoaDonCT.giaBan,
                                                                        0,
                                                                    ) +
                                                                    shippingFee -
                                                                    discount;
                                                                const payment = parseFloat(customerPayment) || 0;
                                                                const change = payment - total;
                                                                return change > 0 ? change.toLocaleString() : '0';
                                                            })()}{' '}
                                                            VND
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end">
                                                    <button
                                                        className="bg-[#2f19ae] text-white px-4 py-2 rounded flex items-center"
                                                        onClick={() => confirmPurchase(selectedBill.id)}
                                                    >
                                                        XÁC NHẬN MUA HÀNG
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-500 font-semibold text-center py-4 text-[50px] mt-[100px]">
                                            No data found
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Custom Modal for Products */}
            {showProductModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-md p-4 w-[1200px] max-h-[550px] overflow-y-auto relative">
                        <h2 className="text-xl font-bold text-center my-4">Thông tin sản phẩm</h2>

                        {/* Nút đóng nằm ở góc phải */}
                        <button
                            className="absolute top-4 right-4 text-blue-500 text-2xl"
                            onClick={handleCloseProductModal}
                        >
                            &times;
                        </button>

                        {/* Search and Filter Section */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Tìm tên sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <select
                                value={brandFilter}
                                onChange={(e) => setBrandFilter(e.target.value)}
                                className="border border-gray-300 rounded p-2"
                            >
                                <option value="">Tất cả thương hiệu</option>
                                <option value="Yonex">Yonex</option>
                                <option value="Lining">Lining</option>
                                <option value="Victor">Victor</option>
                                <option value="Mizuno">Mizuno</option>
                                <option value="Adidas">Adidas</option>
                            </select>

                            <select
                                value={colorFilter}
                                onChange={(e) => setColorFilter(e.target.value)}
                                className="border border-gray-300 rounded p-2"
                            >
                                <option value="">Tất cả màu sắc</option>
                                <option value="Đỏ">Đỏ</option>
                                <option value="Xanh">Xanh</option>
                                <option value="Trắng">Trắng</option>
                            </select>

                            <select
                                value={weightFilter}
                                onChange={(e) => setWeightFilter(e.target.value)}
                                className="border border-gray-300 rounded p-2"
                            >
                                <option value="">Tất cả trọng lượng</option>
                                <option value="2U">2U</option>
                                <option value="3U">3U</option>
                                <option value="3U">4U</option>
                                <option value="5U">5U</option>
                                <option value="6U">6U</option>
                            </select>

                            <select
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="border border-gray-300 rounded p-2"
                            >
                                <option value="">Tất cả giá</option>
                                <option value="1000000">Dưới 1 triệu</option>
                                <option value="3000000">Dưới 3 triệu</option>
                                <option value="5000000">Dưới 5 triệu</option>
                            </select>
                        </div>

                        {/* Products List */}
                        <div className="grid grid-cols-4 gap-4">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="border rounded p-2 relative">
                                    <img
                                        src={product.hinhAnhUrls[0]}
                                        alt={product.sanPhamTen}
                                        className="w-full h-[250px] object-cover mb-2"
                                    />
                                    <h3 className="font-semibold">{product.sanPhamTen}</h3>
                                    <p className="text-gray-500">Giá: {product.donGia.toLocaleString()} VND</p>
                                    <p className="text-gray-500">Số lượng: {product.soLuong}</p>
                                    <button
                                        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                                        onClick={() => handleQuantityModal(product)} // Gọi hàm với sản phẩm hiện tại
                                    >
                                        <AddIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Modal for Quantity */}
            {showQuantityModal && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-md p-4 w-[400px]">
                        <h2 className="text-xl font-bold text-center my-4">Chọn Số Lượng</h2>
                        <div className="mb-4">
                            <p className="font-semibold">{selectedProduct.sanPhamTen}</p>
                            <p className="text-gray-500">Giá: {selectedProduct.donGia.toLocaleString()} VND</p>
                            <p className="text-gray-500">Số lượng hiện có: {selectedProduct.soLuong}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Nhập số lượng:</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                max={selectedProduct.soLuong}
                                className="border border-gray-300 rounded p-2 w-full"
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                                onClick={() =>
                                    handleAddBillDetail({
                                        sanPhamCTId: selectedProduct.id,
                                        hoaDonId: selectedBill.id,
                                        soLuong: quantity,
                                        giaBan: selectedProduct.donGia,
                                        trangThai: '1',
                                    })
                                }
                            >
                                Thêm vào hóa đơn
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded ml-2"
                                onClick={() => {
                                    setShowQuantityModal(false);
                                    setSelectedProduct(null); // Reset sản phẩm đã chọn
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OfflineSale;
