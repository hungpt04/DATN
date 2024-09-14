import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link để điều hướng
import './Navbar.css';

import logo from '../../../Assets/logo.png';
import cart_icon from '../../../Assets/cart_icon.png';

const Navbar = () => {
    const [menu, setMenu] = useState("trangchu");

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="Logo" />
                <p>Poly Badminton</p>
            </div>
            <ul className="nav-menu">
                <li onClick={() => setMenu("trangchu")}>
                    <Link to="/">Trang chủ</Link>
                    {menu === "trangchu" ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu("sanpham")}>
                    <Link to="/san-pham">Sản phẩm</Link>
                    {menu === "sanpham" ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu("gioithieu")}>
                    <Link to="/gioi-thieu">Giới thiệu</Link>
                    {menu === "gioithieu" ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu("tintuc")}>
                    <Link to="/tin-tuc">Tin tức</Link>
                    {menu === "tintuc" ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu("lienhe")}>
                    <Link to="/lien-he">Liên hệ</Link>
                    {menu === "lienhe" ? <hr /> : <></>}
                </li>
            </ul>
            <div className="nav-logo-cart">
                <button>Login</button>
                <img src={cart_icon} alt="Cart Icon" />
                <div className="nav-cart-count">0</div>
            </div>
        </div>
    );
}

export default Navbar;
