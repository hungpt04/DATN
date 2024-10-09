import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../Assets/logo.png';
import cart_icon from '../../../Assets/cart_icon.png';

const Navbar = () => {
    const [menu, setMenu] = useState('trangchu');

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
                <Link to="/login">
                    <button className="w-28 h-10 text-sm outline-none border border-gray-400 rounded-full text-gray-600 font-medium bg-white cursor-pointer active:bg-gray-100">
                        Login
                    </button>
                </Link>

                <Link to="/gio-hang">
                    <div className="relative cursor-pointer">
                        <img src={cart_icon} alt="Cart Icon" className="w-8 h-8" />
                        <div className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center rounded-full text-xs bg-red-600 text-white transform translate-x-1/2 -translate-y-1/2">
                            0
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
