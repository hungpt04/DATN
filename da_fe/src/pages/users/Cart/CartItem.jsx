import React, { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const CartItem = ({ showButton, cart, onQuantityChange, onDeleteCart }) => {
    const [quantity, setQuantity] = useState(cart.gioHang.soLuong);

    const handleIncrease = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange(cart.gioHang.id, newQuantity);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onQuantityChange(cart.gioHang.id, newQuantity);
        }
    };

    return (
        <div className="p-5 shadow-lg border rounded-md">
            <div className="flex items-center">
                <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem] ">
                    <img className="w-full h-full object-cover object-top" src={cart.link} alt="" />
                </div>
                <div className="ml-5 space-y-1">
                    <p className="font-semibold">{cart.gioHang.sanPhamCT.sanPham.ten}</p>
                    <p className="opacity-70">Trọng lượng: {cart.gioHang.sanPhamCT.trongLuong.ten}</p>
                    <p className="opacity-70 mt-2">Thương hiệu: {cart.gioHang.sanPhamCT.thuongHieu.ten}</p>
                    <div className="flex space-x-2 items-center pt-3">
                        <p className="font-semibold text-lg">{cart.gioHang.sanPhamCT.donGia.toLocaleString()} ₫</p>
                        <p className="opacity-50 line-through">37000000 ₫</p>
                        <p className="text-green-600 font-semibold">3% off</p>
                    </div>
                </div>
            </div>
            {showButton && (
                <div className="lg:flex items-center lg:space-x-10 pt-4">
                    <div className="flex items-center space-x-2 ">
                        <IconButton sx={{ color: '#2f19ae' }} aria-label="remove" onClick={handleDecrease}>
                            <RemoveCircleOutlineIcon />
                        </IconButton>
                        <span className="py-1 px-7 border rounded-sm">{quantity}</span>
                        <IconButton sx={{ color: '#2f19ae' }} aria-label="add" onClick={handleIncrease}>
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </div>
                    <div className="flex text-sm lg:text-base mt-5 lg:mt-0">
                        <Button variant="text" sx={{ color: '#2f19ae' }} onClick={() => onDeleteCart(cart.gioHang.id)}>
                            Remove
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartItem;
