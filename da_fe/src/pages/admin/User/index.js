import AddIcon from '@mui/icons-material/Add';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Avatar } from '@mui/material';
import ReactPaginate from 'react-paginate';

function User() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const size = 5;

    const [searchNhanVien, setSeachNhanVien] = useState({
        tenSearch: "",
        emailSearch: "",
        sdtSearch: "",
        gioiTinhSearch: "",
        trangThaiSearch: ""
    })

    const loadNhanVienSearch = (searchNhanVien, currentPage) => {
        const params = new URLSearchParams({
            tenSearch: searchNhanVien.tenSearch,
            emailSearch: searchNhanVien.emailSearch,
            sdtSearch: searchNhanVien.sdtSearch,
            gioiTinhSearch: searchNhanVien.gioiTinhSearch,
            trangThaiSearch: searchNhanVien.trangThaiSearch,
            size: size,
            currentPage: currentPage
        })
        axios.get(`http://localhost:8080/api/nhan-vien/searchNhanVien?${params.toString()}`)
        .then((response) => {
            setUsers(response.data.content);
            setPageCount(response.data.totalPages);
            setCurrentPage(response.data.currentPage)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
            
    }

    useEffect(() => {
        loadNhanVienSearch(searchNhanVien, 0)
    }, [searchNhanVien])

    const handleDelete = async (id) => {
        const title = 'Xác nhận thay đổi trạng thái hoạt động?'
        const text = 'Bạn có chắc chắn muốn thay đổi trạng thái hoạt động?'

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
                axios.put(`http://localhost:8080/api/nhan-vien/delete/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        swal("Thành công!", "Thay đổi trạng thái thành công", "success")
                        loadNhanVienSearch(searchNhanVien, currentPage)
                    })
                    .catch((error) => {
                        console.error("Lỗi cập nhật:", error);
                        swal("Thất bại!", "Thay đổi trạng thái thất bại!", "error");
                    });
            }
        });
    };

    const handleEdit = (id) => {
        navigate(`/admin/tai-khoan/nhan-vien/edit/${id}`);
    };

    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        loadNhanVienSearch(searchNhanVien, selectedPage);
        console.log(`User  requested page number ${selectedPage + 1}`);
    };

    return (
        <div>
            <div className="font-bold text-sm">
                Nhân viên
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg">
                <div className="flex">
                    {/* search */}
                    <input
                        type="text"
                        placeholder="Tìm phiếu theo tên hoặc sđt hoặc email"
                        className="border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md px-4 py-2 text-gray-700 w-1/2"
                        value={searchNhanVien.tenSearch}
                        onChange={(e) => {
                            const newTenSearch = e.target.value;
                            setSeachNhanVien({
                                ...searchNhanVien,
                                tenSearch: newTenSearch
                            });
                            loadNhanVienSearch({
                                ...searchNhanVien,
                                tenSearch: newTenSearch
                            }, 0);
                        }}
                    />
                    <div className="ml-auto flex space-x-4">
                        <Link to={'/admin/tai-khoan/nhan-vien/add'}>
                            <button className="hover:bg-gray-400 border border-gray-300 font-medium py-2 px-4 rounded">
                                <AddIcon /> Tạo nhân viên
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="flex space-x-4 pt-4 pb-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-700 font-semibold">Giới tính:</label>
                        <select
                            value={searchNhanVien.gioiTinhSearch}
                            onChange={(e) => {
                                const newGioiTinhSearch = e.target.value;
                                setSeachNhanVien({
                                    ...searchNhanVien,
                                    gioiTinhSearch: newGioiTinhSearch
                                });
                                loadNhanVienSearch({
                                    ...searchNhanVien,
                                    gioiTinhSearch: newGioiTinhSearch
                                }, 0);
                            }}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <option value="">
                                Tất cả
                            </option>
                            <option value={0}>Nam</option>
                            <option value={1}>Nữ</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-gray-700 font-semibold">Trạng thái:</label>
                        <select
                            value={searchNhanVien.trangThaiSearch}
                            onChange={(e) => {
                                const newTrangThaiSearch = e.target.value;
                                setSeachNhanVien({
                                    ...searchNhanVien,
                                    trangThaiSearch: newTrangThaiSearch
                                });
                                loadNhanVienSearch({
                                    ...searchNhanVien,
                                    trangThaiSearch: newTrangThaiSearch
                                }, 0);
                            }}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <option value="">
                                Tất cả
                            </option>
                            <option value={1}>Hoạt động</option>
                            <option value={0}>Không hoạt động</option>
                        </select>
                    </div>
                </div>

                <table className="min-w-full text-center table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-2 px-4 text-center border-b">STT</th>
                            <th className="py-2 px-4 text-center border-b">Ảnh</th>
                            <th className="py-2 px-4 text-center border-b">Mã</th>
                            <th className="py-2 px-4 text-center border-b">Họ tên</th>
                            <th className="py-2 px-4 text-center border-b">Email</th>
                            <th className="py-2 px-4 text-center border-b">SĐT</th>
                            <th className="py-2 px-4 text-center border-b">Ngày sinh</th>
                            <th className="py-2 px-4 text-center border-b">Giới tính</th>
                            <th className="py-2 px-4 text-center border-b">Trạng thái</th>
                            <th className="py-2 px-4 text-center border-b">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-100">
                                
                                <td className="py-2 px-4 border-b">{(currentPage * 5) + index + 1}</td>
                                <td className="py-4 px-4 border-b">
                                    {user.avatar != null ? (
                                        <img className="w-10 h-10 rounded-full" src={user.avatar} alt="avatar" />
                                    ) : (
                                        <Avatar />
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">{user.ma}</td>
                                <td className="py-2 px-4 border-b">{user.hoTen}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{user.sdt}</td>
                                <td className="py-2 px-4 border-b">{new Date(user.ngaySinh).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                                </td>
                                <td className="py-2 px-4 border-b">{user.gioiTinh === 0 ? 'Nam' : 'Nữ'}</td>
                                <td className="py-2 px-4 border-b">
                                    <span
                                        className={`py-1 px-3 rounded-full text-xs whitespace-nowrap ${user.trangThai === 0
                                            ? 'bg-red-200 text-red-700 border border-red-800'
                                            : user.trangThai === 1
                                                ? 'bg-green-200 text-green-700 border border-green-800'
                                                : 'bg-gray-200 text-gray-700 border border-gray-800'
                                            }`}
                                    >
                                        {user.trangThai === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex">
                                        <button
                                            onClick={() => handleEdit(user.id)}
                                            className="hover:bg-gray-400 font-medium py-2 px-4 rounded"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="hover:bg-gray-400 font-medium py-2 px-4 rounded"
                                        >
                                            <TrashIcon className="w-5" />
                                        </button>
                                    </div>
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
    );
}

export default User;
