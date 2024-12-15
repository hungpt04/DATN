import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import package_icon from '../../../components/Assets/package_icon.png'
export default function UserOrder() {
  const [selectedTab, setSelectedTab] = useState('Tất cả');

  const tabs = ['Tất cả', 'Chờ xác nhận', 'Vận chuyển', 'Chờ giao hàng', 'Hoàn thành', 'Đã hủy'];
  const getBillTable = [
    {
      id: 1,
      code: 'HD001',
      status: 0,
      createdAt: '2023-10-01',
      completeDate: '2023-10-05',
      desiredReceiptDate: '2023-10-04',
      moneyShip: 20000,
      moneyAfter: 500000,
    },
    {
      id: 2,
      code: 'HD002',
      status: 1,
      createdAt: '2023-10-02',
      completeDate: null,
      desiredReceiptDate: '2023-10-06',
      moneyShip: 15000,
      moneyAfter: 300000,
    },
  ];

  const getStatus = (status) => {
    const statuses = ['Đang xử lý', 'Đã giao', 'Đã hủy'];
    return statuses[status] || 'Không xác định';
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  const filteredBills = getBillTable.filter((bill) => {
    if (selectedTab === 'Tất cả') return true;
    if (selectedTab === 'Chờ xác nhận') return bill.status === 0;
    if (selectedTab === 'Vận chuyển') return bill.status === 1;
    if (selectedTab === 'Chờ giao hàng') return bill.status === 0;
    if (selectedTab === 'Hoàn thành') return bill.status === 1;
    if (selectedTab === 'Đã hủy') return bill.status === 2;
    return false;
  });

  return (
    <div className="order p-4">
      {/* Tabs */}
      <div className="mb-4">
        <div className="flex space-x-6 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 text-base font-medium hover:text-indigo-600 ${selectedTab === tab ? "py-2 border-b-2 border-indigo-600 text-indigo-600" : ""
                }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </span>
        <input
          type="text"
          placeholder="Tìm kiếm theo mã hóa đơn"
          className="w-full p-2 pl-10 focus:outline-none border border-gray-400 rounded-sm"
          onChange={(e) => {
            const valueNhap = e.target.value;
            const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/;
            if (specialCharsRegex.test(valueNhap)) {
              toast.warning('Tìm kiếm không được có kí tự đặc biệt');
            }
          }}
        />
      </div>

      {/* Bills List */}
      <div className="max-h-96 overflow-auto">
        {filteredBills.length > 0 ? (
          filteredBills.map((item) => (
            <div key={item.id} className="bg-white p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">{item.code}</span>
                <span
                  className={`px-2 py-1 text-sm rounded-sm ${item.status === 0 ? 'bg-yellow-200' : item.status === 1 ? 'bg-green-200' : 'bg-red-200'
                    }`}
                >
                  {getStatus(item.status)}
                </span>
              </div>
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Ngày đặt hàng: {item.createdAt}</p>
                  {item.completeDate ? (
                    <p className="text-sm">Ngày nhận hàng: {item.completeDate}</p>
                  ) : (
                    <p className="text-sm">Ngày dự kiến nhận: {item.desiredReceiptDate}</p>
                  )}
                  <Link
                    to={`/profile/get-by-idBill/${item.id}`}
                    className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded-sm"
                  >
                    Thông tin chi tiết
                  </Link>
                </div>
                <div>
                  <p className="text-sm">Tiền ship: {formatCurrency(item.moneyShip)}</p>
                  <p className="text-sm">Tổng tiền: {formatCurrency(item.moneyAfter)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Thông báo khi không có hóa đơn
          <div className="flex flex-col items-center justify-center text-gray-500 mt-4">
            <img src={package_icon} alt="" className="w-20 h-20 opacity-70"/>
            <p>Chưa có đơn hàng</p>
          </div>
        )}
      </div>

    </div>
  );
}
