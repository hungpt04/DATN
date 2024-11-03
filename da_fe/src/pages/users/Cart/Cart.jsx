import React, { useContext, useEffect, useState } from 'react';
import CartItem from './CartItem';
import { Button } from '@mui/material';
import axios from 'axios';
import { CartContext } from './CartContext';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Cart = () => {
    const { setCartItemCount } = useContext(CartContext);
    const [carts, setCarts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0); // Tiền hàng
    const [totalAmount, setTotalAmount] = useState(0); // Tổng tiền
    const discount = 218000; // Giảm giá
    const shippingFee = 0; // Phí vận chuyển (ở đây là miễn phí)

    const navigate = useNavigate(); // Khởi tạo hàm navigate

    const loadCarts = async (taiKhoanId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/gio-hang/with-images/${taiKhoanId}`);
            setCarts(response.data);
        } catch (error) {
            console.error('Failed to fetch Carts', error);
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

    useEffect(() => {
        loadCarts(1);
    }, []);

    useEffect(() => {
        if (carts.length > 0) {
            const firstCartItems = getFirstCartItemPerProduct(carts);
            const total = calculateTotalPrice(firstCartItems);
            setTotalPrice(total);
            const totalAmount = total - discount + shippingFee;
            setTotalAmount(totalAmount);
        }
    }, [carts]);

    useEffect(() => {
        if (carts.length > 0) {
            const firstCartItems = getFirstCartItemPerProduct(carts);
            setCartItemCount(firstCartItems.length);
        }
    }, [carts]);

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

    const firstCartItems = getFirstCartItemPerProduct(carts);

    const handleCheckout = () => {
        navigate('/gio-hang/checkout'); // Chuyển hướng đến trang AddAddress
    };

    return (
        <div className="mt-10">
            <div className="lg:grid grid-cols-3 lg:px-16 relative">
                <div className="lg:col-span-2 lg:px-5 bg-white">
                    <div className="space-y-3">
                        {firstCartItems.map((cart) => (
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
                <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0 ">
                    <div className="border p-5 bg-white shadow-lg rounded-md">
                        <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
                        <hr />
                        <div className="space-y-3 font-semibold">
                            <div className="flex justify-between pt-3 text-black ">
                                <span>Tiền hàng</span>
                                <span>{totalPrice.toLocaleString()} ₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Giảm giá</span>
                                <span className="text-green-700">-{discount.toLocaleString()} đ</span>
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
                            variant="contained"
                            onClick={handleCheckout} // Gọi hàm handleCheckout khi nhấn nút
                            sx={{
                                padding: '.8rem 2rem',
                                marginTop: '2rem',
                                width: '100%',
                                backgroundColor: '#2f19ae',
                                '&:hover': { backgroundColor: '#271693' },
                            }}
                        >
                            Check Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
