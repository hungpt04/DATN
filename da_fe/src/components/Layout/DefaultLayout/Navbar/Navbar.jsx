// import React, { useContext, useState } from 'react';
// import { Link } from 'react-router-dom';
// import logo from '../../../Assets/logo.png';
// import cart_icon from '../../../Assets/cart_icon.png';
// import { CartContext } from '../../../../pages/users/Cart/CartContext';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../Assets/logo.png';
import cart_icon from '../../../Assets/cart_icon.png';
import { CartContext } from '../../../../pages/users/Cart/CartContext';
import user_icon from '../../../Assets/user_icon.png';
import { Avatar } from '@mui/material';
import { Edit, LogOut, LogIn, User } from 'react-feather';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    // const [menu, setMenu] = useState('trangchu');
    // const { cartItemCount } = useContext(CartContext);
    const [menu, setMenu] = useState('trangchu');
    const { cartItemCount } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [username, setUsername] = useState(null);
    const [avatar, setAvatar] = useState(user_icon); // Khai báo state cho avatar
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true);
                const decodedToken = jwtDecode(token);
                console.log('Decoded Token:', decodedToken);
                setUsername(decodedToken.hoTen); // Lấy họ tên từ token
                setUserRole(decodedToken.vaiTro || decodedToken.authorities); // Lấy vai trò từ token
                // Nếu avatar được lưu trong token, bạn có thể lấy nó như sau:
                // localStorage.setItem('adminAvatar', avatar);
            } else {
                setIsLoggedIn(false);
                setUserRole(null); // Nếu không có token, đặt vai trò là null
            }
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAccount = () => {
        // Sử dụng SweetAlert2 để xác nhận đăng xuất
        Swal.fire({
            title: "Xác nhận đăng xuất tài khoản?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Hủy"
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirm(); // Gọi hàm đăng xuất
            }
        });
    };

    const handleConfirm = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('vaiTro'); // Remove role on logout
        console.log('Đăng xuất thành công');
        setIsLoggedIn(false);
        setUserRole(null); // Reset user role
        navigate('/');
    };


    return (
        <div className="flex justify-around shadow-md h-20">
            <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="w-[100px] h-[50px]" />
                <p className="text-[#171717] text-3xl font-semibold">Backet</p>
            </div>
            <ul className="flex items-center list-none gap-8 text-[#292929] font-medium">
                <li
                    onClick={() => setMenu('trangchu')}
                    className="flex flex-col items-center gap-1 cursor-pointer py-3 text-[15px]"
                >
                    <Link to="/">Trang chủ</Link>
                    {menu === 'trangchu' && <hr className="border-none w-full h-[3px] rounded-lg bg-[#2f19ae]" />}
                </li>
                <li
                    onClick={() => setMenu('sanpham')}
                    className="flex flex-col items-center gap-1 cursor-pointer py-3 text-[15px]"
                >
                    <Link to="/san-pham">Sản phẩm</Link>
                    {menu === 'sanpham' && <hr className="border-none w-full h-[3px] rounded-lg bg-[#2f19ae]" />}
                </li>
                <li
                    onClick={() => setMenu('gioithieu')}
                    className="flex flex-col items-center gap-1 cursor-pointer py-3 text-[15px]"
                >
                    <Link to="/gioi-thieu">Giới thiệu</Link>
                    {menu === 'gioithieu' && <hr className="border-none w-full h-[3px] rounded-lg bg-[#2f19ae]" />}
                </li>
                <li
                    onClick={() => setMenu('tintuc')}
                    className="flex flex-col items-center gap-1 cursor-pointer py-3 text-[15px]"
                >
                    <Link to="/tin-tuc">Tin tức</Link>
                    {menu === 'tintuc' && <hr className="border-none w-full h-[3px] rounded-lg bg-[#2f19ae]" />}
                </li>
                <li
                    onClick={() => setMenu('lienhe')}
                    className="flex flex-col items-center gap-1 cursor-pointer py-3 text-[15px]"
                >
                    <Link to="/lien-he">Liên hệ</Link>
                    {menu === 'lienhe' && <hr className="border-none w-full h-[3px] rounded-lg bg-[#2f19ae]" />}
                </li>
            </ul>

            <div className="flex items-center gap-10">
                {/* <Link to="/login">
                    <button className="w-28 h-10 text-sm outline-none border border-gray-400 rounded-full text-gray-600 font-medium bg-white cursor-pointer active:bg-gray-100">
                        Login
                    </button>
                </Link> */}

                <Link to="/gio-hang">
                    <div className="relative cursor-pointer">
                        <img src={cart_icon} alt="Cart Icon" className="w-8 h-8" />
                        <div className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center rounded-full text-xs bg-red-600 text-white transform translate-x-1/2 -translate-y-1/2">
                            {cartItemCount}
                        </div>
                    </div>
                </Link>

                <div className='relative'>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative">
                        <Avatar src={user_icon} alt="User Icon" className="w-10 h-8" />
                        {isMenuOpen && (
                            <ul className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48 py-2 text-gray-700 z-50" ref={menuRef}>
                                {isLoggedIn ? (
                                    <>
                                        {/* {userRole === "Customer" && ( */}
                                            <li className="flex px-4 py-2 hover:bg-gray-100 space-x-3">
                                                <User className='h-5 w-5' />
                                                <Link to="/profile/user" onClick={() => { setIsMenuOpen(false) }}>Tài khoản của tôi</Link>
                                            </li>
                                        {/* )} */}
                                        {/* {userRole === 'Admin' && (
                                            <li className="flex px-4 py-2 hover:bg-gray-100 space-x-3">
                                                <Edit className="w-5 h-5" />
                                                <Link to="/admin" onClick={() => { setIsMenuOpen(false) }}>Trang quản lý</Link>
                                            </li>
                                        )} */}
                                        {/* {userRole === 'User' && (
                                            <li className="flex px-4 py-2 hover:bg-gray-100 space-x-3">
                                                <Edit className="w-5 h-5" />
                                                <Link to="/admin" onClick={() => { setIsMenuOpen(false) }}>Trang quản lý</Link>
                                            </li>
                                        )} */}
                                        <li className="flex px-4 py-2 hover:bg-gray-100 space-x-3">
                                            <LogOut className='w-5 h-5' />
                                            <button onClick={handleAccount}>Đăng xuất</button>
                                        </li>
                                    </>
                                ) : (
                                    <li className="flex px-4 py-2 hover:bg-gray-100 space-x-3">
                                        <LogIn className='w-5 h-5' />
                                        <Link to="/login" onClick={() => { setIsMenuOpen(false) }}>Đăng nhập</Link>
                                    </li>
                                )}
                            </ul>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Navbar;
