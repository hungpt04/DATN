import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
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
        ngayBatDau: null,
        ngayKetThuc: null,
        trangThai: 0,
        listIdCustomer: []
    }

    const [pageCount, setPageCount] = useState(0);
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
    const [selectAllCustomer, setSelectAllCustomer] = useState(false);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
    const [voucherDetail, setVoucherDetail] = useState(initialVoucher);
    const [isSelectVisible, setIsSelectVisible] = useState(false);
    const [allCustomer, setAllCustomer] = useState([]);
    const [allMaVoucher, setAllMaVoucher] = useState([])
    const [allTenVoucher, setAllTenVoucher] = useState([])
    const [prevMaValue, setPrevMaValue] = useState('')
    const [prevTenValue, setPrevTenValue] = useState('')
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

    useEffect(() => {
        fetchData(id);
        handleAllKhachHang();
        handleAllMaVoucher();
        handleAllTenVoucher();
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
        axios.get(`http://localhost:8080/api/voucher/detail/${id}`)
            .then((response) => {
                setVoucherDetail({
                    ...response.data,
                    listIdCustomer: selectedCustomerIds
                });
                setPrevMaValue(response.data.ma)
                setPrevTenValue(response.data.ten)

                setGiaTriDefault(response.data.giaTri)
                setGiaTriMaxDefault(response.data.giaTriMax)
                setDieuKienNhoNhatDefault(response.data.dieuKienNhoNhat)
                setSoLuongDefault(response.data.soLuong)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }


    const formatCurrency = (money) => {
        return numeral(money).format('0,0') + ' ₫'
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

        if (voucherDetail.ma.trim() === '') {
            errors.ma = 'Mã không được để trống'
        } else if (voucherDetail.ma !== voucherDetail.ma.trim()) {
            errors.ma = 'Mã không được chứa khoảng trắng thừa'
        } else if (voucherDetail.ma.length > 30) {
            errors.ma = 'Mã không được dài hơn 30 ký tự'
        } else if (voucherDetail.ma.length < 5) {
            errors.ma = 'Mã không được bé hơn 5 ký tự'
        } else if (
            prevMaValue !== voucherDetail.ma &&
            listMa.includes(voucherDetail.ma.toLocaleLowerCase)
        ) {
            errors.ma = 'Mã đã tồn tại'
        } else if (specialCharsRegex.test(voucherDetail.ma)) {
            errors.ma = 'Mã không được chứa ký tự đặc biệt'
        }

        if (voucherDetail.ten.trim() === '') {
            errors.ten = 'Tên không được để trống'
        } else if (voucherDetail.ten !== voucherDetail.ten.trim()) {
            errors.ten = 'Tên không được chứa khoảng trắng thừa'
        } else if (voucherDetail.ten.length > 100) {
            errors.ten = 'Tên không được dài hơn 100 ký tự'
        } else if (voucherDetail.ten.length < 5) {
            errors.ten = 'Tên không được bé hơn 5 ký tự'
        } else if (
            prevTenValue !== voucherDetail.ten &&
            listTen.includes(voucherDetail.ten.toLowerCase())
        ) {
            errors.ten = 'Tên đã tồn tại'
        } else if (specialCharsRegex.test(voucherDetail.ten)) {
            errors.ten = 'Tên không được chứa ký tự đặc biệt'
        }

        if (voucherDetail.kieuGiaTri === 0) {
            if (voucherDetail.giaTri === null) {
                errors.giaTri = 'Giá trị không được để trống'
            } else if (!Number.isInteger(parseInt(voucherDetail.giaTri))) {
                errors.giaTri = 'Giá trị chỉ được nhập số nguyên'
            } else if (voucherDetail.giaTri < 1) {
                errors.giaTri = 'Giá trị tối thiểu 1%'
            } else if (voucherDetail.giaTri > 100) {
                errors.giaTri = 'Giá trị tối đa 100%'
            }
        } else {
            if (voucherDetail.giaTri === null) {
                errors.giaTri = 'Giá trị không được để trống'
            } else if (!Number.isInteger(parseInt(voucherDetail.giaTri))) {
                errors.giaTri = 'Giá trị chỉ được nhập số nguyên'
            } else if (voucherDetail.giaTri < 1) {
                errors.giaTri = 'Giá trị tối thiểu 1 ₫'
            } else if (voucherDetail.giaTri > 50000000) {
                errors.giaTri = 'Giá trị tối đa 50,000,000 ₫'
            }
        }

        if (voucherDetail.giaTriMax === null) {
            errors.giaTriMax = 'Giá trị tối đa không được để trống'
        } else if (!Number.isInteger(parseInt(voucherDetail.giaTriMax))) {
            errors.giaTriMax = 'Giá trị tối đa chỉ được nhập số nguyên'
        } else if (voucherDetail.giaTriMax < 1) {
            errors.giaTriMax = 'Giá trị tối đa tối thiểu 1 ₫'
        } else if (voucherDetail.giaTriMax > 50000000) {
            errors.giaTriMax = 'Giá trị tối đa tối đa 50,000,000 ₫'
        }

        if (voucherDetail.soLuong === null) {
            errors.soLuong = 'Số lượng không được để trống'
        } else if (!Number.isInteger(parseInt(voucherDetail.soLuong))) {
            errors.soLuong = 'Số lượng chỉ được nhập số nguyên'
        } else if (voucherDetail.soLuong < 1) {
            errors.soLuong = 'Số lượng tối thiểu 1'
        }

        if (voucherDetail.dieuKienNhoNhat === null) {
            errors.dieuKienNhoNhat = 'Điều kiện không được để trống'
        } else if (!Number.isInteger(parseInt(voucherDetail.dieuKienNhoNhat))) {
            errors.dieuKienNhoNhat = 'Điều kiện chỉ được nhập số nguyên'
        } else if (voucherDetail.dieuKienNhoNhat < 0) {
            errors.dieuKienNhoNhat = 'Điều kiện tối thiểu 0 ₫'
        } else if (voucherDetail.dieuKienNhoNhat > 50000000) {
            errors.dieuKienNhoNhat = 'Điều kiện tối thiểu tối đa 50,000,000 ₫'
        }

        const minDate = new Date(minBirthYear, 0, 1); // Ngày bắt đầu từ 01-01-minBirthYear

        // Kiểm tra ngày bắt đầu
        if (!voucherDetail.ngayBatDau) {
            errors.ngayBatDau = 'Ngày bắt đầu không được để trống';
        } else {
            const ngayBatDau = new Date(voucherDetail.ngayBatDau);
            if (ngayBatDau < minDate) {
                errors.ngayBatDau = 'Ngày bắt đầu không hợp lệ';
            }
        }

        // Kiểm tra ngày kết thúc
        if (!voucherDetail.ngayKetThuc) {
            errors.ngayKetThuc = 'Ngày kết thúc không được để trống';
        } else {
            const ngayBatDau = new Date(voucherDetail.ngayBatDau);
            const ngayKetThuc = new Date(voucherDetail.ngayKetThuc);

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

    const handleVoucherUpdate = (idUpdate, voucherDetail) => {
        const check = handleValidation()

        if (check < 1) {
            const title = 'Xác nhận cập nhật phiếu giảm giá?';
            const text = 'Bạn có chắc chắn muốn cập nhật phiếu giảm giá không?';

            // Hiển thị SweetAlert để xác nhận
            swal({
                title: title,
                text: text,
                type: 'question',
                buttons: {
                    cancel: "Hủy",
                    confirm: "Xác nhận",
                },
            }).then((willConfirm) => {
                if (willConfirm) {
                    setLoading(true)
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
                        })
                        .finally(() => {
                            setLoading(false)
                        })
                }
            });
        } else {
            swal("Thất bại!", "Không thể cập nhật phiếu giảm giá!", "error");
        }

    }

    const handleSelectAllCustomer = (event) => {
        const selectedIds = event.target.checked ? allCustomer.map((customer) => customer.id) : [];
        setSelectedCustomerIds(selectedIds);
        setSelectAllCustomer(event.target.checked);
    };

    const handleCheckboxChange = (event, customerId) => {
        const selectedIndex = selectedCustomerIds.indexOf(customerId);
        let newSelectedIds = [];

        if (selectedIndex === -1) {
            newSelectedIds = [...selectedCustomerIds, customerId];
        } else {
            newSelectedIds = [
                ...selectedCustomerIds.slice(0, selectedIndex),
                ...selectedCustomerIds.slice(selectedIndex + 1),
            ]
        }

        setSelectedCustomerIds(newSelectedIds);
        setSelectAllCustomer(newSelectedIds.length === allCustomer.length);
    };

    const handleSetValue = (value) => {
        if (voucherDetail.kieuGiaTri === 0) {
            setVoucherDetail({
                ...voucherDetail,
                giaTri: formatCurrency(value).replace(/\D/g, ''),
            })
            setGiaTriDefault(formatCurrency(value).replace(/\D/g, ''))
        } else {
            setVoucherDetail({
                ...voucherDetail,
                giaTri: formatCurrency(value).replace(/\D/g, ''),
                giaTriMax: formatCurrency(value).replace(/\D/g, ''),
            })
            setGiaTriDefault(formatCurrency(value))
            setGiaTriMaxDefault(formatCurrency(value))
        }
        setErrorGiaTri('')
    }

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
                <div className="flex items-center justify-center">
                    <div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Mã phiếu giảm giá</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Nhập mã"
                                    value={voucherDetail?.ma}
                                    onChange={(e) => {
                                        setVoucherDetail({
                                            ...voucherDetail,
                                            ma: e.target.value
                                        })
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
                                    value={voucherDetail?.ten}
                                    onChange={(e) => {
                                        setVoucherDetail({
                                            ...voucherDetail,
                                            ten: e.target.value
                                        })
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
                                        value={
                                            voucherDetail.kieuGiaTri === 0 ? giaTriDefault : formatCurrency(giaTriDefault)
                                        }
                                        onChange={(e) => handleSetValue(e.target.value)}
                                        error={errorGiaTri ? 'true' : undefined}
                                    />
                                    <div className="flex items-center px-2 bg-gray-200 rounded-r-md">
                                        <AiOutlinePercentage
                                            color={voucherDetail.kieuGiaTri === 0 ? '#fc7c27' : ''}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setVoucherDetail({
                                                    ...voucherDetail,
                                                    kieuGiaTri: 0, giaTri: 0
                                                });
                                                setGiaTriDefault(0)
                                                setGiaTriMaxDefault(0)
                                            }}
                                        />
                                        <AiOutlineDollar
                                            color={voucherDetail.kieuGiaTri === 1 ? '#fc7c27' : ''}
                                            className="cursor-pointer ml-2"
                                            onClick={() => {
                                                setVoucherDetail({
                                                    ...voucherDetail,
                                                    kieuGiaTri: 1, giaTri: 0
                                                });
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
                                        disabled={voucherDetail.kieuGiaTri === 1}
                                        type="text"
                                        className="w-full border border-gray-300 rounded-l-md p-2"
                                        placeholder="Nhập giá trị tối đa"
                                        value={formatCurrency(giaTriMaxDefault)}
                                        onChange={(e) => {
                                            // Chỉ cập nhật giaTriMax khi không bị vô hiệu hóa
                                            if (voucherDetail.kieuGiaTri !== 1) {
                                                setVoucherDetail({
                                                    ...voucherDetail,
                                                    giaTriMax: formatCurrency(e.target.value).replace(/\D/g, ''),
                                                });
                                                setErrorGiaTriMax('');
                                                setGiaTriMaxDefault(formatCurrency(e.target.value)); // Cập nhật giaTriMaxDefault
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
                                        setVoucherDetail({
                                            ...voucherDetail,
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
                                            setVoucherDetail({
                                                ...voucherDetail,
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

                            <div className='mt-2'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        format={'DD-MM-YYYY HH:mm:ss'}
                                        label="Từ ngày"
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                className: 'w-[300px]'
                                            },
                                            actionBar: {
                                                actions: ['clear', 'today']
                                            }
                                        }}
                                        value={dayjs(voucherDetail?.ngayBatDau, 'YYYY-MM-DDTHH:mm:ss')}
                                        onChange={(e) => {
                                            setVoucherDetail({
                                                ...voucherDetail,
                                                ngayBatDau: dayjs(e).format('YYYY-MM-DDTHH:mm:ss')
                                            })
                                            setErrorNgayBatDau('')
                                        }}
                                    />
                                </LocalizationProvider>
                                <span className='text-red-600 text-xs italic'>{errorNgayBatDau}</span>
                            </div>

                            <div className='mt-2'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        format={'DD-MM-YYYY HH:mm:ss'}
                                        label="Đến ngày"
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                className: 'w-[300px]'
                                            },
                                            actionBar: {
                                                actions: ['clear', 'today']
                                            }
                                        }}
                                        value={dayjs(voucherDetail?.ngayKetThuc, 'YYYY-MM-DDTHH:mm:ss')}
                                        onChange={(e) => {
                                            setVoucherDetail({
                                                ...voucherDetail,
                                                ngayKetThuc: dayjs(e).format('YYYY-MM-DDTHH:mm:ss')
                                            })
                                            setErrorNgayKetThuc('')
                                        }}
                                    />
                                </LocalizationProvider>
                                <span className='text-red-600 text-xs italic'>{errorNgayKetThuc}</span>
                            </div>

                            {/* <div className="col-span-2">
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
                                                setVoucherDetail({ ...voucherDetail, kieu: parseInt(e.target.value) })
                                                setIsSelectVisible(false)
                                            }}
                                            className="mr-2"
                                        />
                                        Cá nhân
                                    </label>
                                </div>
                            </div> */}

                        </div>
                    </div>

                    {/* Right Side - Search and Table */}
                    {/* <div className="w-2/3 pl-4">
               
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
                    </div> */}
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
                        onClick={() => handleVoucherUpdate(id, voucherDetail)}
                        disabled={loading}
                        className="border border-amber-400 hover:bg-gray-100 text-amber-400 py-2 px-4 rounded-md ml-auto flex items-center">
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                </div>
            </div>
        </div>
    )
};

export default VoucherDetail;