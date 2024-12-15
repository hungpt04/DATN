import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Notifications } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import user_icon from '../../../Assets/user_icon.png';
import { Avatar } from '@mui/material';
import { Edit, LogOut, LogIn, User } from 'react-feather';
import Swal from 'sweetalert2';
import axios from 'axios';

function HeaderAdmin() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [username, setUsername] = useState(null);
    const [avatar, setAvatar] = useState(user_icon);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const [admin, setAdmin] = useState({
        hoTen: "",
        email: "",
        sdt: "",
        ngaySinh: "",
        gioiTinh: 0,
        vaiTro: "",
        avatar: "",
    });

    useEffect(() => {
        const token = localStorage.getItem('token'); 

        if (token) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get("http://localhost:8080/api/tai-khoan/my-info", {
                        headers: {
                            Authorization: `Bearer ${token}`, // Gửi token trong header
                        },
                    });
                    setAdmin(response.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserInfo();
        } else {
            // navigate("/login"); Điều hướng đến trang đăng nhập nếu không có token
        }
    }, [navigate]);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true);
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.hoTen);
                setUserRole(decodedToken.vaiTro || decodedToken.authorities); 
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
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
        <header className="flex items-center justify-between w-full h-[70px] bg-white px-6 shadow-md">
            {/* Search Input */}
            <div className="flex items-center bg-gray-100 rounded-lg p-2 w-1/3">
                <Search className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="ml-2 w-full bg-transparent outline-none text-gray-700"
                />
            </div>

            {/* Notification Bell & User Info */}
            <div className="flex items-center space-x-5">
                {/* Notification Icon */}
                <div className="relative cursor-pointer">
                    <Notifications className="w-24 h-24 text-gray-600 " />

                </div>
                {/* User Info */}
                <div className="flex items-center space-x-1 pr-5">
                    <div className="mr-4 text-center">
                        <p className="text-gray-800 text-base font-semibold">{admin.hoTen}</p>
                        <p className="ext-gray-500 text-sm">-<span className="mx-1">{admin.vaiTro}</span>-</p>
                    </div>
                    {/* Avatar */}
                    <div className='relative'>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative">
                            <Avatar src={admin.avatar} alt="" className="w-10 h-8" />
                            {isMenuOpen && (
                                <ul className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48 py-2 text-gray-700 z-50" ref={menuRef}>
                                    {isLoggedIn ? (
                                        <>
                                            {userRole === "Admin" && (
                                                <li className="flex px-4 py-2 hover:bg-gray-100 space-x-3">
                                                    <User className='h-5 w-5' />
                                                    <Link to="/profile/user" onClick={() => { setIsMenuOpen(false) }}>Tài khoản của tôi</Link>
                                                </li>
                                            )}
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
        </header>
    );
}

export default HeaderAdmin;
