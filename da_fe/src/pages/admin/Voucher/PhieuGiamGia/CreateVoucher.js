import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import {AiOutlineDollar, AiOutlinePercentage} from "react-icons/ai";

const CreateVoucher = () => {
    const initialVoucher = {
        ma: '',
        ten: '',
        giaTri: '',
        giaTriMax: '',
        kieu: 0,
        kieuGiaTri: 0,
        dieuKienNhoNhat: '',
        soLuong: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        trangThai: 0,
        listIdCustomer: []
    }

    const navigate = useNavigate();
    const [listCustomer, setListCustomer] = useState([]);
    const [selectAllCustomer, setSelectAllCustomer] = useState(false);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
    const [voucherAdd, setVoucherAdd] = useState(initialVoucher);
    const [errorValue, setErrorValue] = useState('');
    const [allCustomer, setAllCustomer] = useState([]);
    const [isSelectVisible, setIsSelectVisible] = useState(false);

    const handleNavigateToDiscountVoucher = () => {
        navigate('/admin/giam-gia/phieu-giam-gia');
    };

    useEffect(() => {
        handleAllKhachHang();
    }, []);

    const handleAllKhachHang = async () => {
        axios.get("http://localhost:8080/api/voucher/list-khachhang")
            .then((response) => {
                console.log('List customer:', response.data);
                setAllCustomer(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleVoucherAdd = () => {
        const title = 'Xác nhận thêm mới phiếu giảm giá?';
        const text = '';

        Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedVoucherAdd = { ...voucherAdd, listIdCustomer: selectedCustomerIds };

                axios.post('http://localhost:8080/api/voucher/add', updatedVoucherAdd, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        toast.success('Thêm mới phiếu giảm giá thành công');
                        navigate('/admin/giam-gia/phieu-giam-gia');
                    })
                    .catch(() => {
                        toast.error('Thêm mới phiếu giảm giá thất bại');
                    });
            }
        });
    }

    const handleSelectAllCustomer = (event) => {
        const allCustomerIds = allCustomer.map((customer) => customer.id);
        const selectedIds = event.target.checked ? [...selectedCustomerIds, ...allCustomerIds] : []

        setSelectedCustomerIds(selectedIds)
        setSelectAllCustomer(event.target.checked)
    };

    const handleCheckboxChange = (event, customerId) => {
        const selectedIndex = selectedCustomerIds.indexOf(customerId)
        let newSelectedIds = []

        if (selectedIndex === -1) {
            newSelectedIds = [...selectedCustomerIds, customerId]
        } else {
            newSelectedIds = [
                ...selectedCustomerIds.slice(0, selectedIndex),
                ...selectedCustomerIds.slice(selectedIndex + 1),
            ]
        }

        setSelectedCustomerIds(newSelectedIds)
        setSelectAllCustomer(newSelectedIds.length === allCustomer.length)
    }

    const handleSetValue = (value, type) => {
        const numericValue = parseInt(value.replace(/\D/g, ''));

        if (isNaN(numericValue)) {
            setVoucherAdd({
                ...voucherAdd,
                giaTri: type === 'giaTri' ? 0 : voucherAdd.giaTri,
                giaTriMax: type === 'giaTriMax' ? 0 : voucherAdd.giaTriMax,
            });
        } else {
            setVoucherAdd({
                ...voucherAdd,
                giaTri: type === 'giaTri' ? numericValue : voucherAdd.giaTri,
                giaTriMax: type === 'giaTriMax' ? numericValue : voucherAdd.giaTriMax,
            });
        }
    };

    return (
        <div>
            <div className="font-bold text-sm">
                <span
                    className="cursor-pointer"
                    onClick={handleNavigateToDiscountVoucher}
                >
                    Discount Voucher
                </span>
                <span className="text-gray-400 ml-2">/ Create Voucher</span>
            </div>


            <div className="p-4 bg-white rounded-md shadow-lg">
                <div className="flex">
                    {/* Left Side - Form */}
                    <div className="w-1/3 pr-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Mã phiếu giảm giá</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Nhập mã"
                                    value={voucherAdd.ma}
                                    onChange={(e) => setVoucherAdd({...voucherAdd, ma: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Tên phiếu giảm giá</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Nhập tên"
                                    value={voucherAdd.ten}
                                    onChange={(e) => setVoucherAdd({...voucherAdd, ten: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Giá trị</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập giá trị"
                                        value={voucherAdd.giaTri}
                                        onChange={(e) => handleSetValue(e.target.value, 'giaTri')}
                                    />
                                    <div className="flex items-center px-2 bg-gray-200 rounded-r-md">
                                        <AiOutlinePercentage
                                            color={voucherAdd.kieuGiaTri === 0 ? '#fc7c27' : ''}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setVoucherAdd({...voucherAdd, kieuGiaTri: 0, giaTri: 0});

                                            }}
                                        />
                                        <AiOutlineDollar
                                            color={voucherAdd.kieuGiaTri === 1 ? '#fc7c27' : ''}
                                            className="cursor-pointer ml-2"
                                            onClick={() => {
                                                setVoucherAdd({...voucherAdd, kieuGiaTri: 1, giaTri: 0});

                                            }}
                                        />
                                    </div>
                                </div>
                                {errorValue && <p className="text-red-500 text-sm mt-1">{errorValue}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Giá trị tối đa</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập giá trị tối đa"
                                        value={voucherAdd.giaTriMax}
                                        onChange={(e) => handleSetValue(e.target.value, 'giaTriMax')}
                                    />
                                    <span className="flex items-center px-4 bg-gray-200 rounded-r-md">đ</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Số lượng</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Nhập số lượng"
                                    value={voucherAdd.soLuong}
                                    onChange={(e) => setVoucherAdd({...voucherAdd, soLuong: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Điều kiện</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập điều kiện"
                                        value={voucherAdd.dieuKienNhoNhat}
                                        onChange={(e) => setVoucherAdd({
                                            ...voucherAdd,
                                            dieuKienNhoNhat: e.target.value
                                        })}
                                    />
                                    <span className="flex items-center px-4 bg-gray-200 rounded-r-md">đ</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Từ ngày</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={voucherAdd.ngayBatDau}
                                    onChange={(e) => setVoucherAdd({...voucherAdd, ngayBatDau: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Đến ngày</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={voucherAdd.ngayKetThuc}
                                    onChange={(e) => setVoucherAdd({...voucherAdd, ngayKetThuc: e.target.value})}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-gray-600 mb-1">Kiểu</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="kieu"
                                            value={0}
                                            checked={isSelectVisible === false}
                                            onChange={(e) => {
                                                setIsSelectVisible(false);
                                                setVoucherAdd({...voucherAdd, kieu: 0});
                                            }}
                                            className="mr-2"
                                        />
                                        Công khai
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="kieu"
                                            value={1}
                                            checked={isSelectVisible === true}
                                            onChange={() => {
                                                setIsSelectVisible(true);
                                                setVoucherAdd({...voucherAdd, kieu: 1});
                                                setSelectAllCustomer(false);
                                            }}
                                            className="mr-2"
                                        />
                                        Cá nhân
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Side - Search and Table */}
                    <div className="w-2/3 pl-4">
                        {/* Search */}
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-1">Tìm kiếm khách hàng</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Tìm kiếm khách hàng"
                            />
                        </div>

                        {/* Table */}
                        <table className="min-w-full border border-gray-200">
                            <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="py-2 px-4 border-b text-center">
                                    <input
                                        disabled={voucherAdd.kieu === 0}
                                        type="checkbox"
                                        checked={selectAllCustomer}
                                        onChange={handleSelectAllCustomer}
                                        className="align-middle"
                                    />
                                </th>
                                <th className="py-2 px-4 border-b text-center">Tên</th>
                                <th className="py-2 px-4 border-b text-center">Số điện thoại</th>
                                <th className="py-2 px-4 border-b text-center">Email</th>
                                <th className="py-2 px-4 border-b text-center">Ngày sinh</th>
                            </tr>
                            </thead>
                            <tbody>
                            {allCustomer.map((customer) => (
                                <tr key={customer.id} className="border-b text-center">
                                    <td className="py-2 px-4 border-b text-center">
                                        <input
                                            disabled={voucherAdd.kieu === 0}
                                            type="checkbox"
                                            checked={selectedCustomerIds.indexOf(customer.id) !== -1}
                                            onChange={(event) => handleCheckboxChange(event, customer.id)}
                                            className="align-middle"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">{customer.hoTen}</td>
                                    <td className="py-2 px-4 border-b text-center">{customer.sdt}</td>
                                    <td className="py-2 px-4 border-b text-center">{customer.email}</td>
                                    <td className="py-2 px-4 border-b text-center">{new Date(customer.ngaySinh).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    })}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="pt-4">
                    {/*Button*/}
                    <button
                        onClick={() => handleVoucherAdd()}
                        className="border border-amber-400 hover:bg-gray-100 text-amber-400 py-2 px-4 rounded-md ml-auto flex items-center">
                        Thêm mới
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateVoucher;