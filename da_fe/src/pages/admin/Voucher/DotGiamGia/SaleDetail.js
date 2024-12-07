import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const SaleDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [selectAllProduct, setSelectAllProduct] = useState(false)
    const [selectAllProductDetail, setSelectAllProductDetail] = useState(false)
    const [getProduct, setGetProduct] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedRowsProduct, setSelectedRowsProduct] = useState([])
    const [selectedProductIds, setSelectedProductIds] = useState([])
    const [getProductDetailByProduct, setGetProductDetailByProduct] = useState([])

    const [updateKhuyenMai, setUpdateKhuyenMai] = useState({
        ten: '',
        giaTri: '',
        loai: true,
        tgBatDau: '',
        tgKetThuc: '',
        trangThai: 0,
        idProductDetail: selectedRows
    })

    const [filterProductDetail, setFilterProductDetail] = useState({

    })

    useEffect(() => {
        fetchListSanPham();
    }, []);

    const fetchListSanPham = async () => {
        try {
            axios.get("http://localhost:8080/api/khuyen-mai/list-san-pham")
                .then((response) => {
                    setGetProduct(response.data);
                })
        } catch (error) {
            console.error('Failed to fetch list san pham: ', error);
        }
    }

    const getListProductDetailByIdKhuyenMai = () => {
        try {
            axios.get(`http://localhost:8080/api/khuyen-mai/get-id-san-pham-va-san-pham-chi-tiet-by-id-khuyen-mai/${id}`)
                .then((response) => {
                    const productIds = response.data;
                    setSelectedRowsProduct(productIds);

                    // Gọi API để lấy chi tiết sản phẩm
                    if (productIds.length > 0) {
                        axios.get(`http://localhost:8080/api/khuyen-mai/get-san-pham-chi-tiet-by-san-pham?id=${productIds.join(',')}`)
                            .then((productDetailResponse) => {
                                // Tự động select các chi tiết sản phẩm
                                const selectedProductDetailIds = productDetailResponse.data.map(detail => detail.id);
                                setSelectedRows(selectedProductDetailIds);
                                setGetProductDetailByProduct(productDetailResponse.data);
                            });
                    }
                })

        }catch (error) {
            console.error('Failed to fetch list san pham: ', error);
        }
    }

    useEffect(() => {
        getListProductDetailByIdKhuyenMai(id);
    }, []);

    const handleNavigateToSale = () => {
        navigate('/admin/giam-gia/dot-giam-gia');
    };

    const handleInputChange = (event) => {
        setUpdateKhuyenMai({...updateKhuyenMai, [event.target.name]: event.target.value})
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/khuyen-mai/detail/${id}`);
            setUpdateKhuyenMai(response.data);
        } catch (error) {
            console.error("Error fetching voucher details:", error);
        }
    };

    useEffect(() => {
        fetchData(id);
    }, []);


    //bo fillter
    const getProductDetailById = (selectedProductIds) => {
        if (selectedProductIds.length > 0) {
            const idProduct = selectedProductIds.join(','); // Chuyển đổi mảng thành chuỗi
            axios.get(`http://localhost:8080/api/khuyen-mai/get-san-pham-chi-tiet-by-san-pham?id=${idProduct}`)
                .then((response) => {
                    setGetProductDetailByProduct(response.data);
                })
                .catch((error) => {
                    console.error("There was an error fetching the product details!", error);
                });
        }
    };

    useEffect(() => {
        getProductDetailById(selectedProductIds);
    }, [selectedProductIds]);

    const handleSelectAllChangeProduct = (event) => {
        const selectedIds = event.target.checked ? getProduct.map((row) => row.id) : []
        setSelectedRowsProduct(selectedIds)
        setSelectedRows(selectedIds)
        setSelectAllProduct(event.target.checked)
        getProductDetailById(selectedIds)// bỏ filterProductDetail
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
            .map((selectedProduct) => selectedProduct.id);
        setSelectedProductIds(selectedProductIds);
        setSelectedRows(selectedProductIds);
    }

    const handleCheckboxChange2 = (event, productDetailId) => {
        const selectedIndex = selectedRows.indexOf(productDetailId)
        let newSelected = []

        if (selectedIndex === -1) {
            // Nếu chưa được chọn thì thêm vào
            newSelected = [...selectedRows, productDetailId]
        } else {
            // Nếu đã được chọn thì loại bỏ
            newSelected = selectedRows.filter(id => id !== productDetailId)
        }

        setSelectedRows(newSelected)
        setSelectAllProductDetail(newSelected.length === getProductDetailByProduct.length)
    }

    useEffect(() => {
        // Khi selectedRows thay đổi, cập nhật lại state của updateKhuyenMai
        setUpdateKhuyenMai(prev => ({
            ...prev,
            idProductDetail: selectedRows
        }))
    }, [selectedRows])

    const onSubmit = () => {
        const title = 'Xác nhận cập nhật đợt giảm giá?';
        console.log('Selected Rows:', selectedRows);
    
        swal({
            title: title,
            text: "Bạn có chắc chắn muốn cập nhật đợt giảm giá không?",
            icon: "question",
            buttons: {
                cancel: "Hủy",
                confirm: "Xác nhận",
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                // Sử dụng trực tiếp updateKhuyenMai và id từ scope
                const dataToUpdate = {
                    ...updateKhuyenMai,
                    loai: selectedRows.length === 0 ? false : true,
                    idProductDetail: selectedRows
                };
    
                axios.put(`http://localhost:8080/api/khuyen-mai/update/${id}`, dataToUpdate, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        swal("Thành công!", "Cập nhật đợt giảm giá thành công!", "success");
                        navigate('/admin/giam-gia/dot-giam-gia');
                    })
                    .catch((error) => {
                        console.error("Lỗi cập nhật:", error);
                        swal("Thất bại!", "Cập nhật đợt giảm giá thất bại!", "error");
                    });
            }
        });
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
                <span className="text-gray-400 ml-2">/ Chi tiết đợt giảm giá</span>
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg">
                <div className="flex justify-end mb-4">
                    <input
                        type="text"
                        placeholder="Tìm tên sản phẩm"
                        className="p-2 border rounded w-1/2"
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
                            value={updateKhuyenMai.ten}
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
                            value={updateKhuyenMai.giaTri}
                            onChange={handleInputChange}  // Bỏ arrow function
                        />

                        <div>
                            <label className="block text-gray-600 mb-1">Ngày bắt đầu</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={updateKhuyenMai.tgBatDau}
                                onChange={(e) => setUpdateKhuyenMai({...updateKhuyenMai, tgBatDau: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">Ngày kết thúc</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={updateKhuyenMai.tgKetThuc}
                                onChange={(e) => setUpdateKhuyenMai({...updateKhuyenMai, tgKetThuc: e.target.value})}
                            />
                        </div>

                        {selectedRowsProduct.length > 0 ? (
                            '') : (
                            <button
                                onClick={() => onSubmit()}
                                className="border border-amber-400 hover:bg-gray-100 text-amber-400 py-2 px-4 mt-4 rounded-md flex items-center">
                                Cập nhật
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
                    </div>
                </div>
            </div>
            {selectedRowsProduct.length > 0 && (
                <div className="bg-white p-4 mt-4 rounded-md shadow-lg mb-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl">CHI TIẾT SẢN PHẨM</h1>
                        <button
                            onClick={() => onSubmit()}
                            className="border border-amber-400 hover:bg-gray-100 text-amber-400 py-2 px-4 mt-4 rounded-md flex items-center">
                            Cập nhật
                        </button>
                    </div>

                    <div className="flex mb-4">
                        <input
                            type="text"
                            placeholder="Tìm tên sản phẩm"
                            className="p-2 border rounded w-1/2"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 pb-4 items-center">
                        <div className="flex items-center space-x-1">
                            <label className="text-sm text-gray-700">Thương hiệu:</label>
                            <select className="w-32 text-sm border rounded px-2 py-1">
                                <option value="" disabled>Thương hiệu</option>
                                <option value="">Tất cả</option>
                                <option value={0}>Công khai</option>
                                <option value={1}>Cá nhân</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-1">
                            <label className="text-sm text-gray-700">Màu sắc:</label>
                            <select className="w-32 text-sm border rounded px-2 py-1">
                                <option value="" disabled>Màu sắc</option>
                                <option value="">Tất cả</option>
                                <option value={0}>Công khai</option>
                                <option value={1}>Cá nhân</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-1">
                            <label className="text-sm text-gray-700">Màu sắc:</label>
                            <select className="w-32 text-sm border rounded px-2 py-1">
                                <option value="" disabled>Màu sắc</option>
                                <option value="">Tất cả</option>
                                <option value={0}>Công khai</option>
                                <option value={1}>Cá nhân</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-1">
                            <label className="text-sm text-gray-700">Màu sắc:</label>
                            <select className="w-32 text-sm border rounded px-2 py-1">
                                <option value="" disabled>Màu sắc</option>
                                <option value="">Tất cả</option>
                                <option value={0}>Công khai</option>
                                <option value={1}>Cá nhân</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-1">
                            <label className="text-sm text-gray-700">Màu sắc:</label>
                            <select className="w-32 text-sm border rounded px-2 py-1">
                                <option value="" disabled>Màu sắc</option>
                                <option value="">Tất cả</option>
                                <option value={0}>Công khai</option>
                                <option value={1}>Cá nhân</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-1">
                            <label className="text-sm text-gray-700">Màu sắc:</label>
                            <select className="w-32 text-sm border rounded px-2 py-1">
                                <option value="" disabled>Màu sắc</option>
                                <option value="">Tất cả</option>
                                <option value={0}>Công khai</option>
                                <option value={1}>Cá nhân</option>
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
                </div>
            )
            }
        </div>
    );
}

export default SaleDetail;