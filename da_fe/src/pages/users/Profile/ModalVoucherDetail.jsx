import React from 'react';
import dayjs from 'dayjs';
import './ModalVoucher.css';
import { useNavigate } from 'react-router-dom';

// Hàm định dạng tiền tệ
function formatCurrency(giaTri) {
    if (typeof giaTri !== 'number') return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(giaTri);
}

export default function ModalVoucherDetail({ openModal, setOpenModal, voucher }) {

    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleUseNow = () => {
        setOpenModal(false);
        navigate('/san-pham')
    };

    return (
        <div className={`modal-overlay ${openModal ? 'block' : 'hidden'}`}>
        <div className={`fixed inset-0 flex items-center justify-center ${openModal ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-sm w-11/12 sm:w-1/2 md:w-1/3 shadow-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-semibold">Thông tin phiếu giảm giá</h2>
                    <button onClick={() => setOpenModal(false)} className="text-red-500">
                        <span className="w-8 h-8 text-2xl">&times;</span>
                    </button>
                </div>
                <div className="flex-1 max-h-[65vh] overflow-y-auto mt-4 custom-scrollbar">
                    <p className="font-sm text-gray-700">Giá trị: {voucher.kieuGiaTri === 0 ? `${voucher.giaTri}%` : formatCurrency(voucher.giaTri)}</p>
                    <p className="font-sm text-gray-700">Tối đa: {formatCurrency(voucher.giaTriMax)}</p>
                    <p className="font-sm text-gray-700">Áp dụng cho đơn tối thiểu: {formatCurrency(voucher.dieuKienNhoNhat)}</p>

                    <div className="mt-4">
                        <p className="font-sm font-semibold">Hạn sử dụng</p>
                        <p className="font-sm text-gray-700">{dayjs(voucher.ngayBatDau).format('DD-MM-YYYY HH:mm')} - {dayjs(voucher.ngayKetThuc).format('DD-MM-YYYY HH:mm')}</p>
                    </div>

                    <div className="mt-4">
                        <p className="font-sm font-semibold">Ưu đãi</p>
                        <p className="font-sm text-gray-700">
                            Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé!
                            Giảm {voucher.kieuGiaTri === 0 ? `${voucher.giaTri}%` : formatCurrency(voucher.giaTri)}
                             Đơn Tối Thiểu {formatCurrency(voucher.dieuKienNhoNhat)}
                        </p>
                    </div>

                    <div className="mt-4">
                        <p className="font-sm font-semibold">Áp dụng cho sản phẩm</p>
                        <p className="font-sm text-gray-700">Áp dụng cho mọi sản phẩm</p>
                    </div>

                    <div className="mt-4">
                        <p className="font-sm font-semibold">Hình thức thanh toán</p>
                        <p className="font-sm text-gray-700">Tất cả hình thức thanh toán</p>
                    </div>

                    <div className="mt-4">
                        <p className="font-sm font-semibold">Đơn vị vận chuyển</p>
                        <p className="font-sm text-gray-700">Tất cả đơn vị vận chuyển</p>
                    </div>

                    <div className="mt-4">
                        <p className="font-sm font-semibold">Xem chi tiết</p>
                        <p className="font-sm text-gray-700">Mã: {voucher.ma}</p>
                        <p className="font-sm text-gray-700">Tên: {voucher.ten}</p>
                        <p className="font-sm text-gray-700">Kiểu: {voucher.kieu === 0 ? "Công khai" : "Cá nhân"}</p>
                        <p className="font-sm text-gray-700">Loại: {voucher.kieuGiaTri === 0 ? 'Phần trăm' : 'Giá tiền'}</p>
                        <p className="font-sm text-gray-700">Số lượng: {voucher.soLuong}</p>
                    </div>

                    <div className="mt-4">
                        <p className="font-sm font-semibold">Lưu ý</p>
                        <p className="font-sm text-gray-700">
                            Đối với những phiếu giảm giá thuộc kiểu <span className="font-semibold">công khai</span>, phiếu giảm giá sẽ được
                            sử dụng bởi tất cả khách hàng!
                        </p>
                    </div>
                </div>
                {/* <div className="mt-4">
                    <button onClick={handleUseNow}
                     className="py-2 text-white bg-indigo-600 w-full">Dùng ngay</button>
                </div> */}
            </div>
        </div>
        </div>
    );
}