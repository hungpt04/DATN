import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import swal from 'sweetalert';
import { AiOutlineDollar, AiOutlinePercentage } from "react-icons/ai";
import ReactPaginate from 'react-paginate';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CircularProgress } from '@mui/material';

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
        ngayBatDau: null,
        ngayKetThuc: null,
        trangThai: 0,
        listIdCustomer: []
    }

    const [pageCount, setPageCount] = useState(0);
    const size = 5;
    const navigate = useNavigate();
    const [selectAllCustomer, setSelectAllCustomer] = useState(false);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
    const [voucherAdd, setVoucherAdd] = useState(initialVoucher);
    const [allCustomer, setAllCustomer] = useState([]);
    const [isSelectVisible, setIsSelectVisible] = useState(false);
    const [allMaVoucher, setAllMaVoucher] = useState([])
    const [allTenVoucher, setAllTenVoucher] = useState([])
    const [errorMa, setErrorMa] = useState('')
    const [errorTen, setErrorTen] = useState('')
    const [errorGiaTri, setErrorGiaTri] = useState('')
    const [errorGiaTriMax, setErrorGiaTriMax] = useState('')
    const [errorDieuKienNhoNhat, setErrorDieuKienNhoNhat] = useState('')
    const [errorSoLuong, setErrorSoLuong] = useState('')
    const [errorNgayBatDau, setErrorNgayBatDau] = useState('')
    const [errorNgayKetThuc, setErrorNgayKetThuc] = useState('')
    const [giaTriDefault, setGiaTriDefault] = useState(0)
    const [giaTriMaxDefault, setGiaTriMaxDefault] = useState(0)
    const [soLuongDefault, setSoLuongDefault] = useState(0)
    const [dieuKienNhoNhatDefault, setDieuKienNhoNhatDefault] = useState(0)
    const [loading, setLoading] = useState(false)
    const [confirmClicked, setConfirmClicked] = useState(false)

    const listMa = []
    allMaVoucher.map((m) => listMa.push(m.toLowerCase()))
    const listTen = []
    allTenVoucher.map((m) => listTen.push(m.toLowerCase()))

    const handleNavigateToDiscountVoucher = () => {
        navigate('/admin/giam-gia/phieu-giam-gia');
    };

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


    const handleAllMaVoucher = () => {
        axios.get(`http://localhost:8080/api/voucher/list-ma-voucher`)
            .then((response) => {
                setAllMaVoucher(response.data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }

    const handleAllTenVoucher = () => {
        axios.get(`http://localhost:8080/api/voucher/list-ten-voucher`)
            .then((response) => {
                setAllTenVoucher(response.data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }

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

    useEffect(() => {
        handleAllKhachHang();
        handleAllMaVoucher();
        handleAllTenVoucher();
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

    const handleValidation = () => {
        let check = 0
        const errors = {
            ma: '',
            ten: '',
            giaTri: '',
            giaTriMax: '',
            soLuong: '',
            dieuKienNhoNhat: '',
            ngayBatDau: '',
            ngayKetThuc: '',
        }

        const minBirthYear = 1900
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/

        if (voucherAdd.ma.trim() === '') {
            errors.ma = 'Mã không được để trống'
        } else if (voucherAdd.ma !== voucherAdd.ma.trim()) {
            errors.ma = 'Mã không được chứa khoảng trắng thừa'
        } else if (voucherAdd.ma.length > 30) {
            errors.ma = 'Mã không được dài hơn 30 ký tự'
        } else if (voucherAdd.ma.length < 5) {
            errors.ma = 'Mã không được bé hơn 5 ký tự'
        } else if (listMa.includes(voucherAdd.ma.toLowerCase())) {
            errors.ma = 'Mã đã tồn tại'
        } else if (specialCharsRegex.test(voucherAdd.ma)) {
            errors.ma = 'Mã không được chứa ký tự đặc biệt'
        }

        if (voucherAdd.ten.trim() === '') {
            errors.ten = 'Tên không được để trống'
        } else if (voucherAdd.ten !== voucherAdd.ten.trim()) {
            errors.ten = 'Tên không được chứa khoảng trắng thừa'
        } else if (voucherAdd.ten.length > 100) {
            errors.ten = 'Tên không được dài hơn 100 ký tự'
        } else if (voucherAdd.ten.length < 5) {
            errors.ten = 'Tên không được bé hơn 5 ký tự'
        } else if (listTen.includes(voucherAdd.ten.toLowerCase())) {
            errors.ten = 'Tên đã tồn tại'
        } else if (specialCharsRegex.test(voucherAdd.ten)) {
            errors.ten = 'Tên không được chứa ký tự đặc biệt'
        }

        if (voucherAdd.kieuGiaTri === 0) {
            if (voucherAdd.giaTri === null) {
                setVoucherAdd({ ...voucherAdd, giaTri: 0 })
                errors.giaTri = 'Giá trị tối thiểu 1%'
            } else if (!Number.isInteger(parseInt(voucherAdd.giaTri))) {
                errors.giaTri = 'Giá trị chỉ được nhập số nguyên'
            } else if (voucherAdd.giaTri < 1) {
                errors.giaTri = 'Giá trị tối thiểu 1%'
            } else if (voucherAdd.giaTri > 100) {
                errors.giaTri = 'Giá trị tối đa 100%'
            }
        } else {
            if (voucherAdd.giaTri === null) {
                setVoucherAdd({ ...voucherAdd, giaTri: 0 })
                errors.giaTri = 'Giá trị tối thiểu 1 ₫'
            } else if (!Number.isInteger(parseInt(voucherAdd.giaTri))) {
                errors.giaTri = 'Giá trị chỉ được nhập số nguyên'
            } else if (voucherAdd.giaTri < 1) {
                errors.giaTri = 'Giá trị tối thiểu 1 ₫'
            } else if (voucherAdd.giaTri > 50000000) {
                errors.giaTri = 'Giá trị tối đa 50,000,000 ₫'
            }
        }

        if (voucherAdd.giaTriMax === null) {
            setVoucherAdd({ ...voucherAdd, giaTriMax: 0 })
            errors.giaTriMax = 'Giá trị tối đa tối thiểu 1 ₫'
        } else if (!Number.isInteger(parseInt(voucherAdd.giaTriMax))) {
            errors.giaTriMax = 'Giá trị tối đa chỉ được nhập số nguyên'
        } else if (voucherAdd.giaTriMax < 1) {
            errors.giaTriMax = 'Giá trị tối đa tối thiểu 1 ₫'
        } else if (voucherAdd.giaTriMax > 50000000) {
            errors.giaTriMax = 'Giá trị tối đa tối đa 50,000,000 ₫'
        } else if (voucherAdd.kieuGiaTri === 1 && voucherAdd.giaTriMax !== voucherAdd.giaTri) {
            errors.giaTriMax = 'Giá trị tối đa phải bằng giá trị'
        }

        if (voucherAdd.soLuong === null) {
            setVoucherAdd({ ...voucherAdd, soLuong: 0 })
            errors.soLuong = 'Số lượng tối thiểu 1'
        } else if (!Number.isInteger(parseInt(voucherAdd.soLuong))) {
            errors.soLuong = 'Số lượng chỉ được nhập số nguyên'
        } else if (voucherAdd.soLuong < 1) {
            errors.soLuong = 'Số lượng tối thiểu 1'
        }

        if (voucherAdd.dieuKienNhoNhat === null) {
            setVoucherAdd({ ...voucherAdd, dieuKienNhoNhat: 0 })
            errors.dieuKienNhoNhat = 'Điều kiện tối thiểu 1 ₫'
        } else if (!Number.isInteger(parseInt(voucherAdd.dieuKienNhoNhat))) {
            errors.dieuKienNhoNhat = 'Điều kiện chỉ được nhập số nguyên'
        } else if (voucherAdd.dieuKienNhoNhat < 1) {
            errors.dieuKienNhoNhat = 'Điều kiện tối thiểu 1 ₫'
        } else if (voucherAdd.dieuKienNhoNhat > 50000000) {
            errors.dieuKienNhoNhat = 'Điều kiện tối thiểu tối đa 50,000,000 ₫'
        }

        const minDate = new Date(minBirthYear, 0, 1); // Ngày bắt đầu từ 01-01-minBirthYear

        // Kiểm tra ngày bắt đầu
        if (!voucherAdd.ngayBatDau) {
            errors.ngayBatDau = 'Ngày bắt đầu không được để trống';
        } else {
            const ngayBatDau = new Date(voucherAdd.ngayBatDau);
            if (ngayBatDau < minDate) {
                errors.ngayBatDau = 'Ngày bắt đầu không hợp lệ';
            }
        }

        // Kiểm tra ngày kết thúc
        if (!voucherAdd.ngayKetThuc) {
            errors.ngayKetThuc = 'Ngày kết thúc không được để trống';
        } else {
            const ngayBatDau = new Date(voucherAdd.ngayBatDau);
            const ngayKetThuc = new Date(voucherAdd.ngayKetThuc);

            if (ngayKetThuc < minDate) {
                errors.ngayKetThuc = 'Ngày kết thúc không hợp lệ';
            }

            if (ngayBatDau > ngayKetThuc) {
                errors.ngayBatDau = 'Ngày bắt đầu không được lớn hơn ngày kết thúc';
            }
        }

        for (const key in errors) {
            if (errors[key]) {
                check++
            }
        }

        setErrorMa(errors.ma)
        setErrorTen(errors.ten)
        setErrorGiaTri(errors.giaTri)
        setErrorGiaTriMax(errors.giaTriMax)
        setErrorDieuKienNhoNhat(errors.dieuKienNhoNhat)
        setErrorSoLuong(errors.soLuong)
        setErrorNgayBatDau(errors.ngayBatDau)
        setErrorNgayKetThuc(errors.ngayKetThuc)
        setConfirmClicked(true)
        return check
    }

    const handleVoucherAdd = () => {
        const check = handleValidation()

        if (check < 1) {
            const title = 'Xác nhận thêm mới phiếu giảm giá?';

            swal({
                title: title,
                text: 'Bạn có chắc chắn muốn thêm phiếu giảm giá không?',
                type: 'question',
                buttons: {
                    cancel: "Hủy",
                    confirm: "Xác nhận",
                },
            }).then((willConfirm) => {
                if (willConfirm) {
                    setLoading(true)
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
                        })
                        .finally(() => {
                            setLoading(false)
                        })
                }
            });
        } else {
            swal("Thất bại!", "Không thể thêm phiếu giảm giá", "error");
        }
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


    const formatCurrency = (money) => {
        return numeral(money).format('0,0') + ' ₫'
    }

    const handleSetValue = (value) => {
        if (voucherAdd.kieuGiaTri === 0) {
            setVoucherAdd({
                ...voucherAdd,
                giaTri: formatCurrency(value).replace(/\D/g, ''),
            })
            setGiaTriDefault(formatCurrency(value).replace(/\D/g, ''))
        } else {
            setVoucherAdd({
                ...voucherAdd,
                giaTri: formatCurrency(value).replace(/\D/g, ''),
                giaTriMax: formatCurrency(value).replace(/\D/g, ''),
            })
            setGiaTriDefault(formatCurrency(value))
            setGiaTriMaxDefault(formatCurrency(value))
        }
        setErrorGiaTri('')
    }

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
                                    onChange={(e) => {
                                        setVoucherAdd({ ...voucherAdd, ma: e.target.value })
                                        setErrorMa('')
                                    }}
                                    error={errorMa ? 'true' : undefined}
                                />
                                <span className='text-red-600 text-xs italic'>{errorMa}</span>
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Tên phiếu giảm giá</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Nhập tên"
                                    onChange={(e) => {
                                        setVoucherAdd({ ...voucherAdd, ten: e.target.value })
                                        setErrorTen('')
                                    }}
                                    error={errorTen ? 'true' : undefined}
                                />
                                <span className='text-red-600 text-xs italic'>{errorTen}</span>
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Giá trị</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập giá trị"
                                        value={giaTriDefault}
                                        onChange={(e) => handleSetValue(e.target.value)}
                                        error={errorGiaTri ? 'true' : undefined}
                                    />
                                    <div className="flex items-center px-2 bg-gray-200 rounded-r-md">
                                        <AiOutlinePercentage
                                            color={voucherAdd.kieuGiaTri === 0 ? '#fc7c27' : ''}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setVoucherAdd({ ...voucherAdd, kieuGiaTri: 0, giaTri: 0 });
                                                setGiaTriDefault(0)
                                                setGiaTriMaxDefault(0)
                                            }}
                                        />
                                        <AiOutlineDollar
                                            color={voucherAdd.kieuGiaTri === 1 ? '#fc7c27' : ''}
                                            className="cursor-pointer ml-2"
                                            onClick={() => {
                                                setVoucherAdd({ ...voucherAdd, kieuGiaTri: 1, giaTri: 0, giaTriMax: 0 });
                                                setErrorGiaTri('')
                                                setGiaTriDefault(formatCurrency(0))
                                                setGiaTriMaxDefault(formatCurrency(0))
                                            }}
                                        />
                                    </div>
                                </div>
                                <span className='text-red-600 text-xs italic'>{errorGiaTri}</span>
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Giá trị tối đa</label>
                                <div className="flex">
                                    <input
                                        disabled={voucherAdd.kieuGiaTri === 1}
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập giá trị tối đa"
                                        value={formatCurrency(giaTriMaxDefault)}
                                        onChange={(e) => {
                                            // Chỉ cập nhật giaTriMax khi không bị vô hiệu hóa
                                            if (voucherAdd.kieuGiaTri !== 1) {
                                                setVoucherAdd({
                                                    ...voucherAdd,
                                                    giaTriMax: formatCurrency(e.target.value).replace(/\D/g, ''),
                                                });
                                                setGiaTriMaxDefault(formatCurrency(e.target.value)); // Cập nhật giaTriMaxDefault
                                                setErrorGiaTriMax('');
                                            }
                                        }}

                                        error={errorGiaTriMax ? 'true' : undefined}
                                    />
                                    <span className="flex items-center px-4 bg-gray-200 rounded-r-md">đ</span>
                                </div>
                                <span className='text-red-600 text-xs italic'>{errorGiaTriMax}</span>
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Số lượng</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Nhập số lượng"
                                    value={soLuongDefault}
                                    onChange={(e) => {
                                        setVoucherAdd({
                                            ...voucherAdd,
                                            soLuong: formatCurrency(e.target.value).replace(/\D/g, '')
                                        })
                                        setErrorSoLuong('')
                                        setSoLuongDefault(formatCurrency(e.target.value).replace(/\D/g, ''))
                                    }}
                                    error={errorSoLuong ? 'true' : undefined}
                                />
                                <span className='text-red-600 text-xs italic'>{errorSoLuong}</span>
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Điều kiện</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập điều kiện"
                                        value={formatCurrency(dieuKienNhoNhatDefault)}
                                        onChange={(e) => {
                                            setVoucherAdd({
                                                ...voucherAdd,
                                                dieuKienNhoNhat: formatCurrency(e.target.value).replace(/\D/g, ''),
                                            })
                                            setErrorDieuKienNhoNhat('')
                                            setDieuKienNhoNhatDefault(formatCurrency(e.target.value))
                                        }}
                                        error={errorDieuKienNhoNhat ? 'true' : undefined}
                                    />
                                    <span className="flex items-center px-4 bg-gray-200 rounded-r-md">đ</span>
                                </div>
                                <span className='text-red-600 text-xs italic'>{errorDieuKienNhoNhat}</span>
                            </div>

                            <div>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        format={'DD-MM-YYYY HH:mm:ss'}
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
                                        onChange={(e) => {
                                            setVoucherAdd({
                                                ...voucherAdd,
                                                ngayBatDau: dayjs(e).format('YYYY-MM-DDTHH:mm:ss')
                                            })
                                            setErrorNgayBatDau('')
                                        }}
                                    />
                                </LocalizationProvider>
                                <span className='text-red-600 text-xs italic'>{errorNgayBatDau}</span>
                            </div>

                            <div>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        format={'DD-MM-YYYY HH:mm:ss'}
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
                                        onChange={(e) => {
                                            setVoucherAdd({
                                                ...voucherAdd,
                                                ngayKetThuc: dayjs(e).format('YYYY-MM-DDTHH:mm:ss')
                                            })
                                            setErrorNgayKetThuc('')
                                        }}
                                    />
                                </LocalizationProvider>
                                <span className='text-red-600 text-xs italic'>{errorNgayKetThuc}</span>
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
                                    } else {
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
                    {confirmClicked && loading && (
                        <div
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 9999,
                            }}>
                            <CircularProgress size={50} />
                        </div>
                    )}
                    {/*Button*/}
                    <button
                        onClick={() => handleVoucherAdd()}
                        disabled={loading}
                        className="border border-amber-400 hover:bg-gray-100 text-amber-400 py-2 px-4 rounded-md ml-auto flex items-center">
                        {loading ? 'Đang thêm...' : 'Tạo Voucher'}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default CreateVoucher;