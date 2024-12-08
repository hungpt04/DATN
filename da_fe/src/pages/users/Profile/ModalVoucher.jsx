import React, { useState } from 'react';
import dayjs from 'dayjs';
// import ModalVoucher from './ModalVoucher';

// Hàm định dạng tiền tệ
function formatCurrency(value) {
  if (typeof value !== 'number') return '0 đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export default function ModalVoucherDetail({ openModal, setOpenModal, voucher }) {
//   const [openApplyVoucher, setOpenApplyVoucher] = useState(false);

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${openModal ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-11/12 sm:w-1/2 md:w-1/3 shadow-lg">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">Chi Tiết Phiếu Giảm Giá</h2>
          <button onClick={() => setOpenModal(false)} className="text-red-500">
            <span>&times;</span>
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <p><b>Mã:</b> {voucher.code}</p>
          <p><b>Tên:</b> {voucher.name}</p>
          <p><b>Loại:</b> {voucher.typeValue === 0 ? 'Phần trăm' : 'Giá tiền'}</p>
          <p><b>Giá trị:</b> {voucher.typeValue === 0 ? `${voucher.value}%` : formatCurrency(voucher.value)}</p>
          <p><b>Tối đa:</b> {formatCurrency(voucher.maximumValue)}</p>
          <p><b>Áp dụng cho đơn tối thiểu:</b> {formatCurrency(voucher.minimumAmount)}</p>
          <p><b>Hạn sử dụng:</b> {dayjs(voucher.startDate).format('DD-MM-YYYY HH:mm')} - {dayjs(voucher.endDate).format('DD-MM-YYYY HH:mm')}</p>
        </div>
        <div className="mt-6 text-right">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600"
            onClick={() => setOpenModal(false)}
          >
            OK
          </button>
        </div>
            {/* <ModalVoucher
            open={openApplyVoucher}
            setOpen={setOpenApplyVoucher}
            setVoucher={() => {}}
            arrData={[]}
            setGiamGia={() => {}}
            voucherFilter={{}}
            /> */}
        </div>
    </div>
  );
}
