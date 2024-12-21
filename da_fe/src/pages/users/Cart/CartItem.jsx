// // import React, { useState, useEffect } from 'react';
// // import { Button, IconButton } from '@mui/material';
// // import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// // import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// // import axios from 'axios';

// // const CartItem = ({ showButton, cart, onQuantityChange, onDeleteCart }) => {
// //     const [quantity, setQuantity] = useState(cart.gioHang.soLuong);
// //     const [promotion, setPromotion] = useState(null);

// //     useEffect(() => {
// //         const fetchPromotion = async () => {
// //             try {
// //                 const response = await axios.get(
// //                     `http://localhost:8080/api/san-pham-khuyen-mai/san-pham-ct/${cart.gioHang.sanPhamCT.id}`,
// //                 );

// //                 if (response.data.length > 0) {
// //                     setPromotion(response.data[0]);
// //                 }
// //             } catch (error) {
// //                 console.error('Error fetching promotion:', error);
// //             }
// //         };

// //         fetchPromotion();
// //     }, [cart.gioHang.sanPhamCT.id]);

// //     const handleIncrease = () => {
// //         const newQuantity = quantity + 1;
// //         setQuantity(newQuantity);
// //         onQuantityChange(cart.gioHang.id, newQuantity);
// //     };

// //     const handleDecrease = () => {
// //         if (quantity > 1) {
// //             const newQuantity = quantity - 1;
// //             setQuantity(newQuantity);
// //             onQuantityChange(cart.gioHang.id, newQuantity);
// //         }
// //     };

// //     // Tính phần trăm giảm giá
// //     const calculateDiscountPercentage = () => {
// //         if (promotion) {
// //             return Math.round((1 - promotion.giaKhuyenMai / cart.gioHang.sanPhamCT.donGia) * 100);
// //         }
// //         return 0;
// //     };

// //     return (
// //         <div className="p-5 shadow-lg border rounded-md">
// //             <div className="flex items-center">
// //                 <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem] ">
// //                     <img className="w-full h-full object-cover object-top" src={cart.link} alt="" />
// //                 </div>
// //                 <div className="ml-5 space-y-1">
// //                     <p className="font-semibold">{cart.gioHang.sanPhamCT.sanPham.ten}</p>
// //                     <p className="opacity-70">Trọng lượng: {cart.gioHang.sanPhamCT.trongLuong.ten}</p>
// //                     <p className="opacity-70 mt-2">Thương hiệu: {cart.gioHang.sanPhamCT.thuongHieu.ten}</p>

// //                     <div className="flex space-x-2 items-center pt-3">
// //                         {promotion ? (
// //                             <>
// //                                 <p className="font-semibold text-lg text-red-600">
// //                                     {promotion.giaKhuyenMai.toLocaleString()} ₫
// //                                 </p>
// //                                 <p className="opacity-50 line-through">
// //                                     {cart.gioHang.sanPhamCT.donGia.toLocaleString()} ₫
// //                                 </p>
// //                                 <p className="text-green-600 font-semibold">{calculateDiscountPercentage()}% off</p>
// //                             </>
// //                         ) : (
// //                             <p className="font-semibold text-lg text-red-600">
// //                                 {cart.gioHang.sanPhamCT.donGia.toLocaleString()} ₫
// //                             </p>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>
// //             {showButton && (
// //                 <div className="lg:flex items-center lg:space-x-10 pt-4">
// //                     <div className="flex items-center space-x-2 ">
// //                         <IconButton sx={{ color: '#2f19ae' }} aria-label="remove" onClick={handleDecrease}>
// //                             <RemoveCircleOutlineIcon />
// //                         </IconButton>
// //                         <span className="py-1 px-7 border rounded-sm">{quantity}</span>
// //                         <IconButton sx={{ color: '#2f19ae' }} aria-label="add" onClick={handleIncrease}>
// //                             <AddCircleOutlineIcon />
// //                         </IconButton>
// //                     </div>
// //                     <div className="flex text-sm lg:text-base mt-5 lg:mt-0">
// //                         <Button variant="text" sx={{ color: '#2f19ae' }} onClick={() => onDeleteCart(cart.gioHang.id)}>
// //                             Remove
// //                         </Button>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default CartItem;


// import React, { useState, useEffect } from 'react';
// import { Button, IconButton } from '@mui/material';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// import axios from 'axios';
// import swal from 'sweetalert';

// const CartItem = ({ showButton, cart, onQuantityChange, onDeleteCart }) => {
//     const [quantity, setQuantity] = useState(cart.gioHang.soLuong);
//     const [promotion, setPromotion] = useState(null);
//     const [maxQuantity, setMaxQuantity] = useState(cart.gioHang.sanPhamCT.soLuong);
//     const [isEditing, setIsEditing] = useState(false);

//     useEffect(() => {
//         const fetchPromotion = async () => {
//             try {
//                 const response = await axios.get(
//                     `http://localhost:8080/api/san-pham-khuyen-mai/san-pham-ct/${cart.gioHang.sanPhamCT.id}`,
//                 );

