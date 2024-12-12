// ModalVoucher.js
import React from 'react';
import ModalVoucherDetail from './ModalVoucherDetail';

export default function ModalVoucher({ openModal, setOpenModal, voucher }) {
  return (
    <ModalVoucherDetail openModal={openModal} setOpenModal={setOpenModal} voucher={voucher} />
  );
}