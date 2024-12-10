import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import CartItem from '../Cart/CartItem';
import AddressCard from './AddressCard';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { useAddress } from './AddressContext';
import { CartContext } from '../Cart/CartContext';

const OrderSummary = () => {
    const [carts, setCarts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const { setCartItemCount } = useContext(CartContext);

    // Thêm state mới cho voucher
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

    const [shippingFee, setShippingFee] = useState(0);
    const navigate = useNavigate();
    const { selectedAddress } = useAddress();

    const [paymentMethod, setPaymentMethod] = useState('COD');

    // Hàm tải giỏ hàng
    const loadCarts = async (taiKhoanId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/gio-hang/with-images/${taiKhoanId}`);
            setCarts(response.data);
        } catch (error) {
            console.error('Failed to fetch Carts', error);
        }
    };

    // Hàm thay đổi số lượng sản phẩm trong giỏ hàng
    const handleQuantityChange = async (cartId, newQuantity) => {
        try {
            await axios.put(`http://localhost:8080/api/gio-hang/${cartId}/update-quantity`, null, {
                params: { quantity: newQuantity },
            });

            setCarts((prevCarts) =>
                prevCarts.map((cart) =>
                    cart.gioHang.id === cartId ? { ...cart, gioHang: { ...cart.gioHang, soLuong: newQuantity } } : cart,
                ),
            );
        } catch (error) {
            console.error('Failed to update quantity', error);
        }
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const handleDeleteCart = async (cartId) => {
        try {
            await axios.delete(`http://localhost:8080/api/gio-hang/${cartId}`);

            setCarts((prevCarts) => prevCarts.filter((cart) => cart.gioHang.id !== cartId));
            swal('Thành công!', 'Giỏ hàng đã được xóa!', 'success');
        } catch (error) {
            console.error('Failed to delete cart', error);
        }
    };

    // Hàm lấy sản phẩm đầu tiên của mỗi loại
    const getFirstCartItemPerProduct = (carts) => {
        const productMap = new Map();

        carts.forEach((cart) => {
            const productId = cart.gioHang.sanPhamCT.sanPham.id;
            if (!productMap.has(productId)) {
                productMap.set(productId, cart);
            }
        });

        return Array.from(productMap.values());
    };

    // Hàm tính tổng giá tiền
    const calculateTotalPrice = (firstCartItems) => {
        return firstCartItems.reduce((total, cart) => {
            const donGia = cart.gioHang.sanPhamCT.donGia * cart.gioHang.soLuong;
            return total + donGia;
        }, 0);
    };

    // Hàm tính tổng số lượng
    const calculateTotalQuantity = (firstCartItems) => {
        return firstCartItems.reduce((total, cart) => total + cart.gioHang.soLuong, 0);
    };

    const isVoucherValid = (voucher, totalPrice) => {
        // Kiểm tra điều kiện số tiền tối thiểu
        if (totalPrice < voucher.dieuKienNhoNhat) {
            swal(
                'Lưu ý!',
                `Voucher chỉ áp dụng cho đơn hàng từ ${voucher.dieuKienNhoNhat.toLocaleString()} ₫`,
                'warning',
            );
            return false;
        }

        // Tính toán số tiền giảm theo phần trăm
        const discountPercentage = voucher.giaTri / 100;
        const discountAmount = totalPrice * discountPercentage;

        // So sánh và trả về giá trị phù hợp
        return discountAmount > voucher.giaTriMax ? voucher.giaTriMax : discountAmount;
    };

    // Fetch vouchers
    const fetchVouchers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/voucher/hien-thi'); //sửa lại api vì lấy cả voucher kêt thúc
            setVouchers(response.data);
        } catch (error) {
            console.error('Failed to fetch vouchers', error);
        }
    };

    // Sửa lại hàm tính giảm giá
    const calculateDiscount = () => {
        if (!selectedVoucher) return 0;

        const discountAmount = isVoucherValid(selectedVoucher, totalPrice);

        // Nếu voucher không hợp lệ, trả về 0
        if (discountAmount === false) {
            setSelectedVoucher(null);
            return 0;
        }

        return discountAmount;
    };

    // Load dữ liệu ban đầu
    useEffect(() => {
        loadCarts(1);
        fetchVouchers();
    }, []);

    // Tính toán tổng tiền
    useEffect(() => {
        if (carts.length > 0) {
            const firstCartItems = getFirstCartItemPerProduct(carts);
            const totalPrice = calculateTotalPrice(firstCartItems);
            const totalQuantity = calculateTotalQuantity(firstCartItems);

            setTotalPrice(totalPrice);
            setTotalQuantity(totalQuantity);

            // Tính toán giảm giá từ voucher
            const voucherDiscount = calculateDiscount();
            const totalAmount = totalPrice - voucherDiscount + shippingFee;
            setTotalAmount(totalAmount);
        }
    }, [carts, selectedVoucher, shippingFee]);

    const handleVNPayPayment = async () => {
        try {
            // Tạo hóa đơn
            const hoaDonResponse = await axios.post('http://localhost:8080/api/hoa-don', {
                taiKhoan: { id: 1 }, //lấy tài khoản đang đăng nhập qua token Chi sửa lại nhe
                soLuong: totalQuantity,
                loaiHoaDon: 'Trực tuyến',
                phuongThucThanhToan: 'Thanh toán VNPay',
                tenNguoiNhan: selectedAddress?.ten,
                sdtNguoiNhan: selectedAddress?.sdt,
                emailNguoiNhan: selectedAddress?.taiKhoan.email,
                phiShip: shippingFee,
                tongTien: totalAmount,
                diaChiNguoiNhan: `${selectedAddress?.diaChiCuThe}, ${selectedAddress?.idXa}, ${selectedAddress?.idHuyen}, ${selectedAddress?.idTinh}`,
                ngayTao: new Date(),
                trangThai: 1, // Trạng thái chờ thanh toán
                maGiamGia: selectedVoucher ? selectedVoucher.ma : null,
            });

            const createdBill = hoaDonResponse.data;

            // Tạo mã hóa đơn
            const billCode = `HD${createdBill.id}`;
            await axios.put(`http://localhost:8080/api/hoa-don/${createdBill.id}`, {
                ...createdBill,
                ma: billCode,
            });

            // Tạo hóa đơn chi tiết
            const groupedCarts = carts.reduce((acc, cart) => {
                const sanPhamCTId = cart.gioHang.sanPhamCT.id;
                if (!acc[sanPhamCTId]) {
                    acc[sanPhamCTId] = {
                        sanPhamCT: cart.gioHang.sanPhamCT,
                        soLuong: cart.gioHang.soLuong,
                        giaBan: cart.gioHang.sanPhamCT.donGia,
                    };
                } else {
                    acc[sanPhamCTId].soLuong = cart.gioHang.soLuong; // Cộng dồn số lượng
                }
                return acc;
            }, {});

            // Giảm số lượng voucher CHỈ khi có voucher được chọn
            if (selectedVoucher) {
                // Kiểm tra điều kiện số tiền tối thiểu
                if (totalPrice < selectedVoucher.dieuKienNhoNhat) {
                    swal(
                        'Lưu ý!',
                        `Voucher chỉ áp dụng cho đơn hàng từ ${selectedVoucher.dieuKienNhoNhat.toLocaleString()} ₫`,
                        'warning',
                    );
                    return;
                }

                try {
                    await axios.put(
                        `http://localhost:8080/api/voucher/giam-so-luong/${selectedVoucher.id}`,
                        {},
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    );
                } catch (voucherError) {
                    // Nếu giảm voucher thất bại, hủy hóa đơn
                    await axios.delete(`http://localhost:8080/api/hoa-don/${createdBill.id}`);

                    console.error('Lỗi giảm voucher:', voucherError);
                    swal('Lỗi!', 'Không thể sử dụng mã giảm giá', 'error');
                    return;
                }
            }

            // Tạo hóa đơn chi tiết cho mỗi sản phẩm
            const hoaDonChiTietPromises = Object.values(groupedCarts).map(async (groupedCart) => {
                await axios.post('http://localhost:8080/api/hoa-don-ct', {
                    hoaDon: { id: createdBill.id },
                    sanPhamCT: groupedCart.sanPhamCT,
                    soLuong: groupedCart.soLuong,
                    giaBan: groupedCart.giaBan,
                    trangThai: 1, // Trạng thái chờ thanh toán
                });
            });

            await Promise.all(hoaDonChiTietPromises);

            // Gọi API VNPay để lấy URL thanh toán
            const paymentResponse = await axios.get('http://localhost:8080/api/v1/payment/vn-pay', {
                params: {
                    amount: totalAmount,
                    orderInfo: `Thanh toan don hang ${billCode}`,
                    orderType: 'other',
                },
            });

            console.log('paymentResponse', createdBill.id);

            //Thêm thanh toán
            await axios.post('http://localhost:8080/api/thanh-toan', {
                taiKhoan: { id: 1 },
                hoaDon: { id: createdBill.id },
                ma: null,
                tongTien: totalAmount,
                phuongThucThanhToan: 'Thanh toán ngay',
                ngayTao: new Date(),
                trangThai: 1,
            });

            // Thêm lịch sử đơn hàng
            await axios.post('http://localhost:8080/api/lich-su-don-hang', {
                taiKhoan: { id: 1 },
                hoaDon: { id: createdBill.id },
                moTa: 'Đơn hàng đã được tạo',
                ngayTao: new Date(),
                trangThai: 1, // Trạng thái chờ thanh toán
            });

            // Chuyển hướng đến URL thanh toán của VNPay
            window.location.href = paymentResponse.data.data.paymentUrl;
        } catch (error) {
            console.error('VNPay Payment error', error);
            swal('Lỗi!', 'Thanh toán VNPay thất bại', 'error');
        }
    };

    // Xử lý thanh toán
    const handleCODPayment = async () => {
        try {
            // Tạo hóa đơn
            const hoaDonResponse = await axios.post('http://localhost:8080/api/hoa-don', {
                taiKhoan: { id: 1 },
                idVoucher: selectedVoucher.id,
                soLuong: totalQuantity,
                loaiHoaDon: 'Trực tuyến',
                phuongThucThanhToan: 'Thanh toán khi nhận hàng',
                tenNguoiNhan: selectedAddress?.ten,
                sdtNguoiNhan: selectedAddress?.sdt,
                emailNguoiNhan: selectedAddress?.taiKhoan.email,
                phiShip: shippingFee,
                tongTien: totalAmount,
                diaChiNguoiNhan: `${selectedAddress?.diaChiCuThe}, ${selectedAddress?.idXa}, ${selectedAddress?.idHuyen}, ${selectedAddress?.idTinh}`,
                ngayTao: new Date(),
                trangThai: 1,
                maGiamGia: selectedVoucher ? selectedVoucher.ma : null,
            });

            const createdBill = hoaDonResponse.data;

            // Tạo mã hóa đơn
            const billCode = `HD${createdBill.id}`;
            await axios.put(`http://localhost:8080/api/hoa-don/${createdBill.id}`, {
                ...createdBill,
                ma: billCode,
            });

            // Giảm số lượng voucher CHỈ khi có voucher được chọn
            if (selectedVoucher) {
                // Kiểm tra điều kiện số tiền tối thiểu
                if (totalPrice < selectedVoucher.dieuKienNhoNhat) {
                    swal(
                        'Lưu ý!',
                        `Voucher chỉ áp dụng cho đơn hàng từ ${selectedVoucher.dieuKienNhoNhat.toLocaleString()} ₫`,
                        'warning',
                    );
                    return;
                }

                try {
                    await axios.put(
                        `http://localhost:8080/api/voucher/giam-so-luong/${selectedVoucher.id}`,
                        {},
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    );
                } catch (voucherError) {
                    // Nếu giảm voucher thất bại, hủy hóa đơn
                    await axios.delete(`http://localhost:8080/api/hoa-don/${createdBill.id}`);

                    console.error('Lỗi giảm voucher:', voucherError);
                    swal('Lỗi!', 'Không thể sử dụng mã giảm giá', 'error');
                    return;
                }
            }

            // Tạo hóa đơn chi tiết
            const groupedCarts = carts.reduce((acc, cart) => {
                const sanPhamCTId = cart.gioHang.sanPhamCT.id;
                if (!acc[sanPhamCTId]) {
                    acc[sanPhamCTId] = {
                        sanPhamCT: cart.gioHang.sanPhamCT,
                        soLuong: cart.gioHang.soLuong,
                        giaBan: cart.gioHang.sanPhamCT.donGia,
                    };
                } else {
                    acc[sanPhamCTId].soLuong = cart.gioHang.soLuong; // Cộng dồn số lượng
                }
                return acc;
            }, {});

            // Tạo hóa đơn chi tiết cho mỗi sản phẩm
            await Promise.all(
                Object.values(groupedCarts).map(async (groupedCart) => {
                    await axios.post('http://localhost:8080/api/hoa-don-ct', {
                        hoaDon: { id: createdBill.id },
                        sanPhamCT: groupedCart.sanPhamCT,
                        soLuong: groupedCart.soLuong,
                        giaBan: groupedCart.giaBan,
                        trangThai: 1,
                    });

                    // Cập nhật số lượng sản phẩm
                    const newQuantity = groupedCart.sanPhamCT.soLuong - groupedCart.soLuong;
                    await axios.put(`http://localhost:8080/api/san-pham-ct/${groupedCart.sanPhamCT.id}`, {
                        ...groupedCart.sanPhamCT,
                        soLuong: newQuantity,
                    });
                }),
            );

            // Xóa giỏ hàng của người dùng
            await axios.delete(`http://localhost:8080/api/gio-hang/tai-khoan/1`);

            // Thêm lịch sử đơn hàng
            const lichSuDonHang = {
                taiKhoan: { id: 1 }, // Thay đổi ID này nếu cần
                hoaDon: { id: createdBill.id },
                moTa: 'Đơn hàng đã được tạo',
                ngayTao: new Date(),
                trangThai: 1, // Trạng thái hóa đơn là 1
            };

            await axios.post('http://localhost:8080/api/lich-su-don-hang', lichSuDonHang);

            swal('Thành công!', 'Thanh toán thành công', 'success');
            setCartItemCount(0);
            navigate('/');
        } catch (error) {
            console.error('Thanh toán thất bại', error);
            swal('Lỗi!', 'Thanh toán thất bại', 'error');
        }
    };

    useEffect(() => {
        console.log('selectedVoucher', selectedVoucher);
    }, [selectedVoucher]);

    // Hàm xử lý thanh toán chung
    const handlePayment = () => {
        if (paymentMethod === 'COD') {
            handleCODPayment();
        } else if (paymentMethod === 'VNPAY') {
            handleVNPayPayment();
        }
    };

    // Thêm hàm tính phí vận chuyển vào component OrderSummary
    const calculateShippingFee = async () => {
        // Kiểm tra xem địa chỉ đã được chọn đầy đủ chưa
        if (!selectedAddress) return;

        try {
            // Gọi API GHN để lấy ID của tỉnh, huyện, xã
            const provincesResponse = await axios.get(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
                {
                    headers: { Token: '04ae91c9-b3a5-11ef-b074-aece61c107bd' },
                },
            );
            const province = provincesResponse.data.data.find((p) => p.ProvinceName === selectedAddress.idTinh);

            const districtsResponse = await axios.get(
                `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${province.ProvinceID}`,
                {
                    headers: { Token: '04ae91c9-b3a5-11ef-b074-aece61c107bd' },
                },
            );
            const district = districtsResponse.data.data.find((d) => d.DistrictName === selectedAddress.idHuyen);

            const wardsResponse = await axios.get(
                `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${district.DistrictID}`,
                {
                    headers: { Token: '04ae91c9-b3a5-11ef-b074-aece61c107bd' },
                },
            );
            const ward = wardsResponse.data.data.find((w) => w.WardName === selectedAddress.idXa);

            // Tính tổng trọng lượng sản phẩm
            const totalWeight = getFirstCartItemPerProduct(carts).reduce((total, cart) => {
                return total + (cart.gioHang.sanPhamCT.trongLuong || 0) * cart.gioHang.soLuong;
            }, 0);

            // Gọi API tính phí vận chuyển
            const feeResponse = await axios.post(
                'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                {
                    service_type_id: 53321, // Dịch vụ giao hàng nhanh
                    from_district_id: 1542, // Quận/huyện gửi hàng (bạn cần thay đổi)
                    from_ward_code: '11007', // Phường/xã gửi hàng (bạn cần thay đổi)
                    to_district_id: 1245,
                    to_ward_code: ward.WardCode,
                    weight: Math.max(totalWeight, 200), // Trọng lượng tối thiểu 200g
                    service_id: null, // Để GHN tự động chọn dịch vụ phù hợp
                    height: 20, // Chiều cao (cm)
                    length: 30, // Chiều dài (cm)
                    width: 20, // Chiều rộng (cm)
                },
                {
                    headers: {
                        Token: '04ae91c9-b3a5-11ef-b074-aece61c107bd',
                        ShopId: 5505325, // ShopId của bạn
                    },
                },
            );

            // Cập nhật phí vận chuyển
            setShippingFee(feeResponse.data.data.total || 0);
        } catch (error) {
            console.error('Lỗi tính phí vận chuyển:', error);
            setShippingFee(25000);
        }
    };

    // Gọi hàm tính phí vận chuyển khi địa chỉ hoặc giỏ hàng thay đổi
    useEffect(() => {
        if (selectedAddress && carts.length > 0) {
            calculateShippingFee();
        }
    }, [selectedAddress, carts]);

    const VoucherModal = () => {
        if (!isVoucherModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="relative bg-white rounded-lg w-[600px] p-6">
                    <button
                        onClick={() => setIsVoucherModalOpen(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <h2 className="text-xl font-bold mb-4">Chọn Phiếu Giảm Giá</h2>
                    <div className="space-y-4">
                        {vouchers.map((voucher) => {
                            // Kiểm tra điều kiện voucher trước khi hiển thị
                            const isEligible = totalPrice >= voucher.dieuKienNhoNhat;

                            return (
                                <div
                                    key={voucher.id}
                                    className={`border p-4 rounded cursor-pointer ${
                                        isEligible ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                    onClick={() => {
                                        if (isEligible) {
                                            setSelectedVoucher(voucher);
                                            setIsVoucherModalOpen(false);
                                        }
                                    }}
                                >
                                    <div className="flex justify-between">
                                        <span className="font-bold">{voucher.ma}</span>
                                        <span className="text-green-600">Giảm {voucher.giaTri}%</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Hiệu lực: {new Date(voucher.ngayBatDau).toLocaleDateString()} -
                                        {new Date(voucher.ngayKetThuc).toLocaleDateString()}
                                    </div>
                                    {!isEligible && (
                                        <div className="text-xs text-red-500 mt-2">
                                            Áp dụng cho đơn hàng từ {voucher.dieuKienNhoNhat.toLocaleString()} ₫
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-5">
            <div className="p-5 shadow-lg rounded-md border">
                <AddressCard address={selectedAddress} />
            </div>

            <div className="lg:grid grid-cols-3 relative justify-between">
                <div className="lg:col-span-2 ">
                    <div className="space-y-3">
                        {getFirstCartItemPerProduct(carts).map((cart) => (
                            <CartItem
                                key={cart.gioHang.id}
                                showButton={true}
                                cart={cart}
                                onQuantityChange={handleQuantityChange}
                                onDeleteCart={handleDeleteCart}
                            />
                        ))}
                    </div>
                </div>
                <div className="sticky top-0 h-[100vh] mt-5 lg:mt-0 ml-5">
                    <div className="border p-5 bg-white shadow-lg rounded-md">
                        <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
                        <div className="flex items-center space-x-2 mb-4">
                            <input
                                type="text"
                                placeholder="Nhập mã giảm giá"
                                value={selectedVoucher ? selectedVoucher.ma : ''}
                                readOnly
                                className="flex-1 border p-2 rounded"
                            />
                            <Button
                                variant="contained"
                                onClick={() => setIsVoucherModalOpen(true)}
                                sx={{ backgroundColor: '#2f19ae' }}
                            >
                                Chọn
                            </Button>
                        </div>
                        <hr />
                        <div className="space-y-3 font-semibold">
                            <div className="flex justify-between pt-3 text-black">
                                <span>Tiền hàng</span>
                                <span>{totalPrice.toLocaleString()} ₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Giảm giá</span>
                                <span className="text-green-700">-{calculateDiscount().toLocaleString()} ₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-700">
                                    {shippingFee === 0 ? 'Free' : `${shippingFee} ₫`}
                                </span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Tổng tiền</span>
                                <span className="text-green-700">{totalAmount.toLocaleString()} ₫</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-col space-y-4 mt-4">
                                <label className="flex items-center border p-4 rounded-md cursor-pointer w-full">
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="mr-2"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                    />
                                    <img
                                        src="https://freeiconshop.com/wp-content/uploads/edd/creditcard-flat.png"
                                        alt="Cash on Delivery"
                                        className="mr-2 w-8 h-8 rounded-full object-cover"
                                    />
                                    <span>Thanh toán khi nhận hàng</span>
                                </label>
                                <label className="flex items-center border p-4 rounded-md cursor-pointer w-full">
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="mr-2"
                                        checked={paymentMethod === 'VNPAY'}
                                        onChange={() => setPaymentMethod('VNPAY')}
                                    />
                                    <img
                                        src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                                        alt="VNPay"
                                        className="mr-2 w-8 h-8 rounded-full object-cover"
                                    />
                                    <span>Thanh toán ngay</span>
                                </label>
                            </div>
                        </div>

                        <Button
                            onClick={handlePayment}
                            variant="contained"
                            type="submit"
                            sx={{ padding: '.8rem 2rem', marginTop: '2rem', width: '100%', backgroundColor: '#2f19ae' }}
                        >
                            Payment
                        </Button>
                    </div>
                </div>
            </div>

            <VoucherModal />
        </div>
    );
};

export default OrderSummary;
