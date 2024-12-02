import AddIcon from '@mui/icons-material/Add';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function User() {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/tai-khoan');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch Users', error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Lọc ra những tài khoản có vai trò là "User"
    const filteredUsers = users.filter((user) => user.vaiTro === 'Customer');

    return (
        <div>
            <h4 className="text-center text-5xl font-bold text-gray-800">Danh sách khách hàng</h4>
            <div className="flex justify-end mb-4">
                <Link to={'/admin/tai-khoan/khach-hang/add'}>
                    <button className="hover:bg-gray-400 font-medium py-2 px-4 rounded">
                        <AddIcon />
                    </button>
                </Link>
            </div>
            <table className="w-full table-auto bg-white rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200 text-gray-700 text-[11px]">
                        <th className="py-4 px-6 text-left">STT</th>
                        <th className="py-4 px-6 text-left">Ảnh</th>
                        <th className="py-4 px-6 text-left">Họ tên</th>
                        <th className="py-4 px-6 text-left">Email</th>
                        <th className="py-4 px-6 text-left">SDT</th>
                        <th className="py-4 px-6 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                            Ngày sinh
                        </th>
                        <th className="py-4 px-6 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                            Giới tính
                        </th>
                        <th className="py-4 px-6 text-left">Trạng thái</th>
                        <th className="py-4 px-6 text-left">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-100 text-[10px]">
                            <td className="py-4 px-6">{index + 1}</td>
                            <td className="py-4 px-4">
                                <img src={user.avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap overflow-hidden text-ellipsis">{user.hoTen}</td>
                            <td className="py-4 px-6">{user.email}</td>
                            <td className="py-4 px-6">{user.sdt}</td>
                            <td className="py-4 px-6 whitespace-nowrap overflow-hidden text-ellipsis">
                                {user.ngaySinh.split('T')[0]}
                            </td>
                            <td className="py-4 px-6">{user.gioiTinh === 0 ? 'Nam' : 'Nữ'}</td>
                            <td className="py-4 px-6 whitespace-nowrap overflow-hidden text-ellipsis">
                                {user.trangThai === 1 ? 'Hoạt động' : 'Không hoạt động'}
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex">
                                    <button className="hover:bg-gray-400 font-medium py-2 px-4 rounded">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button className="hover:bg-gray-400 font-medium py-2 px-4 rounded">
                                        <TrashIcon className="w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default User;