//                 if (response.data.length > 0) {
//                     setPromotion(response.data[0]);
//                 }
//             } catch (error) {
//                 console.error('Error fetching promotion:', error);
//             }
//         };

//         fetchPromotion();
//     }, [cart.gioHang.sanPhamCT.id]);

//     const handleQuantityChange = (e) => {
//         const inputValue = e.target.value;

//         // Chỉ cho phép nhập số
//         if (/^\d*$/.test(inputValue)) {
//             const newQuantity = inputValue === '' ? 1 : parseInt(inputValue);

//             if (newQuantity > maxQuantity) {
//                 swal('Thông báo', `Số lượng sản phẩm không được vượt quá ${maxQuantity}`, 'warning');
//                 setQuantity(maxQuantity);
//                 onQuantityChange(cart.gioHang.id, maxQuantity);
//             } else if (newQuantity < 1) {
//                 setQuantity(1);
//                 onQuantityChange(cart.gioHang.id, 1);
//             } else {
//                 setQuantity(newQuantity);
//                 onQuantityChange(cart.gioHang.id, newQuantity);
//             }
//         }
//     };

//     const handleBlur = () => {
//         setIsEditing(false);
//         // Đảm bảo số lượng không nhỏ hơn 1 và không lớn hơn max
//         const adjustedQuantity = Math.min(Math.max(quantity, 1), maxQuantity);
//         setQuantity(adjustedQuantity);
//         onQuantityChange(cart.gioHang.id, adjustedQuantity);
//     };

//     const handleIncrease = () => {
//         if (quantity < maxQuantity) {
//             const newQuantity = quantity + 1;
//             setQuantity(newQuantity);
//             onQuantityChange(cart.gioHang.id, newQuantity);
//         } else {
//             swal('Thông báo', `Số lượng sản phẩm không được vượt quá ${maxQuantity}`, 'warning');
//         }
//     };

//     const handleDecrease = () => {
//         if (quantity > 1) {
//             const newQuantity = quantity - 1;
//             setQuantity(newQuantity);
//             onQuantityChange(cart.gioHang.id, newQuantity);
//         }
//     };

//     // Tính phần trăm giảm giá
//     const calculateDiscountPercentage = () => {
//         if (promotion) {
//             return Math.round((1 - promotion.giaKhuyenMai / cart.gioHang.sanPhamCT.donGia) * 100);
//         }
//         return 0;
//     };

//     return (
//         <div className="p-5 shadow-lg border rounded-md">
//             <div className="flex items-center">
//                 <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem] ">
//                     <img className="w-full h-full object-cover object-top" src={cart.link} alt="" />
//                 </div>
//                 <div className="ml-5 space-y-1">
//                     <p className="font-semibold">{cart.gioHang.sanPhamCT.sanPham.ten}</p>
//                     <p className="opacity-70">Trọng lượng: {cart.gioHang.sanPhamCT.trongLuong.ten}</p>
//                     <p className="opacity-70 mt-2">Thương hiệu: {cart.gioHang.sanPhamCT.thuongHieu.ten}</p>

