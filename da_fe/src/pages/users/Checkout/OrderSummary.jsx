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

    const discount = 218000;
    const shippingFee = 0;

    const navigate = useNavigate();
    const { selectedAddress } = useAddress();

    const loadCarts = async (taiKhoanId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/gio-hang/with-images/${taiKhoanId}`);
            setCarts(response.data);
        } catch (error) {
            console.error('Failed to fetch Carts', error);
        }
    };

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

    const handleDeleteCart = async (cartId) => {
        try {
            await axios.delete(`http://localhost:8080/api/gio-hang/${cartId}`);

            setCarts((prevCarts) => prevCarts.filter((cart) => cart.gioHang.id !== cartId));
            swal('Thành công!', 'Giỏ hàng đã được xóa!', 'success');
        } catch (error) {
            console.error('Failed to delete cart', error);
        }
    };

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

    const calculateTotalPrice = (firstCartItems) => {
        return firstCartItems.reduce((total, cart) => {
            const donGia = cart.gioHang.sanPhamCT.donGia * cart.gioHang.soLuong;
            return total + donGia;
        }, 0);
    };

    const calculateTotalQuantity = (firstCartItems) => {
        return firstCartItems.reduce((total, cart) => total + cart.gioHang.soLuong, 0);
    };

    useEffect(() => {
        loadCarts(1);
    }, []);

    useEffect(() => {
        if (carts.length > 0) {
            const firstCartItems = getFirstCartItemPerProduct(carts);
            const totalPrice = calculateTotalPrice(firstCartItems);
            const totalQuantity = calculateTotalQuantity(firstCartItems);

            setTotalPrice(totalPrice);
            setTotalQuantity(totalQuantity);

            const totalAmount = totalPrice - discount + shippingFee;
            setTotalAmount(totalAmount);
        }
    }, [carts]);

    const handlePayment = async () => {
        try {
            const hoaDonResponse = await axios.post('http://localhost:8080/api/hoa-don', {
                taiKhoan: { id: 1 },
                soLuong: totalQuantity,
                loaiHoaDon: 'Trực tuyến',
                phuongThucThanhToan: 'Thanh toán khi nhận hàng',
                tenNguoiNhan: selectedAddress?.ten,
                sdtNguoiNhan: selectedAddress?.sdt,
                emailNguoiNhan: selectedAddress?.taiKhoan.email,
                phiShip: 25000,
                tongTien: totalAmount,
                diaChiNguoiNhan: `${selectedAddress?.diaChiCuThe}, ${selectedAddress?.idXa}, ${selectedAddress?.idHuyen}, ${selectedAddress?.idTinh}`,
                ngayTao: new Date(),
                trangThai: 1,
            });
            const createdBill = hoaDonResponse.data;

            const billCode = `HD${createdBill.id}`;
            await axios.put(`http://localhost:8080/api/hoa-don/${createdBill.id}`, {
                ...createdBill,
                ma: billCode,
            });

            // Aggregate quantity by unique sanPhamCT ID
            const groupedCarts = carts.reduce((acc, cart) => {
                const sanPhamCTId = cart.gioHang.sanPhamCT.id;
                if (!acc[sanPhamCTId]) {
                    acc[sanPhamCTId] = { ...cart.gioHang, soLuong: cart.gioHang.soLuong };
                } else {
                    acc[sanPhamCTId].soLuong = cart.gioHang.soLuong; // Cộng dồn số lượng
                }
                return acc;
            }, {});

            // Create hoaDonCT records for each unique sanPhamCT
            await Promise.all(
                Object.values(groupedCarts).map(async (groupedCart) => {
                    await axios.post('http://localhost:8080/api/hoa-don-ct', {
                        hoaDon: { id: createdBill.id },
                        sanPhamCT: groupedCart.sanPhamCT,
                        soLuong: groupedCart.soLuong,
                        giaBan: groupedCart.sanPhamCT.donGia,
                        trangThai: 1,
                    });

                    // Cập nhật số lượng sản phẩm
                    const newQuantity = groupedCart.sanPhamCT.soLuong - groupedCart.soLuong; // Số lượng còn lại
                    await axios.put(`http://localhost:8080/api/san-pham-ct/${groupedCart.sanPhamCT.id}`, {
                        ...groupedCart.sanPhamCT,
                        soLuong: newQuantity, // Ghi đè số lượng mới
                    });
                }),
            );

            await axios.delete(`http://localhost:8080/api/gio-hang/tai-khoan/1`);

            swal('Thành công!', 'Thanh toán thành công', 'success');
            setCartItemCount(0);
            navigate('/');
        } catch (error) {
            console.error('Thanh toán thất bại', error);
            swal('Lỗi!', 'Thanh toán thất bại', 'error');
        }
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
                        <hr />
                        <div className="space-y-3 font-semibold">
                            <div className="flex justify-between pt-3 text-black">
                                <span>Tiền hàng</span>
                                <span>{totalPrice.toLocaleString()} ₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Giảm giá</span>
                                <span className="text-green-700">-{discount.toLocaleString()} ₫</span>
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
        </div>
    );
};

export default OrderSummary;
