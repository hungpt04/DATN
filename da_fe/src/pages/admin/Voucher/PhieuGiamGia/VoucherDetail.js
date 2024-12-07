import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';
import { AiOutlineDollar, AiOutlinePercentage } from "react-icons/ai";
import ReactPaginate from 'react-paginate';


const VoucherDetail = () => {
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

    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        loadKhachHangSearch(searchKhachHang, selectedPage); // Gọi hàm tìm kiếm với trang mới
        console.log(`User  requested page number ${selectedPage + 1}`);
    };

    const { id } = useParams();
    const navigate = useNavigate();
    const [listCustomer, setListCustomer] = useState([]);
    const [selectAllCustomer, setSelectAllCustomer] = useState(false);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
    const [voucherDetail, setVoucherDetail] = useState(initialVoucher);
    const [errorValue, setErrorValue] = useState('');
    const [isSelectVisible, setIsSelectVisible] = useState(false);
    const [allCustomer, setAllCustomer] = useState([]);

    const handleNavigateToDiscountVoucher = () => {
        navigate('/admin/giam-gia/phieu-giam-gia');
    };

    useEffect(() => {
        fetchData(id);
        handleAllKhachHang();
    }, [id]);

    useEffect(() => {
        fetchListIdKhachHang(id);
    }, [id]);

    const handleAllKhachHang = async () => {
        axios.get("http://localhost:8080/api/voucher/list-khachhang")
            .then((response) => {
                setAllCustomer(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const fetchListIdKhachHang = async (idVoucher) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/khach-hang-voucher/list-id-khach-hang/${idVoucher}`);
            setSelectedCustomerIds(response.data); // Cập nhật trạng thái selectedCustomerIds
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/voucher/detail/${id}`);
            setVoucherDetail(response.data);
        } catch (error) {
            console.error("Error fetching voucher details:", error);
        }
    };

    const handleVoucherUpdate = (idUpdate, voucherDetail) => {
        const title = 'Xác nhận cập nhật phiếu giảm giá?';
        const text = 'Bạn có chắc chắn muốn cập nhật phiếu giảm giá không?';

        // Hiển thị SweetAlert để xác nhận
        swal({
            title: title,
            text: text,
            icon: 'question',
            buttons: {
                cancel: "Hủy",
                confirm: "Xác nhận",
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                const updatedVoucher = {
                    ...voucherDetail,
                    listIdCustomer: selectedCustomerIds // Gửi danh sách ID khách hàng
                };
                // Thực hiện gọi API với axios
                axios.put(`http://localhost:8080/api/voucher/update/${idUpdate}`, updatedVoucher, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        swal("Thành công!", "Cập nhật phiếu giảm giá thành công!", "success");
                        navigate('/admin/giam-gia/phieu-giam-gia');
                    })
                    .catch((error) => {
                        console.error("Lỗi cập nhật:", error);
                        swal("Thất bại!", "Cập nhật phiếu giảm giá thất bại!", "error");
                    });
            }
        });
    }

    const handleSelectAllCustomer = (event) => {
        const selectedIds = event.target.checked ? allCustomer.map((customer) => customer.id) : [];
        setSelectedCustomerIds(selectedIds);
        setSelectAllCustomer(event.target.checked);
    };

    const handleCheckboxChange = (event, customerId) => {
        const  selectedIndex = selectedCustomerIds.indexOf(customerId);
        let newSelectedIds = [];

        if (selectedIndex === -1) {
            newSelectedIds = [...selectedCustomerIds, customerId];
        }else {
            newSelectedIds = [
                ...selectedCustomerIds.slice(0, selectedIndex),
                ...selectedCustomerIds.slice(selectedIndex + 1),
            ]
        }

        setSelectedCustomerIds(newSelectedIds);
        setSelectAllCustomer(newSelectedIds.length === allCustomer.length);
    };

    const handleSetValue = (value, type) => {
        // const numericValue = parseInt(value.replace(/\D/g, ''));
        //
        // if (isNaN(numericValue)) {
        //     setVoucherDetail({
        //         ...voucherDetail,
        //         giaTri: type === 'giaTri' ? 0 : voucherDetail.giaTri,
        //         giaTriMax: type === 'giaTriMax' ? 0 : voucherDetail.giaTriMax,
        //     });
        // } else {
        //     setVoucherDetail({
        //         ...voucherDetail,
        //         giaTri: type === 'giaTri' ? numericValue : voucherDetail.giaTri,
        //         giaTriMax: type === 'giaTriMax' ? numericValue : voucherDetail.giaTriMax,
        //     });
        // }

        const numericValue = parseInt(value.replace(/\D/g, ''), 10) || 0;

        setVoucherDetail({
            ...voucherDetail,
            giaTri: type === 'giaTri' ? numericValue : voucherDetail.giaTri,
            giaTriMax: type === 'giaTriMax' ? numericValue : voucherDetail.giaTriMax,
        });
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
                <span className="text-gray-400 ml-2">/ Chi tiết phiếu giảm giá</span>
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
                                    value={voucherDetail.ma || ''}
                                    onChange={(e) => setVoucherDetail({...voucherDetail, ma: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Tên phiếu giảm giá</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Nhập tên"
                                    value={voucherDetail.ten || ''}
                                    onChange={(e) => setVoucherDetail({...voucherDetail, ten: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Giá trị</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập giá trị"
                                        value={voucherDetail.giaTri || ''}
                                        onChange={(e) => handleSetValue(e.target.value, 'giaTri')}
                                    />
                                    <div className="flex items-center px-2 bg-gray-200 rounded-r-md">
                                        <AiOutlinePercentage
                                            color={voucherDetail?.kieuGiaTri === 0 ? '#fc7c27' : ''}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setVoucherDetail({...voucherDetail, kieuGiaTri: 0, giaTri: 0});
                                            }}
                                        />
                                        <AiOutlineDollar
                                            color={voucherDetail?.kieuGiaTri === 1 ? '#fc7c27' : ''}
                                            className="cursor-pointer ml-2"
                                            onClick={() => {
                                                setVoucherDetail({...voucherDetail, kieuGiaTri: 1, giaTri: 0});
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
                                        value={voucherDetail?.giaTriMax || ''}
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
                                    value={voucherDetail?.soLuong || ''}
                                    onChange={(e) => setVoucherDetail({...voucherDetail, soLuong: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Điều kiện</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập điều kiện"
                                        value={voucherDetail?.dieuKienNhoNhat}
                                        onChange={(e) => setVoucherDetail({
                                            ...voucherDetail,
                                            dieuKienNhoNhat: e.target.value
                                        })}
                                    />
                                    <span className="flex items-center px-4 bg-gray-200 rounded-r-md">đ</span>
                                </div>
                            </div>

                            <div>
                                <label className ="block text-gray-600 mb-1">Từ ngày</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={voucherDetail?.ngayBatDau}
                                    onChange={(e) => setVoucherDetail({...voucherDetail, ngayBatDau: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Đến ngày</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={voucherDetail?.ngayKetThuc}
                                    onChange={(e) => setVoucherDetail({...voucherDetail, ngayKetThuc: e.target.value})}
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
                                            checked={voucherDetail?.kieu === 0}
                                            onChange={(e) => {
                                                setVoucherDetail({
                                                    ...voucherDetail,
                                                    kieu: parseInt(e.target.value)
                                                })
                                                setIsSelectVisible(true);
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
                                            checked={voucherDetail?.kieu === 1}
                                            onChange={(e) => {
                                                setVoucherDetail({ ...voucherDetail, kieu: parseInt(e.target.value)})
                                                setIsSelectVisible(false)
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
                                        disabled={isSelectVisible || voucherDetail.kieu === 0}
                                        type="checkbox"
                                        checked={selectAllCustomer}
                                        onChange={handleSelectAllCustomer}
                                        className="align-middle"
                                    />
                                </th>
                                <th className="py-2 px-4 border-b">Tên</th>
                                <th className="py-2 px-4 border-b">Số điện thoại</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Ngày sinh</th>
                            </tr>
                            </thead>
                            <tbody>
                            {allCustomer.map((customer, index) => (
                                <tr key={customer.id} className="border-b">
                                    <td className="py-2 px-4 text-center">
                                        <input
                                            disabled={isSelectVisible || voucherDetail.kieu === 0}
                                            type="checkbox"
                                            checked={selectedCustomerIds.includes(Number(customer.id))} // Kiểm tra nếu ID nằm trong danh sách đã chọn
                                            onChange={(event) => handleCheckboxChange(event, customer.id)}
                                            className="align-middle"
                                        />
                                    </td>
                                    <td className="py-2 px-4">{customer.hoTen}</td>
                                    <td className="py-2 px-4">{customer.sdt}</td>
                                    <td className="py-2 px-4">{customer.email}</td>
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
                    {/* Button */}
                    <button
                        onClick={() => handleVoucherUpdate(id, voucherDetail)}
                        className="border border-amber-400 hover:bg-gray-100 text-amber-400 py-2 px-4 rounded-md ml-auto flex items-center">
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    )
};

export default VoucherDetail;