//                     <div className="flex space-x-2 items-center pt-3">
//                         {promotion ? (
//                             <>
//                                 <p className="font-semibold text-lg text-red-600">
//                                     {promotion.giaKhuyenMai.toLocaleString()} ₫
//                                 </p>
//                                 <p className="opacity-50 line-through">
//                                     {cart.gioHang.sanPhamCT.donGia.toLocaleString()} ₫
//                                 </p>
//                                 <p className="text-green-600 font-semibold">{calculateDiscountPercentage()}% off</p>
//                             </>
//                         ) : (
//                             <p className="font-semibold text-lg text-red-600">
//                                 {cart.gioHang.sanPhamCT.donGia.toLocaleString()} ₫
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             {showButton && (
//                 <div className="lg:flex items-center lg:space-x-10 pt-4">
//                     <div className="flex items-center space-x-2">
//                         <IconButton sx={{ color: '#2f19ae' }} aria-label="remove" onClick={handleDecrease}>
//                             <RemoveCircleOutlineIcon />
//                         </IconButton>
//                         {isEditing ? (
//                             <input
//                                 type="text"
//                                 value={quantity}
//                                 onChange={handleQuantityChange}
//                                 onBlur={handleBlur}
//                                 className="py-1 px-2 border rounded-sm w-16 text-center"
//                                 autoFocus
//                             />
//                         ) : (
//                             <span
//                                 className="py-1 px-7 border rounded-sm cursor-pointer"
//                                 onClick={() => setIsEditing(true)}
//                             >
//                                 {quantity}
//                             </span>
//                         )}
//                         <IconButton
//                             sx={{
//                                 color: quantity < maxQuantity ? '#2f19ae' : 'gray',
//                                 cursor: quantity < maxQuantity ? 'pointer' : 'not-allowed',
//                             }}
//                             aria-label="add"
//                             onClick={handleIncrease}
//                             disabled={quantity >= maxQuantity}
//                         >
//                             <AddCircleOutlineIcon />
//                         </IconButton>
//                     </div>
//                     <div className="flex text-sm lg:text-base mt-5 lg:mt-0">
//                         <Button variant="text" sx={{ color: '#2f19ae' }} onClick={() => onDeleteCart(cart.gioHang.id)}>
//                             Remove
//                         </Button>
//                     </div>
//                 </div>
//             )}
//             <div className="text-sm text-gray-500 mt-2">Còn {maxQuantity} sản phẩm trong kho</div>
//         </div>
//     );
// };

// export default CartItem;


import React, { useState, useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import swal from 'sweetalert';

const CartItem = ({ showButton, cart, onQuantityChange, onDeleteCart }) => {
    const [quantity, setQuantity] = useState(cart.gioHang.soLuong);
    const [promotion, setPromotion] = useState(null);
    const [maxQuantity, setMaxQuantity] = useState(cart.gioHang.sanPhamCT.soLuong);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/san-pham-khuyen-mai/san-pham/${cart.gioHang.sanPhamCT.id}`,
                );

                if (response.data.length > 0) {
                    const fetchedPromotion = response.data[0];
                    // Kiểm tra trạng thái khuyến mãi
                    if (fetchedPromotion.khuyenMai.trangThai !== 2 && fetchedPromotion.khuyenMai.trangThai !== 0) {
                        setPromotion(fetchedPromotion);
                    }
                }
            } catch (error) {
                console.error('Error fetching promotion:', error);
            }
        };

        fetchPromotion();
    }, [cart.gioHang.sanPhamCT.id]);

    const handleQuantityChange = (e) => {
        const inputValue = e.target.value;

        // Chỉ cho phép nhập số
        if (/^\d*$/.test(inputValue)) {
            const newQuantity = inputValue === '' ? 1 : parseInt(inputValue);

            if (newQuantity > maxQuantity) {
                swal('Thông báo', `Số lượng sản phẩm không được vượt quá ${maxQuantity}`, 'warning');
                setQuantity(maxQuantity);
                onQuantityChange(cart.gioHang.id, maxQuantity);
            } else if (newQuantity < 1) {
                setQuantity(1);
                onQuantityChange(cart.gioHang.id, 1);
            } else {
                setQuantity(newQuantity);
                onQuantityChange(cart.gioHang.id, newQuantity);
            }
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        // Đảm bảo số lượng không nhỏ hơn 1 và không lớn hơn max
        const adjustedQuantity = Math.min(Math.max(quantity, 1), maxQuantity);
        setQuantity(adjustedQuantity);
        onQuantityChange(cart.gioHang.id, adjustedQuantity);
    };

    const handleIncrease = () => {
        if (quantity < maxQuantity) {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            onQuantityChange(cart.gioHang.id, newQuantity);
        } else {
            swal('Thông báo', `Số lượng sản phẩm không được vượt quá ${maxQuantity}`, 'warning');
        }
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
                        {promotion ? (
                            <>
                                <p className="font-semibold text-lg text-red-600">
                                    {(
                                        cart.gioHang.sanPhamCT.donGia *
                                        (1 - promotion.khuyenMai.giaTri / 100)
                                    ).toLocaleString()}{' '}
                                    ₫
                                </p>
                                <p className="opacity-50 line-through">
                                    {cart.gioHang.sanPhamCT.donGia.toLocaleString()} ₫
                                </p>
                                <p className="text-green-600 font-semibold">{promotion.khuyenMai.giaTri}% off</p>
                            </>
                        ) : (
                            <p className="font-semibold text-lg text-red-600">
                                {cart.gioHang.sanPhamCT.donGia.toLocaleString()} ₫
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {showButton && (
                <div className="lg:flex items-center lg:space-x-10 pt-4">
                    <div className="flex items-center space-x-2">
                        <IconButton sx={{ color: '#2f19ae' }} aria-label="remove" onClick={handleDecrease}>
                            <RemoveCircleOutlineIcon />
                        </IconButton>
                        {isEditing ? (
                            <input
                                type="text"
                                value={quantity}
                                onChange={handleQuantityChange}
                                onBlur={handleBlur}
                                className="py-1 px-2 border rounded-sm w-16 text-center"
                                autoFocus
                            />
                        ) : (
                            <span
                                className="py-1 px-7 border rounded-sm cursor-pointer"
                                onClick={() => setIsEditing(true)}
                            >
                                {quantity}
                            </span>
                        )}
                        <IconButton
                            sx={{
                                color: quantity < maxQuantity ? '#2f19ae' : 'gray',
                                cursor: quantity < maxQuantity ? 'pointer' : 'not-allowed',
                            }}
                            aria-label="add"
                            onClick={handleIncrease}
                            disabled={quantity >= maxQuantity}
                        >
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
            <div className="text-sm text-gray-500 mt-2">Còn {maxQuantity} sản phẩm trong kho</div>
        </div>
    );
};

export default CartItem;
