import React, { useEffect, useState } from 'react';
import { IoAdd } from "react-icons/io5";
import { TbEyeEdit } from "react-icons/tb";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import ReactPaginate from "react-paginate";
import numeral from 'numeral';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ExcelJS from 'exceljs'

const DiscountVoucher = () => {
    const [listVoucher, setListVoucher] = useState([]);
    const [listVoucherEx, setListVoucherEx] = useState([])
    const navigate = useNavigate();
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const size = 5;

    const [searchVoucher, setSearchVoucher] = useState({
        tenSearch: "",
        ngayBatDauSearch: null,
        ngayKetThucSearch: null,
        kieuSearch: "",
        kieuGiaTriSearch: "",
        trangThaiSearch: "",
    })

    const validateSearchInput = (value) => {
        const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
        return !specialCharsRegex.test(value);
    }

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        // Kiểm tra giá trị nhập vào có hợp lệ không
        if (validateSearchInput(inputValue)) {
            setSearchVoucher((prev) => ({
                ...prev,
                tenSearch: inputValue
            }));

            // Gọi hàm tìm kiếm mỗi khi có sự thay đổi
            loadVoucherSearch({
                ...searchVoucher,
                tenSearch: inputValue
            }, 0); // Gọi lại hàm tìm kiếm với trang đầu tiên
        }
    }, [inputValue]); // Chạy khi inputValue thay đổi

    const handleCreateNew = () => {
        navigate('/admin/giam-gia/phieu-giam-gia/add');
    };

    const handleDetail = (id) => {
        navigate(`/admin/giam-gia/phieu-giam-gia/${id}/detail`);
    }

    const loadVoucherSearch = (searchVoucher, currentPage) => {

        const params = new URLSearchParams({
            tenSearch: searchVoucher.tenSearch || "",
            ngayBatDauSearch: searchVoucher.ngayBatDauSearch
                ? dayjs(searchVoucher.ngayBatDauSearch).format('YYYY-MM-DDTHH:mm:ss')
                : "",
            ngayKetThucSearch: searchVoucher.ngayKetThucSearch
                ? dayjs(searchVoucher.ngayKetThucSearch).format('YYYY-MM-DDTHH:mm:ss')
                : "",
            kieuSearch: searchVoucher.kieuSearch || "",
            kieuGiaTriSearch: searchVoucher.kieuGiaTriSearch || "",
            trangThaiSearch: searchVoucher.trangThaiSearch || "",
            currentPage: currentPage,
            size: size
        });

        console.log("Search Params:", Object.fromEntries(params)); // Để kiểm tra các tham số

        axios.get(`http://localhost:8080/api/voucher/search?${params.toString()}`)
            .then((response) => {
                setListVoucher(response.data.content);
                setPageCount(response.data.totalPages);
                setCurrentPage(response.data.currentPage)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        loadVoucherSearch(searchVoucher, 0);
    }, [searchVoucher])


    const handelDeleteVoucher = (id) => {
        const title = 'Xác nhận xóa phiếu giảm giá?';
        const text = 'Bạn chắc chắn muốn xóa phiếu giảm giá này?';

        // Hiển thị SweetAlert để xác nhận
        swal({
            title: title,
            text: text,
            icon: 'warning',
            buttons: {
                cancel: "Hủy",
                confirm: "Xác nhận",
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                // Thực hiện gọi API với axios
                axios.delete(`http://localhost:8080/api/voucher/delete/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        swal('Thành công!', 'Hủy phiếu giảm giá thành công', 'success');
                        loadVoucherSearch(searchVoucher, currentPage); // Gọi lại hàm loadVoucher để làm mới danh sách
                    })
                    .catch((error) => {
                        console.error("Lỗi cập nhật:", error);
                        swal('Thất bại!', 'Hủy phiếu giảm giá thất bại', 'error');
                    });
            }
        });
    }

    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        loadVoucherSearch(searchVoucher, selectedPage); // Gọi hàm tìm kiếm với trang mới
        console.log(`User  requested page number ${selectedPage + 1}`);
    };

    const formatCurrency = (money) => {
        return numeral(money).format('0,0') + ' ₫'
    }

    const getAllVoucherExcel = () => {
        axios.get(`http://localhost:8080/api/voucher/hien-thi`)
        .then((response) => {
            setListVoucherEx(response.data);
        })
        .catch((error) => {
            console.error("Có lỗi xảy ra:", error);
        });
    };

    useEffect(() => {
        getAllVoucherExcel();
    }, [])
    
    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('VoucherData')
    
        const columns = [
          { header: 'STT', key: 'stt', width: 5 },
          { header: 'Mã', key: 'ma', width: 8 },
          { header: 'Tên', key: 'ten', width: 15 },
          { header: 'Kiểu', key: 'kieu', width: 15 },
          { header: 'Loại', key: 'kieuGiaTri', width: 15 },
          { header: 'Ngày bắt đầu', key: 'ngayBatDau', width: 17.5 },
          { header: 'Ngày kết thúc', key: 'ngayKetThuc', width: 17.5 },
          { header: 'Trạng thái', key: 'trangThai', width: 20 },
        ]
    
        worksheet.columns = columns
    
        listVoucherEx.forEach((item, index) => {
          worksheet.addRow({
            stt: index + 1,
            ma: item.ma,
            ten: item.ten,
            kieu: item.kieu === 0 ? 'Công khai' : 'Cá nhân',
            kieuGiaTri: item.kieuGiaTri === 0 ? 'Phần trăm' : 'Giá tiền',
            ngayBatDau: dayjs(item.ngayBatDau).format('DD/MM/YYYY HH:mm'),
            ngayKetThuc: dayjs(item.ngayKetThuc).format('DD/MM/YYYY HH:mm'),
            trangThai:
              item.trangThai === 2 ? 'Đã kết thúc' : item.trangThai === 1 ? 'Đang diễn ra' : 'Sắp diễn ra',
          })
        })
    
        const titleStyle = {
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF008080' },
          },
        }
    
        worksheet.getRow(1).eachCell((cell) => {
          cell.style = titleStyle
        })
    
        worksheet.columns.forEach((column) => {
          const { width } = column
          column.width = width
        })
    
        const blob = workbook.xlsx.writeBuffer().then(
          (buffer) =>
            new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
        )
        blob.then((blobData) => {
          const url = window.URL.createObjectURL(blobData)
          const link = document.createElement('a')
          link.href = url
          link.download = 'voucher_data.xlsx'
          link.click()
        })
      }

    return (
        <div>
            <div className="font-bold text-sm">
                Phiếu giảm giá
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg">
                <div className="flex">
                    {/* search */}
                    <input
                        type="text"
                        placeholder="Tìm phiếu giảm giá theo mã hoặc tên"
                        className="border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md px-4 py-2 text-gray-700 w-1/2"
                        onChange={(e) => {
                            const valueNhap = e.target.value;
                            if (validateSearchInput(valueNhap)) {
                                setInputValue(valueNhap);
                            } else {
                                setInputValue('');
                                swal('Lỗi!', 'Không được nhập ký tự đặc biệt', 'warning');
                            }
                        }}
                    />
                    {/* button */}
                    <button
                        onClick={handleCreateNew}
                        className="border border-amber-400 hover:bg-gray-100 text-amber-400 py-2 px-4 rounded-md ml-auto flex items-center">
                        <span className="mr-2 text-2xl"><IoAdd /></span>
                        Tạo mới
                    </button>
                </div>
                {/* fillter */}
                <div className="flex space-x-4 pt-4 pb-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="flex items-center space-x-2">
                            <DateTimePicker
                                format={'DD-MM-YYYY HH:mm'}
                                label="Từ ngày"
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        className: 'w-[200px]'
                                    },
                                    actionBar: {
                                        actions: ['clear', 'today']
                                    }
                                }}
                                value={searchVoucher.ngayBatDauSearch}
                                onChange={(newValue) => {
                                    setSearchVoucher({
                                        ...searchVoucher,
                                        ngayBatDauSearch: newValue
                                    });
                                    loadVoucherSearch({
                                        ...searchVoucher,
                                        ngayBatDauSearch: newValue
                                    }, 0);
                                }}
                            />
                            <DateTimePicker
                                format={'DD-MM-YYYY HH:mm'}
                                label="Đến ngày"
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        className: 'w-[200px]'
                                    },
                                    actionBar: {
                                        actions: ['clear', 'today']
                                    }
                                }}
                                value={searchVoucher.ngayKetThucSearch}
                                onChange={(newValue) => {
                                    setSearchVoucher({
                                        ...searchVoucher,
                                        ngayKetThucSearch: newValue
                                    });
                                    loadVoucherSearch({
                                        ...searchVoucher,
                                        ngayKetThucSearch: newValue
                                    }, 0);
                                }}
                            />
                        </div>
                    </LocalizationProvider>

                    <div className="flex items-center space-x-2">
                        <label className="text-gray-700 font-semibold">Kiểu:</label>
                        <div className="relative">
                            <select
                                value={searchVoucher.kieuSearch}
                                onChange={(e) => {
                                    const newKieuSearch = e.target.value;
                                    setSearchVoucher({
                                        ...searchVoucher,
                                        kieuSearch: newKieuSearch
                                    });
                                    loadVoucherSearch({
                                        ...searchVoucher,
                                        kieuSearch: newKieuSearch
                                    }, 0);
                                }}
                                className="
                                    appearance-none 
                                    bg-transparent 
                                    text-amber-400
                                    py-2 
                                    px-3
                                    focus:border-blue-500 
                                    focus:outline-none 
                                    cursor-pointer
                                "
                            >
                                <option
                                    value=""
                                    className="bg-white text-gray-700"
                                >
                                    Kiểu
                                </option>
                                <option
                                    value={0}
                                    className="bg-white text-gray-700"
                                >
                                    Công khai
                                </option>
                                <option
                                    value={1}
                                    className="bg-white text-gray-700"
                                >
                                    Cá nhân
                                </option>
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-gray-700 font-semibold">Loại:</label>
                        <div className="relative">
                            <select
                                value={searchVoucher.kieuGiaTriSearch}
                                onChange={(e) => {
                                    const newKieuGiaTriSearch = e.target.value;
                                    setSearchVoucher({
                                        ...searchVoucher,
                                        kieuGiaTriSearch: newKieuGiaTriSearch
                                    });
                                    loadVoucherSearch({
                                        ...searchVoucher,
                                        kieuGiaTriSearch: newKieuGiaTriSearch
                                    }, 0);
                                }}
                                className="
                                    appearance-none 
                                    bg-transparent 
                                    text-amber-400
                                    py-2 
                                    px-3
                                    focus:border-blue-500 
                                    focus:outline-none 
                                    cursor-pointer
                                    "
                                >
                                <option
                                    value=""
                                    className="bg-white text-gray-700"
                                >
                                    Loại
                                </option>
                                <option
                                    value={0}
                                    className="bg-white text-gray-700"
                                >
                                    Phần trăm
                                </option>
                                <option
                                    value={1}
                                    className="bg-white text-gray-700"
                                >
                                    Giá tiền
                                </option>
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-gray-700 font-semibold">Trạng thái:</label>
                        <div className="relative">
                            <select
                                value={searchVoucher.trangThaiSearch}
                                onChange={(e) => {
                                    const newTrangThaiSearch = e.target.value;
                                    setSearchVoucher({
                                        ...searchVoucher,
                                        trangThaiSearch: newTrangThaiSearch
                                    });
                                    loadVoucherSearch({
                                        ...searchVoucher,
                                        trangThaiSearch: newTrangThaiSearch
                                    }, 0);
                                }}
                                className="
                                    appearance-none 
                                    bg-transparent 
                                    text-amber-400
                                    py-2 
                                    px-3
                                    focus:border-blue-500 
                                    focus:outline-none 
                                    cursor-pointer
                                    "
                                >
                                <option
                                    value=""
                                    className="bg-white text-gray-700"
                                >
                                    Trạng thái
                                </option>
                                <option
                                    value={0}
                                    className="bg-white text-gray-700"
                                >
                                    Sắp diễn ra
                                </option>
                                <option
                                    value={1}
                                    className="bg-white text-gray-700"
                                >
                                    Đang diễn ra
                                </option>
                                <option
                                    value={2}
                                    className="bg-white text-gray-700"
                                >
                                    Đã kết thúc
                                </option>
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Export Button */}
                    <button onClick={exportToExcel} className="border border-amber-400 text-amber-400 px-4 py-2 rounded-md hover:bg-gray-100">
                        Xuất Excel
                    </button>
                </div>
                {/* table */}
                <table className="min-w-full text-center table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-2 px-4 text-center border-b">STT</th>
                            <th className="py-2 px-4 text-center border-b">Mã</th>
                            <th className="py-2 px-4 text-center border-b">Tên</th>
                            <th className="py-2 px-4 text-center border-b">Kiểu</th>
                            <th className="py-2 px-4 text-center border-b">Loại</th>
                            <th className="py-2 px-4 text-center border-b">Số lượng</th>
                            <th className="py-2 px-4 text-center border-b">Ngày bắt đầu</th>
                            <th className="py-2 px-4 text-center border-b">Ngày kết thúc</th>
                            <th className="py-2 px-4 text-center border-b">Trạng thái</th>
                            <th className="py-2 px-4 text-center border-b">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listVoucher && listVoucher.length > 0 && listVoucher.map((item, index) => {
                                const stt = (currentPage * 5) + index + 1;
                                return (
                                    <tr key={`${index}`} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{stt}</td>
                                        <td className="py-2 px-4 border-b">{item.ma}</td>
                                        <td className="py-2 px-4 border-b">{item.ten}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span
                                                className={`py-1 px-3 rounded-full text-xs whitespace-nowrap ${item.kieu === 0
                                                    ? 'bg-purple-200 text-purple-600 border border-purple-700'
                                                    : item.kieu === 1
                                                        ? 'bg-yellow-200 text-yellow-600 border border-yellow-700'
                                                        : 'bg-gray-200 text-gray-700 border border-gray-800'
                                                    }`}>
                                                {item.kieu === 0 ? "Công khai" : item.kieu === 1 ? "Cá nhân" : "Chưa xác định"}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {item.kieuGiaTri === 0 ? item.giaTri + "%" : formatCurrency(item.giaTri)}
                                        </td>
                                        <td className="py-2 px-4 border-b">{item.soLuong}</td>
                                        <td className="py-2 px-4 border-b">{dayjs(item.ngayBatDau).format('DD/MM/YYYY HH:mm')}</td>
                                        <td className="py-2 px-4 border-b">{dayjs(item.ngayKetThuc).format('DD/MM/YYYY HH:mm')}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span
                                                className={`py-1 px-3 rounded-full text-xs whitespace-nowrap ${item.trangThai === 2
                                                    ? 'bg-red-200 text-red-700 border border-red-800'
                                                    : item.trangThai === 1
                                                        ? 'bg-green-200 text-green-700 border border-green-800'
                                                        : 'bg-gray-200 text-gray-700 border border-gray-800'
                                                    }`}
                                                onClick={
                                                    item.trangThai === 2
                                                        ? undefined // Không có hành động khi trạng thái là "Đã kết thúc".
                                                        : () => handelDeleteVoucher(item.id) // Chỉ xử lý click khi trạng thái khác 2.
                                                }
                                                style={{
                                                    cursor: item.trangThai === 2 ? 'not-allowed' : 'pointer', // Đổi con trỏ chuột khi không được click.
                                                }}
                                            >
                                                {item.trangThai === 2
                                                    ? "Đã kết thúc"
                                                    : item.trangThai === 1
                                                        ? "Đang diễn ra"
                                                        : "Sắp diễn ra"}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleDetail(item.id)}
                                                className="text-2xl text-amber-400">
                                                <TbEyeEdit />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        {listVoucher && listVoucher.length === 0 && (
                            <tr>
                                <td colSpan="12" className="py-4 text-center">
                                    Not found data
                                </td>
                            </tr>
                        )}
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
    );
};

export default DiscountVoucher;