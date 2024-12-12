import React, { useEffect, useState } from 'react';
import ModalVoucher from './ModalVoucher';
import { Button } from '@mui/material';
import voucher_icon from '../../../components/Assets/voucher_icon.png'
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function CustomTabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <div className="p-3">{children}</div>}
    </div>
  );
}

// Hàm định dạng tiền tệ
function formatCurrency(giaTri) {
  if (typeof giaTri !== 'number') return '0 đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(giaTri);
}

export default function MyVoucher() {
  const [openModal, setOpenModal] = useState(false);
  const [valueTabs, setValueTabs] = useState(0);
  const [voucherByCode, setVoucherByCode] = useState({});
  const [voucherPublic, setVoucherPublic] = useState([]);
  const [voucherPrivate, setVoucherPrivate] = useState([]);

  const handleChange = (index) => {
    setValueTabs(index);
  };

  const handleOpenModal = (maVoucher) => {
    const voucher = [...voucherPublic, ...voucherPrivate].find(v => v.ma === maVoucher);
    if (voucher) {
      setVoucherByCode(voucher);
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không tìm thấy voucher!",
      });
    }
    setOpenModal(true);
  };

  const fetchVoucherPublic = async (e) => {
    try {
      const response = await axios.get("http://localhost:8080/api/khach-hang-voucher/voucher-public")
      console.log(response.data); // Kiểm tra dữ liệu
      setVoucherPublic(response.data)
    } catch (error) {
      console.error("Error fetching user data:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi tải dữ liệu!",
      });
    }
  };

  const fetchVoucherPrivate = async () => {
    try {
      // Gọi API để lấy thông tin người dùng
      const response = await axios.get("http://localhost:8080/api/tai-khoan/my-info", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Gửi token nếu cần
        }
      });

      const khachId = response.data.id; // Lấy id người dùng từ dữ liệu trả về
      console.log(khachId); // Kiểm tra id

      // Gọi API để lấy voucher cá nhân
      const voucherResponse = await axios.get(`http://localhost:8080/api/khach-hang-voucher/voucher-private/${khachId}`);
      setVoucherPrivate(voucherResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi tải dữ liệu!",
      });
    }
  };

  useEffect(() => {
    fetchVoucherPublic();
    fetchVoucherPrivate();
  }, []);

  return (
    <div className="mx-2 my-2">
      <p className="text-2xl font-semibold mb-2">Phiếu giảm giá</p>
      <hr />
      <div className="mt-4">
        <div className="border-b">
          <div className="flex space-x-4">
            <button
              className={`font-semibold py-2 px-4 ${valueTabs === 0 ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => handleChange(0)}
            >
              Công khai
            </button>
            <button
              className={`font-semibold py-2 px-4 ${valueTabs === 1 ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => handleChange(1)}
            >
              Cá nhân
            </button>
          </div>
        </div>
        <CustomTabPanel value={valueTabs} index={0}>
          <div className="mt-4">
            {voucherPublic.length > 0 ? (
              voucherPublic.map((v) => (
                <div key={v.id}
                  className="flex justify-between items-center border p-4 mb-4 rounded-sm shadow-sm">
                  <div className="flex items-center space-x-3">
                    <img src={voucher_icon} alt="voucher_icon" className="w-30 h-20" />
                    <div className="flex flex-col">
                      <p className="text-base">
                        Giảm {v.kieuGiaTri === 0 ? `${v.giaTri}%` : formatCurrency(v.giaTri) + " "} Giảm tối đa {formatCurrency(v.giaTriMax)}
                        <br /> Đơn Tối Thiểu {formatCurrency(v.dieuKienNhoNhat)}
                      </p>
                      <p className="text-sm text-gray-700">
                        Hạn sử dụng:{' '}
                        {new Date(v.ngayBatDau).toLocaleDateString()} -{' '}
                        {new Date(v.ngayKetThuc).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button onClick={() => handleOpenModal(v.ma)}
                      className="py-2 px-4 text-blue-600 hover:bg-gray-100 hover:text-blue-700">
                      Xem chi tiết
                    </Button>
                  </div>

                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500">
                Không có phiếu giảm giá công khai nào.
              </div>
            )}
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={valueTabs} index={1}>
          <div className="mt-4">
            {voucherPrivate.length > 0 ? (
              voucherPrivate.map((v) => (
                <div key={v.id} className="flex justify-between items-center border p-4 mb-4 rounded-sm shadow-sm">
                  <div className="flex items-center space-x-3">
                    <img src={voucher_icon} alt="voucher_icon" className="w-30 h-20" />
                    <div className="flex flex-col">
                      <p className="text-base">
                        Giảm {v.kieuGiaTri === 0 ? `${v.giaTri}%` : formatCurrency(v.giaTri)}
                        <br />Đơn Tối Thiểu {formatCurrency(v.dieuKienNhoNhat)}
                      </p>
                      <p className="text-sm text-gray-700">
                        Hạn sử dụng:{' '}
                        {new Date(v.ngayBatDau).toLocaleDateString()} -{' '}
                        {new Date(v.ngayKetThuc).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button onClick={() => handleOpenModal(v.ma)}
                      className="py-2 px-4 text-blue-600 hover:bg-gray-100 hover:text-blue-700">
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500">
                Không có phiếu giảm giá cá nhân nào.
              </div>
            )}
          </div>
        </CustomTabPanel>
      </div>
      <ModalVoucher
        openModal={openModal}
        setOpenModal={setOpenModal}
        voucher={voucherByCode}
      />
    </div>
  );
}