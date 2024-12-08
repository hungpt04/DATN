import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';
import { RiBillLine } from 'react-icons/ri';
import { LiaMoneyCheckAltSolid } from 'react-icons/lia';
import { BiKey } from 'react-icons/bi';
import { MdEdit, MdBadge, MdLocationOn } from 'react-icons/md';
export default function Profile({ user, children }) {
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
  };

  // useEffect(() => {
  //   if (!user && location.pathname.startsWith('/profile')) {
  //     navigate('/login');
  //   }
  // }, [user, location.pathname, navigate]);

  return (
    <div className="profile">
      <div className="container mt-6 mx-auto px-5">
        <nav className="flex mb-4">
          <Link to="/home" className="text-black font-semibold text-lg mr-4">
            Trang chủ
          </Link>
          <span className="text-gray-600">Tài khoản của tôi</span>
        </nav>
        <div className="grid grid-cols-12 gap-4 space-x-5">
          <div className="col-span-3 bg-white shadow-md rounded p-4">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-black overflow-hidden mr-3">
                <img src={user?.avatar} alt="" className="w-full h-full" />
              </div>
              <div>
                <h2 className="font-bold">{user?.name}</h2>
                <p className="text-sm flex items-center">
                  <MdEdit className="mr-1" /> Sửa hồ sơ
                </p>
              </div>
            </div>
            <hr className="mb-4" />
            <div>
              <button onClick={handleClick} className="flex items-center w-full text-left py-2">
                <FiUsers className="text-xl mr-2" />
                <span>Tài khoản của tôi</span>
              </button>
              {open && (
                <div className="pl-4">
                  <Link to="user" className="flex items-center p-2 hover:bg-gray-100">
                    <MdBadge className='text-gray-700 hover:text-gray-900'/>
                    <span className="ml-2 text-gray-700 hover:text-gray-900">Hồ sơ</span>
                  </Link>
                  <Link to="address" className="flex items-center p-2 hover:bg-gray-100">
                    <MdLocationOn className='text-gray-700 hover:text-gray-900'/>
                    <span className="ml-2 text-gray-700 hover:text-gray-900">Địa chỉ</span>
                  </Link>
                </div>
              )}
            </div>
            <hr className="my-4" />
            <Link to="order" className="flex items-center py-2">
              <RiBillLine className="text-xl mr-2" />
              <span>Đơn mua</span>
            </Link>
            <Link to="my-voucher" className="flex items-center py-2">
              <LiaMoneyCheckAltSolid className="text-xl mr-2" />
              <span>Phiếu giảm giá</span>
            </Link>
            <Link to="change-password" className="flex items-center py-2">
              <BiKey className="text-xl mr-2" />
              <span>Đổi mật khẩu</span>
            </Link>
          </div>
          <div className="col-span-9 bg-white shadow-md rounded p-4">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  );
}