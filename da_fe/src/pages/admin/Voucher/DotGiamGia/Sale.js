import React, { useEffect, useState } from 'react';
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { TbEyeEdit } from "react-icons/tb";
import axios from "axios";
import swal from 'sweetalert';
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

const Sale = () => {
    const navigate = useNavigate();
    const [listKhuyenMai, setListKhuyenMai] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const size = 5;

    const [searchKhuyenMai, setSearchKhuyenMai] = useState({
        tenSearch: "",
        tgBatDauSearch: "",
        tgKetThucSearch: "",
        trangThaiSearch: "",
        sortOrder: ""
    })

    const validateSearchInput = (value) => {
        const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
        return !specialCharsRegex.test(value);
    }

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        // Kiểm tra giá trị nhập vào có hợp lệ không
        if (validateSearchInput(inputValue)) {
            setSearchKhuyenMai((prev) => ({
                ...prev,
                tenSearch: inputValue
            }));

            // Gọi hàm tìm kiếm mỗi khi có sự thay đổi
            loadKhuyenMaiSearch({
                ...searchKhuyenMai,
                tenSearch: inputValue
            }, 0); // Gọi lại hàm tìm kiếm với trang đầu tiên
        }
    }, [inputValue]); // Chạy khi inputValue thay đổi

    const loadKhuyenMaiSearch = (searchKhuyenMai, currentPage) => {
        const params = new URLSearchParams({
            tenSearch: searchKhuyenMai.tenSearch || "",
            tgBatDauSearch: searchKhuyenMai.tgBatDauSearch || "",
            tgKetThucSearch: searchKhuyenMai.tgKetThucSearch || "",
            trangThaiSearch: searchKhuyenMai.trangThaiSearch || "",
            currentPage: currentPage,
            size: size
        });

        axios.get(`http://localhost:8080/api/khuyen-mai/search?${params.toString()}`)
            .then((response) => {
                let sortedListKhuyenMai = response.data.content;

                // Sắp xếp phía client dựa trên sortOrder
                if (searchKhuyenMai.sortOrder === "ascending") {
                    sortedListKhuyenMai.sort((a, b) => a.giaTri - b.giaTri); // Giá trị tăng dần
                } else if (searchKhuyenMai.sortOrder === "descending") {
                    sortedListKhuyenMai.sort((a, b) => b.giaTri - a.giaTri); // Giá trị giảm dần
                }

                setListKhuyenMai(sortedListKhuyenMai); // Cập nhật danh sách đã sắp xếp
                setPageCount(response.data.totalPages); // Cập nhật tổng số trang
                setCurrentPage(response.data.currentPage)
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };


    useEffect(() => {
        loadKhuyenMaiSearch(searchKhuyenMai, 0);
    }, [searchKhuyenMai])

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

        if (listKhuyenMai.trangThai === 2) {
            toast.success('Đợt giảm giá đã kết thúc');
        }

        swal({
            title: title,
            text: 'Bạn chắc chắn muốn xóa phiếu giảm giá này?',
            icon: 'question',
            buttons: {
                cancel: "Hủy",
                confirm: "Xác nhận",
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                // Thực hiện gọi API với axios
                axios.put(`http://localhost:8080/api/khuyen-mai/delete/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        swal("Thành công!", "Hủy đợt giảm giá thành công", "success")
                        fetchListKhuyenMai() // Gọi lại hàm loadVoucher để làm mới danh sách
                    })
                    .catch((error) => {
                        console.error("Lỗi cập nhật:", error);
                        swal("Thất bại!", "Hủy đợt giảm giá thất bại!", "error");
                    });
            }
        });
    }

    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        loadKhuyenMaiSearch(searchKhuyenMai, selectedPage); // Gọi hàm tìm kiếm với trang mới
        console.log(`User  requested page number ${selectedPage + 1}`);
    };

    return (
        <div>
            <div className="font-bold text-sm">
                Đợt giảm giá
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg">
                <div className="flex">
                    {/* search */}
                    <input
                        type="text"
                        placeholder="Tìm phiếu theo tên đợt giảm giá"
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
                            const newTgBatDauSearch = e.target.value;
                            setSearchKhuyenMai({
                                ...searchKhuyenMai,
                                tgBatDauSearch: newTgBatDauSearch
                            });
                            loadKhuyenMaiSearch({
                                ...searchKhuyenMai,
                                tgBatDauSearch: newTgBatDauSearch
                            }, 0);
                        }}
                    />
                    <input
                        type="date"
                        placeholder="Đến ngày"
                        className="border border-gray-300 rounded-md px-4 py-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-gray-200"
                        onChange={(e) => {
                            const newTgKetThucSearch = e.target.value;
                            setSearchKhuyenMai({
                                ...searchKhuyenMai,
                                tgKetThucSearch: newTgKetThucSearch
                            });
                            loadKhuyenMaiSearch({
                                ...searchKhuyenMai,
                                tgKetThucSearch: newTgKetThucSearch
                            }, 0);
                        }}
                    />

                    {/* Trạng thái Dropdown */}
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-700 font-semibold">Trạng thái:</label>
                        <select
                            value={searchKhuyenMai.trangThaiSearch}
                            onChange={(e) => {
                                const newTrangThaiSearch = e.target.value;
                                setSearchKhuyenMai({
                                    ...searchKhuyenMai,
                                    trangThaiSearch: newTrangThaiSearch
                                });
                                loadKhuyenMaiSearch({
                                    ...searchKhuyenMai,
                                    trangThaiSearch: newTrangThaiSearch
                                }, 0); // Gọi lại hàm tìm kiếm với trang đầu tiên
                            }}
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
                            value={searchKhuyenMai.sortOrder}
                            onChange={(e) =>
                                setSearchKhuyenMai((prevState) => ({
                                    ...prevState,
                                    sortOrder: e.target.value, // Cập nhật giá trị sortOrder
                                }))
                            }
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200">
                            <option value="">Giá trị</option>
                            <option value="ascending">Tăng dần</option>
                            <option value="descending">Giảm dần</option>
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
                                const stt = (currentPage * 5) + index + 1;
                                return (
                                    <tr key={sale.id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{stt}</td>
                                        <td className="py-2 px-4 border-b">{sale.ten}</td>
                                        <td className="py-2 px-4 border-b">{sale.giaTri}%</td>
                                        <td className="py-2 px-4 border-b">
                                            <span
                                                className={`py-1 px-3 rounded-full text-xs whitespace-nowrap ${sale.trangThai === 2
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
                                                <TbEyeEdit />
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

export default Sale;