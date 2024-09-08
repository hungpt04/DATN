import React, { useState } from 'react'
import './Navbar.css'

import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'

const Navbar = () => {
    const [menu, setMenu] = useState("trangchu")


    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt=""/>
                <p>Poly Badminton</p>
            </div>
            <ul className="nav-menu">
                <li onClick={() => {setMenu("trangchu")}}>Trang chủ {menu==="trangchu"?<hr/>:<></>}</li>
                <li onClick={() => {setMenu("sanpham")}}>Sản phẩm {menu==="sanpham"?<hr/>:<></>}</li>
                <li onClick={() => {setMenu("gioithieu")}}>Giới thiệu {menu==="gioithieu"?<hr/>:<></>}</li>
                <li onClick={() => {setMenu("tintuc")}}>Tin tức {menu==="tintuc"?<hr/>:<></>}</li>
                <li onClick={() => {setMenu("lienhe")}}>Liên hệ {menu==="lienhe"?<hr/>:<></>}</li>
            </ul>
            <div className="nav-logo-cart">
                <button>Login</button>
                <img src={cart_icon} alt="" />
                <div className="nav-cart-count">0</div>
            </div>
        </div>
    )
}

export default Navbar