import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';

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
            currentPage: currentPage, // Thêm tham số cho trang
            size: size // Kích thước trang cũng có thể được truyền vào nếu cần
        });

        axios.get(`http://localhost:8080/api/khuyen-mai/searchSanPham?${params.toString()}`)
            .then((response) => {
                setGetProduct(response.data.content);
                setPageCount(response.data.totalPages);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const [addKhuyenMai, setAddKhuyenMai] = useState({
        ten: '',
        giaTri: '',
        loai: true,
        tgBatDau: '',
        tgKetThuc: '',
        trangThai: 0,
        idProductDetail: selectedRows
    })

    const handleNavigateToSale = () => {
        navigate('/admin/giam-gia/dot-giam-gia');
    };

    const handleInputChange = (event) => {
        setAddKhuyenMai({ ...addKhuyenMai, [event.target.name]: event.target.value })
    }

    const getProductDetailById = (fillterSanPhamChiTiet, selectedProductIds) => {
        const params = new URLSearchParams({
            id: selectedProductIds.join(','), // Chuyển mảng thành chuỗi
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
    
        if(selectedProductIds.length > 0) {
            axios.get(`http://localhost:8080/api/khuyen-mai/getSanPhamCTBySanPham?${params.toString()}`)
            .then((response) => {
                setGetProductDetailByProduct(response.data.content);
                setPageCount(response.data.totalPages);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        } 
    };

    useEffect(() => {
        getProductDetailById(fillterSanPhamChiTiet, selectedProductIds);
    }, [fillterSanPhamChiTiet, selectedProductIds]);

    // const getProductDetailById = (selectedProductIds) => {
    //     if (selectedProductIds.length > 0) {
    //         const id = selectedProductIds.join(','); // Chuyển đổi mảng thành chuỗi
    //         axios.get(`http://localhost:8080/api/khuyen-mai/get-san-pham-chi-tiet-by-san-pham?id=${id}`)
    //             .then((response) => {
    //                 setGetProductDetailByProduct(response.data);
    //                 console.log(response.data)
    //             })
    //             .catch((error) => {
    //                 console.error("There was an error fetching the product details!", error);
    //             });
    //     }
    // }

    // useEffect(() => {
    //     getProductDetailById(selectedProductIds)
    // }, [selectedProductIds])

    const handleSelectAllChangeProduct = (event) => {
        const selectedIds = event.target.checked ? getProduct.map((row) => row.id) : []
        setSelectedRowsProduct(selectedIds)
        setSelectedRows(selectedIds)
        setSelectAllProduct(event.target.checked)
        // getProductDetailById(selectedIds)
        getProductDetailById(fillterSanPhamChiTiet, selectedIds);
        console.log(selectedIds)
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

    const onSubmit = () => {
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
        loadSanPhamSearch(searchSanPham, selectedPage); // Gọi hàm tìm kiếm với trang mới
        console.log(`User  requested page number ${selectedPage + 1}`);
    };

    const handlePageSPCTClick = (event) => {
        const selectedPage = event.selected;
        // loadSanPhamChiTietSearch(searchSanPhamChiTiet, selectedPage); // Gọi hàm tìm kiếm với trang mới
        console.log(`User  requested page number ${selectedPage + 1}`);
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
                        <label className="block text-gray-600 mb-1">
                            Tên đợt giảm giá
                        </label>
                        <input
                            type="text"
                            name="ten"  // Thêm thuộc tính name
                            id="discount-name"
                            placeholder="Tên đợt giảm giá"
                            className="w-full p-2 border rounded mb-4"
                            onChange={handleInputChange}  // Bỏ arrow function
                        />

                        <label className="block text-gray-600 mb-1">
                            Giá trị
                        </label>
                        <input
                            type="number"
                            name="giaTri"  // Thêm thuộc tính name
                            id="discount-value"
                            placeholder="Giá trị"
                            className="w-full p-2 border rounded mb-4"
                            onChange={handleInputChange}  // Bỏ arrow function
                        />

                        <div>
                            <label className="block text-gray-600 mb-1">Ngày bắt đầu</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={addKhuyenMai.tgBatDau}
                                onChange={(e) => setAddKhuyenMai({ ...addKhuyenMai, tgBatDau: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">Ngày kết thúc</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={addKhuyenMai.tgKetThuc}
                                onChange={(e) => setAddKhuyenMai({ ...addKhuyenMai, tgKetThuc: e.target.value })}
                            />
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
                                        <td className="py-2 px-4 border-b text-center">{index + 1}</td>
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
                                value={fillterSanPhamChiTiet.idMauSac}
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
                                value={fillterSanPhamChiTiet.idChatLieu}
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
                                value={fillterSanPhamChiTiet.idTrongLuong}
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
                                value={fillterSanPhamChiTiet.idDiemCanBang}
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
                                value={fillterSanPhamChiTiet.idDoCung}
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
                                    <td className="py-2 px-4 border-b text-center">{index + 1}</td>
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