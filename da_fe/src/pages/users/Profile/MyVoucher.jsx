import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ModalVoucher from './ModalVoucher';
import { Button } from '@mui/material';

function CustomTabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <div className="p-3">{children}</div>}
    </div>
  );
}

export default function MyVoucher() {
  const [openModal, setOpenModal] = useState(false);
  const [valueTabs, setValueTabs] = useState(0);
  const [voucherByCode, setVoucherByCode] = useState({});
  const [voucherPublic, setVoucherPublic] = useState([]);
  const [voucherPrivate, setVoucherPrivate] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Dữ liệu giả
  const mockVouchers = {
    public: [
      {
        id: 1,
        code: 'DISCOUNT10',
        name: 'Giảm 10%',
        type: 0,
        typeValue: 0,
        value: 10,
        maximumValue: 100000,
        minimumAmount: 50000,
        startDate: '2024-12-01T00:00:00',
        endDate: '2024-12-31T23:59:59',
        quantity: 100,
      },
      {
        id: 2,
        code: 'PUBLIC',
        name: 'Giảm 15%',
        value: 50000,
        typeValue: 1,
        maximumValue: 200000,
        minimumAmount: 100000,
        startDate: '2024-12-01T00:00:00',
        endDate: '2024-12-31T23:59:59',
        quantity: 100,
      },
    ],
    private: [
      {
        id: 1,
        code: 'DISCOUNT50',
        name: 'Giảm 50.000đ',
        type: 1,
        typeValue: 1,
        value: 50000,
        maximumValue: 50000,
        minimumAmount: 100000,
        startDate: '2024-12-01T00:00:00',
        endDate: '2024-12-31T23:59:59',
        quantity: 50,
      },
      {
        id: 2,
        code: 'PRIVATE2',
        name: 'Giảm 50.000đ',
        value: 30000,
        typeValue: 1,
        maximumValue: 100000,
        minimumAmount: 50000,
        startDate: '2024-12-01T00:00:00',
        endDate: '2024-12-31T23:59:59',
        quantity: 50,
      },
    ],
  };

  const handleChange = (index) => {
    setValueTabs(index);
  };

  const handleOpenModal = (codeVoucher) => {
    const voucher = [...voucherPublic, ...voucherPrivate].find(v => v.code === codeVoucher);
    if (voucher) {
      setVoucherByCode(voucher);
    } else {
      toast.error('Voucher không tìm thấy', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    setOpenModal(true);
  };

  const fetchVoucherPublic = () => {
    // Sử dụng dữ liệu giả
    setVoucherPublic(mockVouchers.public);
  };

  const fetchVoucherPrivate = () => {
    // Sử dụng dữ liệu giả
    setVoucherPrivate(mockVouchers.private);
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
                    <div>
                      <h3 className="text-xl">{v.name}</h3>
                      <p>
                        Giá trị: {v.typeValue === 0 ? 
                          `${v.value} %` : `${new Intl.NumberFormat('vi-VN', {
                                              style: 'currency',
                                              currency: 'VND',
                                            }).format(v.value)}`}
                      </p>
                      <p>
                        Hạn sử dụng:{' '}
                        {new Date(v.startDate).toLocaleDateString()} -{' '}
                        {new Date(v.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Button onClick={() => handleOpenModal(v.code)}
                        className="py-2 px-4 border border-blue-600 text-blue-600 rounded-sm hover:border-blue-700 hover:text-blue-700">
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
                    <div>
                      <h3 className="text-xl">{v.name}</h3>
                      <p>
                        Giá trị: {v.typeValue === 0 ? 
                          `${v.value} %` : `${new Intl.NumberFormat('vi-VN', {
                                              style: 'currency',
                                              currency: 'VND',
                                            }).format(v.value)}`}
                      </p>
                      <p>
                        Hạn sử dụng:{' '}
                        {new Date(v.startDate).toLocaleDateString()} -{' '}
                        {new Date(v.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Button onClick={() => handleOpenModal(v.code)} className="text-blue-500">
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
      {openModal && (
        <ModalVoucher
          voucher={voucherByCode}
          setOpenModal={false}
        />
      )}
    </div>
  );
}