import React, {useEffect, useState} from 'react';
import {IoAdd, IoCalendar} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {TbEyeEdit} from "react-icons/tb";
import axios from "axios";
import Swal from "sweetalert2";
import {toast} from "react-toastify";

const Sale = () => {
    const navigate = useNavigate();
    const [listKhuyenMai, setListKhuyenMai] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleCreateNew = () => {
        navigate('/admin/giam-gia/dot-giam-gia/add');
    };

    const handleDetail = (id) => {
        navigate(`/admin/giam-gia/dot-giam-gia/${id}/detail`);
    }

    useEffect(() => {
        fetchListKhuyenMai();
    }, []);

    const fetchListKhuyenMai = async () => {
        try {
            axios.get("http://localhost:8080/api/khuyen-mai/list-khuyen-mai")
                .then((response) => {
                    setListKhuyenMai(response.data);
                })
        } catch (error) {
            console.error('Failed to fetch list khuyen mai: ', error);
        }
    }

    const handelDeleteSale = async (id) => {
        const title = 'Xác nhận xóa phiếu giảm giá?';
        const text = 'Bạn chắc chắn muốn xóa phiếu giảm giá này?';

        if (listKhuyenMai.trangThai === 2) {
            toast.success('Đợt giảm giá đã kết thúc');
        }

        // Hiển thị SweetAlert để xác nhận
        Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                // Thực hiện gọi API với axios
                axios.put(`http://localhost:8080/api/khuyen-mai/delete/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        toast.success('Hủy đợt giảm giá thành công');
                        fetchListKhuyenMai() // Gọi lại hàm loadVoucher để làm mới danh sách
                    })
                    .catch(() => {
                        toast.error('Hủy phiếu đợt giá thất bại');
                    });
            }
        });
    }

    return (
        <div>
            <div className="font-bold text-sm">
                Sale
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg">
                <div className="flex">
                    {/* search */}
                    <input
                        type="text"
                        placeholder="Tìm phiếu theo tên đợt giảm giá"
                        className="border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md px-4 py-2 text-gray-700 w-1/2"
                    />
                    {/* Button Group */}
                    <div className="ml-auto flex space-x-4">
                        {/* Export Button */}
                        <button className="border border-amber-400 text-amber-400 px-4 py-2 rounded-md hover:bg-gray-100">
                            Xuất Excel
                        </button>

                        {/* Add New Button */}
                        <button
                            onClick={handleCreateNew}
                            className="border border-amber-400 hover:bg-gray-100 text-amber-400 py-2 px-4 rounded-md flex items-center">
                            <span className="mr-2 text-2xl"><IoAdd /></span>
                            Thêm mới
                        </button>
                    </div>
                </div>
                {/* fillter */}
                <div className="flex space-x-4 pt-4 pb-4">
                    <input
                        type="date"
                        placeholder="Từ ngày"
                        className="border border-gray-300 rounded-md px-4 py-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-gray-200"
                        onChange={(e) => {
                            // const newNgayBatDauSearch = e.target.value;
                            // setSearchVoucher({
                            //     ...searchVoucher,
                            //     ngayBatDauSearch: newNgayBatDauSearch
                            // });
                            // loadVoucherSearch({
                            //     ...searchVoucher,
                            //     ngayBatDauSearch: newNgayBatDauSearch
                            // }, 0);
                        }}
                    />
                    <input
                        type="date"
                        placeholder="Đến ngày"
                        className="border border-gray-300 rounded-md px-4 py-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-gray-200"
                        onChange={(e) => {
                            // const newNgayKetThucSearch = e.target.value;
                            // setSearchVoucher({
                            //     ...searchVoucher,
                            //     ngayKetThucSearch: newNgayKetThucSearch
                            // });
                            // loadVoucherSearch({
                            //     ...searchVoucher,
                            //     ngayKetThucSearch: newNgayKetThucSearch
                            // }, 0);
                        }}
                    />

                    {/* Trạng thái Dropdown */}
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-700 font-semibold">Trạng thái:</label>
                        <select
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200">
                            <option value="">Trạng thái</option>
                            <option value={0}>Sắp diễn ra</option>
                            <option value={1}>Đang hoạt động</option>
                            <option value={2}>Đã kết thúc</option>
                        </select>
                    </div>

                    {/* Giá trị Dropdown */}
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-700 font-semibold">Giá trị:</label>
                        <select
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200">
                            <option value="">Giá trị</option>
                            <option value={10}>Tăng dần</option>
                            <option value={50}>Giảm dần</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg mt-4">
                {/* table */}
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100 text-gray-700">
                        <th className="py-2 px-4 text-left border-b">STT</th>
                        <th className="py-2 px-4 text-left border-b">Tên đợt giảm giá</th>
                        <th className="py-2 px-4 text-left border-b">Giá trị</th>
                        <th className="py-2 px-4 text-left border-b">Trạng thái</th>
                        <th className="py-2 px-4 text-left border-b">Ngày bắt đầu</th>
                        <th className="py-2 px-4 text-left border-b">Ngày kết thúc</th>
                        <th className="py-2 px-4 text-left border-b">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        listKhuyenMai && listKhuyenMai.length > 0 && listKhuyenMai.map((sale, index) => {
                            return (
                                <tr key={sale.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{index + 1}</td>
                                    <td className="py-2 px-4 border-b">{sale.ten}</td>
                                    <td className="py-2 px-4 border-b">{sale.giaTri}%</td>
                                    <td className="py-2 px-4 border-b">
                                        <span
                                            className={`py-1 px-3 rounded-full text-xs whitespace-nowrap ${
                                                sale.trangThai === 2
                                                    ? 'bg-red-200 text-red-700 border border-red-800'
                                                    : sale.trangThai === 1
                                                        ? 'bg-green-200 text-green-700 border border-green-800'
                                                        : 'bg-gray-200 text-gray-700 border border-gray-800'
                                            }`}
                                            onClick={
                                                sale.trangThai === 2
                                                    ? undefined
                                                    : () => handelDeleteSale(sale.id)
                                            }
                                            style={{
                                                cursor: sale.trangThai === 2 ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {sale.trangThai === 2
                                                ? "Đã kết thúc"
                                                : sale.trangThai === 1
                                                    ? "Đang diễn ra"
                                                    : "Sắp diễn ra"}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b">{new Date(sale.tgBatDau).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                    </td>
                                    <td className="py-2 px-4 border-b">{new Date(sale.tgKetThuc).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => handleDetail(sale.id)}
                                            className="text-2xl text-amber-400">
                                            <TbEyeEdit/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    {listKhuyenMai && listKhuyenMai.length === 0 && (
                        <tr>
                            <td colSpan="7" className="py-4 text-center">
                                Not found data
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sale;