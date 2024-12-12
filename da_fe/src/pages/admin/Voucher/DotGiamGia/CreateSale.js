import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const CreateSale = () => {
    const navigate = useNavigate();
    const [selectAllProduct, setSelectAllProduct] = useState(false)
    const [selectAllProductDetail, setSelectAllProductDetail] = useState(false)
    const [getProduct, setGetProduct] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedRowsProduct, setSelectedRowsProduct] = useState([])
    const [selectedProductIds, setSelectedProductIds] = useState([])
    const [getProductDetailByProduct, setGetProductDetailByProduct] = useState([])
    const [pageCount, setPageCount] = useState(0);
    const [errorTen, setErrorTen] = useState('')
    const [errorGiaTri, setErrorGiaTri] = useState('')
    const [errorTgBatDau, setErrorTgBatDau] = useState('')
    const [errorTgKetThuc, setErrorTgKetThuc] = useState('')
    const [getTenKhuyenMai, setGetTenKhuyenMai] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const size = 5;

    const [listThuongHieu, setListThuongHieu] = useState([]);
    const [listChatLieu, setListChatLieu] = useState([]);
    const [listMauSac, setListMauSac] = useState([]);
    const [listTrongLuong, setListTrongLuong] = useState([]);
    const [listDiemCanBang, setListDiemCanBang] = useState([]);
    const [listDoCung, setListDoCung] = useState([]);

    const [searchSanPham, setSearchSanPham] = useState({
        tenSearch: "",
    })

    const [addKhuyenMai, setAddKhuyenMai] = useState({
        ten: '',
        giaTri: '',
        loai: true,
        tgBatDau: null,
        tgKetThuc: null,
        trangThai: 0,
        idProductDetail: selectedRows
    })

    const [fillterSanPhamChiTiet, setFillterSanPhamChiTiet] = useState({
        tenSearch: "",
        idThuongHieuSearch: "",
        idChatLieuSearch: "",
        idMauSacSearch: "",
        idTrongLuongSearch: "",
        idDiemCanBangSearch: "",
        idDoCungSearch: "",
        currentPage: 0,
        size: 5
    })

    const handleAllTenKhuyenMai = () => {
        axios.get(`http://localhost:8080/api/khuyen-mai/list-ten-khuyen-mai`)
            .then((response) => {
                setGetTenKhuyenMai(response.data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }

    useEffect(() => {
        handleAllTenKhuyenMai()
    })

    const khuyenMaiTen = getTenKhuyenMai.map((khuyenMai) => khuyenMai.ten)

    const validateSearchInput = (value) => {
        const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
        return !specialCharsRegex.test(value);
    }

    const useDebounce = (value, delay) => {
        const [debouncedValue, setDebouncedValue] = useState(value)

        useEffect(() => {
            const timerId = setTimeout(() => {
                setDebouncedValue(value)
            }, delay)

            return () => {
                clearTimeout(timerId)
            }
        }, [value, delay])

        return debouncedValue
    }

    // Tìm kiếm sản phẩm chi tiết
    const [inputValueSanPham, setInputValueSanPham] = useState('');
    const debouncedValueSanPham = useDebounce(inputValueSanPham, 300);

    useEffect(() => {
        if (debouncedValueSanPham) {
            const updatedSearch = {
                ...searchSanPham,
                tenSearch: debouncedValueSanPham
            };

            loadSanPhamSearch(updatedSearch, 0);
        } else {
            loadSanPhamSearch(searchSanPham, 0);
        }
    }, [debouncedValueSanPham]);

    const loadSanPhamSearch = (searchSanPham, currentPage) => {
        const params = new URLSearchParams({
            tenSearch: searchSanPham.tenSearch,
            currentPage: currentPage,
            size: size
        });

        axios.get(`http://localhost:8080/api/khuyen-mai/searchSanPham?${params.toString()}`)
            .then((response) => {
                setGetProduct(response.data.content);
                setPageCount(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleNavigateToSale = () => {
        navigate('/admin/giam-gia/dot-giam-gia');
    };

    const handleInputChange = (event) => {
        setAddKhuyenMai({ ...addKhuyenMai, [event.target.name]: event.target.value })
    }

    const getProductDetailById = (fillterSanPhamChiTiet, selectedProductIds) => {
        const params = new URLSearchParams({
            id: selectedProductIds,
            tenSearch: fillterSanPhamChiTiet.tenSearch || '',
            idThuongHieuSearch: fillterSanPhamChiTiet.idThuongHieuSearch || '',
            idChatLieuSearch: fillterSanPhamChiTiet.idChatLieuSearch || '',
            idMauSacSearch: fillterSanPhamChiTiet.idMauSacSearch || '',
            idDiemCanBangSearch: fillterSanPhamChiTiet.idDiemCanBangSearch || '',
            idTrongLuongSearch: fillterSanPhamChiTiet.idTrongLuongSearch || '',
            idDoCungSearch: fillterSanPhamChiTiet.idDoCungSearch || '',
            currentPage: fillterSanPhamChiTiet.currentPage || 0,
            size: size
        });

        if (selectedProductIds.length > 0) {
            axios.get(`http://localhost:8080/api/khuyen-mai/getSanPhamCTBySanPham?${params.toString()}`)
                .then((response) => {
                    console.log('Response:', response.data);
                    setGetProductDetailByProduct(response.data.content);
                    setPageCount(response.data.totalPages);
                    setCurrentPage(response.data.currentPage);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    useEffect(() => {
        getProductDetailById(fillterSanPhamChiTiet, selectedProductIds);
    }, [fillterSanPhamChiTiet, selectedProductIds]);

    const handleSelectAllChangeProduct = (event) => {
        const selectedIds = event.target.checked ? getProduct.map((row) => row.id) : []
        setSelectedRowsProduct(selectedIds)
        setSelectedRows(selectedIds)
        setSelectAllProduct(event.target.checked)
        getProductDetailById(fillterSanPhamChiTiet, selectedIds);
    }

    const handleSelectAllChangeProductDetail = (event) => {
        const selectedIds = event.target.checked ? getProductDetailByProduct.map((row) => row.id) : []
        setSelectedRows(selectedIds)
        setSelectAllProductDetail(event.target.checked)
    }

    const handleCheckboxChange1 = (event, productId) => {
        const selectedIndex = selectedRowsProduct.indexOf(productId)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = [...selectedRowsProduct, productId]
        } else {
            newSelected = [
                ...selectedRowsProduct.slice(0, selectedIndex),
                ...selectedRowsProduct.slice(selectedIndex + 1),
            ]
        }

        setSelectedRowsProduct(newSelected)
        setSelectAllProduct(newSelected.length === getProduct.length)

        const selectedProductIds = getProduct
            .filter((row) => newSelected.includes(row.id))
            .map((selectedProduct) => selectedProduct.id)
        setSelectedProductIds(selectedProductIds)
    }

    const handleCheckboxChange2 = (event, productDetailId) => {
        const selectedIndex = selectedRows.indexOf(productDetailId)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = [...selectedRows, productDetailId]
        } else {
            newSelected = [
                ...selectedRows.slice(0, selectedIndex),
                ...selectedRows.slice(selectedIndex + 1),
            ]
        }

        setSelectedRows(newSelected)
        setSelectAllProductDetail(newSelected.length === getProductDetailByProduct.length)
    }

    const validate = () => {
        let check = 0
        const errors = {
            ten: '',
            giaTri: '',
            tgBatDau: null,
            tgKetThuc: null,
        }

        const minBirthYear = 1900

        if (addKhuyenMai.ten.trim() === '') {
            errors.ten = 'Vui lòng nhập tên đợt giảm giá'
        } else if (!isNaN(addKhuyenMai.ten)) {
            errors.ten = 'Tên đợt giảm giá phải là chữ'
        } else if (khuyenMaiTen.includes(addKhuyenMai.ten)) {
            errors.ten = 'Không được trùng tên đợt giảm giá'
        } else if (addKhuyenMai.ten.length > 50) {
            errors.ten = 'Tên không được dài hơn 50 ký tự'
        } else if (addKhuyenMai.ten.length < 5) {
            errors.ten = 'Tên không được bé hơn 5 ký tự'
        }

        if (addKhuyenMai.giaTri === '') {
            errors.giaTri = 'Vui lòng nhập giá trị'
        } else if (!Number.isInteger(Number(addKhuyenMai.giaTri))) {
            errors.giaTri = 'Giá trị phải là số nguyên'
        } else if (Number(addKhuyenMai.giaTri) <= 0 || Number(addKhuyenMai.giaTri) > 100) {
            errors.giaTri = 'Giá trị phải lớn hơn 0% và nhở hơn 100%'
        }

        const minDate = new Date(minBirthYear, 0, 1); // Ngày bắt đầu từ 01-01-minBirthYear

        if (addKhuyenMai.tgBatDau === null) {
            errors.tgBatDau = 'Vui lòng nhập thời gian bắt đầu'
        } else {
            const tgBatDau = new Date(addKhuyenMai.tgBatDau);
            if (tgBatDau < minDate) {
                errors.tgBatDau = 'Thời gian bắt đầu không hợp lệ'
            }
        }


        if (addKhuyenMai.tgKetThuc === null) {
            errors.tgKetThuc = 'Vui lòng nhập thời gian kết thúc'
        } else {
            const tgBatDau = new Date(addKhuyenMai.tgBatDau)
            const tgKetThuc = new Date(addKhuyenMai.tgKetThuc)

            if (tgKetThuc < minDate) {
                errors.tgKetThuc = 'Thời gian kết thúc không hợp lệ'
            }

            if (tgBatDau > tgKetThuc) {
                errors.tgBatDau = 'Thời gian bắt đầu không được lớn hơn ngày kết thúc'
            }
        }

        for (const key in errors) {
            if (errors[key]) {
                check++
            }
        }

        setErrorTen(errors.ten)
        setErrorGiaTri(errors.giaTri)
        setErrorTgBatDau(errors.tgBatDau)
        setErrorTgKetThuc(errors.tgKetThuc)

        return check
    }

    const onSubmit = () => {
        const check = validate()

        if (check < 1) {
            const title = 'Xác nhận thêm mới đợt giảm giá?';

            // Kiểm tra nếu không có sản phẩm được chọn thì set loại là false
            const finalKhuyenMai = {
                ...addKhuyenMai,
                loai: selectedRows.length === 0 ? false : true,
                idProductDetail: selectedRows
            };

            swal({
                title: title,
                text: 'Bạn có chắc chắn muốn thêm mới đợt giảm giá không?',
                icon: "warning",
                buttons: {
                    cancel: "Hủy",
                    confirm: "Xác nhận",
                },
            }).then((willConfirm) => {
                if (willConfirm) {
                    axios.post('http://localhost:8080/api/khuyen-mai/add', finalKhuyenMai, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(() => {
                            swal("Thành công!", "Thêm mới đợt giảm giá thành công!", "success");
                            navigate('/admin/giam-gia/dot-giam-gia');
                        })
                        .catch((error) => {
                            console.error("Lỗi cập nhật:", error);
                            swal("Thất bại!", "Thêm mới đợt giảm giá thất bại!", "error");
                        });
                }
            });
        } else {
            swal("Thất bại!", "Không thể thêm đợt giảm giá", "error");
        }

    };

    const loadThuongHieu = () => {
        axios.get(`http://localhost:8080/api/thuong-hieu`)
            .then((response) => {
                setListThuongHieu(response.data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const loadChatLieu = () => {
        axios.get(`http://localhost:8080/api/chat-lieu`)
            .then((response) => {
                setListChatLieu(response.data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const loadMauSac = () => {
        axios.get(`http://localhost:8080/api/mau-sac`)
            .then((response) => {
                setListMauSac(response.data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const loadTrongLuong = () => {
        axios.get(`http://localhost:8080/api/trong-luong`)
            .then((response) => {
                setListTrongLuong(response.data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const loadDiemCanBang = () => {
        axios.get(`http://localhost:8080/api/diem-can-bang`)
            .then((response) => {
                setListDiemCanBang(response.data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const loadDoCung = () => {
        axios.get(`http://localhost:8080/api/do-cung`)
            .then((response) => {
                setListDoCung(response.data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        loadThuongHieu();
        loadChatLieu();
        loadMauSac();
        loadDiemCanBang();
        loadDoCung();
        loadTrongLuong();
    }, [])

    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        loadSanPhamSearch(searchSanPham, selectedPage);
    };

    const handlePageSPCTClick = (event) => {
        const selectedPage = event.selected;



        setFillterSanPhamChiTiet((prev) => ({
            ...prev,
            currentPage: selectedPage
        }));

        getProductDetailById(fillterSanPhamChiTiet, selectedPage);
    };

    return (
        <div>
            <div className="font-bold text-sm">
                <span
                    className="cursor-pointer"
                    onClick={handleNavigateToSale}
                >
                    Đợt giảm giá
                </span>
                <span className="text-gray-400 ml-2">/ Tạo đợt giảm giá</span>
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg">
                <div className="flex justify-end mb-4">
                    <input
                        type="text"
                        placeholder="Tìm tên sản phẩm"
                        className="p-2 border rounded w-1/2"
                        onChange={(e) => {
                            const valueNhap = e.target.value;
                            if (validateSearchInput(valueNhap)) {
                                setInputValueSanPham(valueNhap);
                            } else {
                                setInputValueSanPham('');
                                swal('Lỗi!', 'Không được nhập ký tự đặc biệt', 'warning');
                            }
                        }}
                    />
                </div>
                <div className="flex">
                    {/*/!* Form Section *!/*/}
                    <div className="w-1/2 pr-4">
                        <div>
                            <label className="block text-gray-600 mb-1">
                                Tên đợt giảm giá
                            </label>
                            <input
                                type="text"
                                name="ten"
                                id="discount-name"
                                placeholder="Tên đợt giảm giá"
                                className="w-full p-2 border rounded mb-4"
                                onChange={(e) => {
                                    handleInputChange(e)
                                    setErrorTen('')
                                }}
                                error={errorTen ? 'true' : undefined}
                            />
                            <span className='text-red-600'>{errorTen}</span>
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">
                                Giá trị
                            </label>
                            <input
                                type="number"
                                name="giaTri"
                                id="discount-value"
                                placeholder="Giá trị"
                                className="w-full p-2 border rounded mb-4"
                                onChange={(e) => {
                                    handleInputChange(e)
                                    setErrorGiaTri('')
                                }}
                                error={errorGiaTri ? 'true' : undefined}
                            />
                            <span className='text-red-600'>{errorGiaTri}</span>
                        </div>

                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <label className="block text-gray-600 mb-1">Từ ngày</label>
                                <DateTimePicker
                                    format={'DD-MM-YYYY HH:mm:ss'}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            className: 'w-[608px]'
                                        },
                                        actionBar: {
                                            actions: ['clear', 'today']
                                        }
                                    }}
                                    onChange={(e) => {
                                        setAddKhuyenMai({
                                            ...addKhuyenMai,
                                            tgBatDau: dayjs(e).format('YYYY-MM-DDTHH:mm:ss')
                                        })
                                        setErrorTgBatDau('')
                                    }}
                                />
                            </LocalizationProvider>
                            <span className='text-red-600'>{errorTgBatDau}</span>
                        </div>

                        <div className='mt-4'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <label className="block text-gray-600 mb-1">Đến ngày</label>
                                <DateTimePicker
                                    format={'DD-MM-YYYY HH:mm:ss'}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            className: 'w-[608px]'
                                        },
                                        actionBar: {
                                            actions: ['clear', 'today']
                                        }
                                    }}
                                    onChange={(e) => {
                                        setAddKhuyenMai({
                                            ...addKhuyenMai,
                                            tgKetThuc: dayjs(e).format('YYYY-MM-DDTHH:mm:ss')
                                        })
                                        setErrorTgKetThuc('')
                                    }}
                                />
                            </LocalizationProvider>
                            <span className='text-red-600'>{errorTgKetThuc}</span>
                        </div>

                        {selectedRowsProduct.length > 0 ? (
                            '') : (
                            <button
                                onClick={() => onSubmit(addKhuyenMai, selectedRows)}
                                className="border border-amber-400 hover:bg-gray-100 text-amber-400 py-2 px-4 mt-4 rounded-md flex items-center">
                                Thêm mới
                            </button>
                        )}
                    </div>

                    {/* Product Table Section */}
                    <div className="w-1/2 pr-4">
                        <table className="min-w-full border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="py-2 px-4 border-b text-center">
                                        <input type="checkbox"
                                            checked={selectAllProduct}
                                            onChange={handleSelectAllChangeProduct}
                                        />
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">STT</th>
                                    <th className="py-2 px-4 border-b text-center">Tên sản phẩm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getProduct.map((sanPham, index) => (
                                    <tr key={sanPham.id} className="text-left border-b">
                                        <td className="py-2 px-4 border-b text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedRowsProduct.indexOf(sanPham.id) !== -1}

                                                onChange={(event) => handleCheckboxChange1(event, sanPham.id)}
                                                className="align-middle"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b text-center">{(currentPage * 5) + index + 1}</td>
                                        <td className="py-2 px-4 border-b text-center">{sanPham.ten}</td>
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
            </div>
            {selectedRowsProduct.length > 0 && (
                <div className="bg-white p-4 mt-4 rounded-md shadow-lg mb-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl">CHI TIẾT SẢN PHẨM</h1>
                        <button
                            onClick={() => onSubmit(addKhuyenMai, selectedRows)}
                            className="border border-amber-400 hover:bg-gray-100 text-amber-400 py-2 px-4 mt-4 rounded-md flex items-center">
                            Thêm mới
                        </button>
                    </div>

                    <div className="flex mb-4">
                        <input

                            type="text"
                            placeholder="Tìm tên sản phẩm"
                            className="p-2 border rounded w-1/2"
                            value={fillterSanPhamChiTiet.tenSearch}
                            onChange={(e) => {
                                const newTenSearch = e.target.value;
                                const updatedFilter = {
                                    ...fillterSanPhamChiTiet,
                                    tenSearch: newTenSearch,
                                    currentPage: 0 // Reset trang khi tìm kiếm
                                };
                                setFillterSanPhamChiTiet(updatedFilter);
                                getProductDetailById(updatedFilter, selectedProductIds);
                            }}
                        />

                    </div>

                    <div className="flex overflow-x-auto gap-2 pb-4 items-center">
                        <div className="flex items-center space-x-1 shrink-0">
                            <label className="text-sm text-gray-700 whitespace-nowrap">Thương hiệu:</label>
                            <select
                                className="w-32 text-sm border rounded px-2 py-1"
                                value={fillterSanPhamChiTiet.idThuongHieuSearch || ''}
                                onChange={(e) => {
                                    const newIdThuongHieuSearch = e.target.value;
                                    const updatedFilter = {
                                        ...fillterSanPhamChiTiet,
                                        idThuongHieuSearch: newIdThuongHieuSearch,
                                        currentPage: 0 // Reset trang khi tìm kiếm
                                    };
                                    setFillterSanPhamChiTiet(updatedFilter);
                                    getProductDetailById(updatedFilter, selectedProductIds);
                                }}
                            >
                                <option value="">Thương hiệu</option>
                                {listThuongHieu.map((th) => (
                                    <option key={th.id} value={th.id}>
                                        {th.ten}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                            <label className="text-sm text-gray-700 whitespace-nowrap">Màu sắc:</label>
                            <select
                                className="w-32 text-sm border rounded px-2 py-1"
                                value={fillterSanPhamChiTiet.idMauSacSearch}
                                onChange={(e) => {
                                    const newIdMauSacSearch = e.target.value;
                                    const updatedFilter = {
                                        ...fillterSanPhamChiTiet,
                                        idMauSacSearch: newIdMauSacSearch,
                                        currentPage: 0 // Reset trang khi tìm kiếm
                                    };
                                    setFillterSanPhamChiTiet(updatedFilter);
                                    getProductDetailById(updatedFilter, selectedProductIds);
                                }}
                            >
                                <option value="">Màu sắc</option>
                                {listMauSac.map((ms) => (
                                    <option key={ms.id} value={ms.id}>
                                        {ms.ten}
                                    </option>
                                ))}


                            </select>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                            <label className="text-sm text-gray-700 whitespace-nowrap">Chất liệu:</label>
                            <select
                                className="w-32 text-sm border rounded px-2 py-1"
                                value={fillterSanPhamChiTiet.idChatLieuSearch}
                                onChange={(e) => {
                                    const newIdChatLieuSearch = e.target.value;
                                    const updatedFilter = {
                                        ...fillterSanPhamChiTiet,
                                        idChatLieuSearch: newIdChatLieuSearch,
                                        currentPage: 0 // Reset trang khi tìm kiếm
                                    };
                                    setFillterSanPhamChiTiet(updatedFilter);
                                    getProductDetailById(updatedFilter, selectedProductIds);
                                }}
                            >
                                <option value="">Chất liệu</option>
                                {listChatLieu.map((cl) => (
                                    <option key={cl.id} value={cl.id}>
                                        {cl.ten}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                            <label className="text-sm text-gray-700 whitespace-nowrap">Trọng lượng:</label>
                            <select
                                className="w-32 text-sm border rounded px-2 py-1"
                                value={fillterSanPhamChiTiet.idTrongLuongSearch}
                                onChange={(e) => {
                                    const newIdTrongLuongSearch = e.target.value;
                                    const updatedFilter = {
                                        ...fillterSanPhamChiTiet,
                                        idTrongLuongSearch: newIdTrongLuongSearch,
                                        currentPage: 0 // Reset trang khi tìm kiếm
                                    };
                                    setFillterSanPhamChiTiet(updatedFilter);
                                    getProductDetailById(updatedFilter, selectedProductIds);
                                }}
                            >
                                <option value="">Trọng lượng</option>
                                {listTrongLuong.map((tl) => (
                                    <option key={tl.id} value={tl.id}>
                                        {tl.ten}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                            <label className="text-sm text-gray-700 whitespace-nowrap">Điểm cân bằng:</label>
                            <select
                                className="w-32 text-sm border rounded px-2 py-1"
                                value={fillterSanPhamChiTiet.idDiemCanBangSearch}
                                onChange={(e) => {
                                    const newIdDiemCanBangSearch = e.target.value;
                                    const updatedFilter = {
                                        ...fillterSanPhamChiTiet,
                                        idDiemCanBangSearch: newIdDiemCanBangSearch,
                                        currentPage: 0 // Reset trang khi tìm kiếm
                                    };
                                    setFillterSanPhamChiTiet(updatedFilter);
                                    getProductDetailById(updatedFilter, selectedProductIds);
                                }}
                            >
                                <option value="">Điểm cân bằng</option>
                                {listDiemCanBang.map((dcb) => (
                                    <option key={dcb.id} value={dcb.id}>
                                        {dcb.ten}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                            <label className="text-sm text-gray-700 whitespace-nowrap">Độ cứng:</label>
                            <select
                                className="w-32 text-sm border rounded px-2 py-1"
                                value={fillterSanPhamChiTiet.idDoCungSearch}
                                onChange={(e) => {
                                    const newIdDoCungSearch = e.target.value;
                                    const updatedFilter = {
                                        ...fillterSanPhamChiTiet,
                                        idDoCungSearch: newIdDoCungSearch,
                                        currentPage: 0 // Reset trang khi tìm kiếm
                                    };
                                    setFillterSanPhamChiTiet(updatedFilter);
                                    getProductDetailById(updatedFilter, selectedProductIds);
                                }}
                            >
                                <option value="">Độ cứng</option>
                                {listDoCung.map((dc) => (
                                    <option key={dc.id} value={dc.id}>
                                        {dc.ten}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="py-2 px-4 border-b text-center">
                                    <input type="checkbox"
                                        checked={selectAllProductDetail}
                                        onChange={handleSelectAllChangeProductDetail}
                                    />
                                </th>
                                <th className="py-2 px-4 border-b text-center">STT</th>
                                <th className="py-2 px-4 border-b text-center">Tên sản phẩm</th>
                                <th className="py-2 px-4 border-b text-center">Thương hiệu</th>
                                <th className="py-2 px-4 border-b text-center">Màu sắc</th>
                                <th className="py-2 px-4 border-b text-center">Chất liệu</th>
                                <th className="py-2 px-4 border-b text-center">Trọng lượng</th>
                                <th className="py-2 px-4 border-b text-center">Điểm cân bằng</th>
                                <th className="py-2 px-4 border-b text-center">Độ cứng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getProductDetailByProduct.map((spct, index) => (
                                <tr key={spct.id} className="text-center border-b">
                                    <td className="py-2 px-4 border-b text-center">
                                        <input type="checkbox"
                                            checked={selectedRows.indexOf(spct.id) !== -1}
                                            onChange={(event) => handleCheckboxChange2(event, spct.id)}
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">{(currentPage * 5) + index + 1}</td>
                                    <td className="py-2 px-4 border-b text-center">{spct.tenSanPham}</td>
                                    <td className="py-2 px-4 border-b text-center">{spct.tenThuongHieu}</td>
                                    <td className="py-2 px-4 border-b text-center">{spct.tenMauSac}</td>
                                    <td className="py-2 px-4 border-b text-center">{spct.tenChatLieu}</td>
                                    <td className="py-2 px-4 border-b text-center">{spct.tenTrongLuong}</td>
                                    <td className="py-2 px-4 border-b text-center">{spct.tenDiemCanBang}</td>
                                    <td className="py-2 px-4 border-b text-center">{spct.tenDoCung}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end mt-4">
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            onPageChange={handlePageSPCTClick}
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
            )
            }
        </div>
    );
};

export default CreateSale;