import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import swal from 'sweetalert';
import { AiOutlineDollar, AiOutlinePercentage } from "react-icons/ai";
import ReactPaginate from 'react-paginate';

const CreateVoucher = () => {
    const [pageCount, setPageCount] = useState(0);
    // const [currentPage, setCurrentPage] = useState(0);
    const size = 5;

    const [searchKhachHang, setSearchKhachHang] = useState({
        tenSearch: "",
    })

    const validateSearchInput = (value) => {
        const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
        return !specialCharsRegex.test(value);
    }

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        // Kiểm tra giá trị nhập vào có hợp lệ không
        if (validateSearchInput(inputValue)) {
            setSearchKhachHang((prev) => ({
                ...prev,
                tenSearch: inputValue
            }));

            // Gọi hàm tìm kiếm mỗi khi có sự thay đổi
            loadKhachHangSearch({
                ...searchKhachHang,
                tenSearch: inputValue
            }, 0); // Gọi lại hàm tìm kiếm với trang đầu tiên
        }
    }, [inputValue]); // Chạy khi inputValue thay đổi

    const loadKhachHangSearch = (searchKhachHang, currentPage) => {
        const params = new URLSearchParams({
            tenSearch: searchKhachHang.tenSearch,
            currentPage: currentPage, // Thêm tham số cho trang
            size: size // Kích thước trang cũng có thể được truyền vào nếu cần
        });

        axios.get(`http://localhost:8080/api/voucher/searchKhachHang?${params.toString()}`)
            .then((response) => {
                setAllCustomer(response.data.content);
                setPageCount(response.data.totalPages);
                // setCurrentPage(response.data.currentPage)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

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

        swal({
            title: title,
            text: 'Bạn có chắc chắn muốn thêm phiếu giảm giá không?',
            icon: 'question',
            buttons: {
                cancel: "Hủy",
                confirm: "Xác nhận",
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                const updatedVoucherAdd = { ...voucherAdd, listIdCustomer: selectedCustomerIds };

                axios.post('http://localhost:8080/api/voucher/add', updatedVoucherAdd, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        swal("Thành công!", "Thêm mới phiếu giảm giá thành công!", "success");
                        navigate('/admin/giam-gia/phieu-giam-gia');
                    })
                    .catch((error) => {
                        console.error("Lỗi cập nhật:", error);
                        swal("Thất bại!", "Thêm mới phiếu giảm giá thất bại!", "error");
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

    const formatCurrency = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

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

    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        loadKhachHangSearch(searchKhachHang, selectedPage); // Gọi hàm tìm kiếm với trang mới
        console.log(`User  requested page number ${selectedPage + 1}`);
    };

    return (
        <div>
            <div className="font-bold text-sm">
                <span
                    className="cursor-pointer"
                    onClick={handleNavigateToDiscountVoucher}
                >
                    Phiếu giảm giá
                </span>
                <span className="text-gray-400 ml-2">/ Tạo phiếu giảm giá</span>
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
                                    onChange={(e) => setVoucherAdd({ ...voucherAdd, ma: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Tên phiếu giảm giá</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Nhập tên"
                                    value={voucherAdd.ten}
                                    onChange={(e) => setVoucherAdd({ ...voucherAdd, ten: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Giá trị</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập giá trị"
                                        value={formatCurrency(voucherAdd.giaTri)}
                                        onChange={(e) => handleSetValue(e.target.value, 'giaTri')}
                                    />
                                    <div className="flex items-center px-2 bg-gray-200 rounded-r-md">
                                        <AiOutlinePercentage
                                            color={voucherAdd.kieuGiaTri === 0 ? '#fc7c27' : ''}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setVoucherAdd({ ...voucherAdd, kieuGiaTri: 0, giaTri: 0 });

                                            }}
                                        />
                                        <AiOutlineDollar
                                            color={voucherAdd.kieuGiaTri === 1 ? '#fc7c27' : ''}
                                            className="cursor-pointer ml-2"
                                            onClick={() => {
                                                setVoucherAdd({ ...voucherAdd, kieuGiaTri: 1, giaTri: 0 });

                                            }}
                                        />
                                    </div>
                                </div>

                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Giá trị tối đa</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập giá trị tối đa"
                                        value={formatCurrency(voucherAdd.giaTriMax)}
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
                                    onChange={(e) => setVoucherAdd({ ...voucherAdd, soLuong: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Điều kiện</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập điều kiện"
                                        value={formatCurrency(voucherAdd.dieuKienNhoNhat)}
                                        onChange={(e) => {
                                            const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                            setVoucherAdd({
                                                ...voucherAdd,
                                                dieuKienNhoNhat: numericValue
                                            });
                                        }}
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
                                    onChange={(e) => setVoucherAdd({ ...voucherAdd, ngayBatDau: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Đến ngày</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={voucherAdd.ngayKetThuc}
                                    onChange={(e) => setVoucherAdd({ ...voucherAdd, ngayKetThuc: e.target.value })}
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
                                                setVoucherAdd({ ...voucherAdd, kieu: 0 });
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
                                                setVoucherAdd({ ...voucherAdd, kieu: 1 });
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
                                onChange={(e) => {
                                    const valueNhap = e.target.value;
                                    if (validateSearchInput(valueNhap)) {
                                        setInputValue(valueNhap);
                                    }else {
                                        setInputValue('');
                                        swal('Lỗi!', 'Không được nhập ký tự đặc biệt', 'warning');
                                    }
                                }}
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
                        {/* Pagination */}
                        <div className="flex justify-end mt-4">
                            <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={pageCount}
                                breakLabel="..."
                                containerClassName="pagination flex justify-center items-center space-x-2 mt-6 text-xs"
                                pageClassName="page-item"
                                pageLinkClassName="page-link px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-indigo-500 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
                                previousClassName="page-item"
                                previousLinkClassName="page-link px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-indigo-500 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
                                nextClassName="page-item"
                                nextLinkClassName="page-link px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-indigo-500 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
                                breakClassName="page-item"
                                breakLinkClassName="page-link px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-indigo-500 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
                                activeClassName="active bg-indigo-600 text-white border-indigo-600"
                                disabledClassName="disabled bg-gray-100 text-gray-400 cursor-not-allowed"
                            />
                        </div>
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