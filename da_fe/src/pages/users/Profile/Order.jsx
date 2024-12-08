import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function UserOrder() {
  // Dữ liệu giả lập cho các hóa đơn
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
    // Thêm nhiều hóa đơn giả lập nếu cần
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

  return (
    <div className="order p-4">
      <div className="mb-4">
        <div className="flex space-x-6 border-b border-gray-300 pb-2">
          <button className="text-lg font-semibold">Tất cả</button>
          <button className="text-lg">Đang xử lý</button>
          <button className="text-lg">Đã giao</button>
          <button className="text-lg">Đã hủy</button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm theo mã hóa đơn"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        onChange={(e) => {
          const valueNhap = e.target.value;
          // Kiểm tra ký tự đặc biệt
          const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/;
          if (specialCharsRegex.test(valueNhap)) {
            toast.warning('Tìm kiếm không được có kí tự đặc biệt');
          }
        }}
      />

      <div className="max-h-96 overflow-auto">
        {getBillTable.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">{item.code}</span>
              <span className={`px-2 py-1 text-sm rounded ${item.status === 0 ? 'bg-yellow-200' : item.status === 1 ? 'bg-green-200' : 'bg-red-200'}`}>
                {getStatus(item.status)}
              </span>
            </div>
            <div className="border-t border-gray-300 my-2"></div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm">Ngày đặt hàng: {item.createdAt}</p>
                {item.completeDate ? (
                  <p className="text-sm">Ngày Nhận hàng: {item.completeDate}</p>
                ) : (
                  <p className="text-sm">Ngày dự kiến nhận: {item.desiredReceiptDate}</p>
                )}
                <Link to={`/profile/get-by-idBill/${item.id}`} className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded">
                  Thông tin chi tiết
                </Link>
              </div>
              <div>
                <p className="text-sm">Tiền ship: {formatCurrency(item.moneyShip)}</p>
                <p className="text-sm">Tổng tiền: {formatCurrency(item.moneyAfter)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}