import AddIcon from '@mui/icons-material/Add';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import anhdep from '../../../components/Assets/anhdep.jpg';
import anhxau from '../../../components/Assets/anhxau.jpg';
import anhxau1 from '../../../components/Assets/anhxau1.jpg';

function User() {
    // Sample data for users
    const users = [
        {
            id: 1,
            avatar: anhdep,
            ma: 'TK001',
            hoTen: 'Nguyen Van A',
            email: 'a@example.com',
            sdt: '0123456789',
            ngaySinh: '1990-01-01',
            gioiTinh: 'Nam',
            vaiTro: 'Customer',
            trangThai: 'Hoạt động',
        },
        {
            id: 2,
            avatar: anhxau,
            ma: 'TK002',
            hoTen: 'Tran Thi B',
            email: 'b@example.com',
            sdt: '0987654321',
            ngaySinh: '1985-02-15',
            gioiTinh: 'Nữ',
            vaiTro: 'Admin',
            trangThai: 'Hoạt động',
        },
        {
            id: 3,
            avatar: anhxau1,
            ma: 'TK003',
            hoTen: 'Le Van C',
            email: 'c@example.com',
            sdt: '0912345678',
            ngaySinh: '1992-03-10',
            gioiTinh: 'Nam',
            vaiTro: 'Customer',
            trangThai: 'Ngừng hoạt động',
        },
    ];

    return (
        <div>
            <h4 className="text-center text-5xl font-bold text-gray-800">Danh sách nhân viên</h4>
            <div className="flex justify-end mb-4">
                <button className="hover:bg-gray-400 font-medium py-2 px-4 rounded">
                    <AddIcon />
                </button>
            </div>
            <table className="w-full table-auto bg-white rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200 text-gray-700 text-[11px]">
                        <th className="py-4 px-6 text-left">STT</th>
                        <th className="py-4 px-6 text-left">Ảnh</th>
                        <th className="py-4 px-6 text-left">Mã</th>
                        <th className="py-4 px-6 text-left">Họ tên</th>
                        <th className="py-4 px-6 text-left">Email</th>
                        <th className="py-4 px-6 text-left">SDT</th>
                        <th className="py-4 px-6 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                            Ngày sinh
                        </th>
                        <th className="py-4 px-6 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                            Giới tính
                        </th>
                        <th className="py-4 px-6 text-left">Vai trò</th>
                        <th className="py-4 px-6 text-left">Trạng thái</th>
                        <th className="py-4 px-6 text-left">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-100 text-[10px]">
                            <td className="py-4 px-6">{index + 1}</td>
                            <td className="py-4 px-4">
                                <img src={user.avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
                            </td>
                            <td className="py-4 px-6">{user.ma}</td>
                            <td className="py-4 px-6 whitespace-nowrap overflow-hidden text-ellipsis">{user.hoTen}</td>
                            <td className="py-4 px-6">{user.email}</td>
                            <td className="py-4 px-6">{user.sdt}</td>
                            <td className="py-4 px-6 whitespace-nowrap overflow-hidden text-ellipsis">
                                {user.ngaySinh}
                            </td>
                            <td className="py-4 px-6">{user.gioiTinh}</td>
                            <td className="py-4 px-6">{user.vaiTro}</td>
                            <td className="py-4 px-6 whitespace-nowrap overflow-hidden text-ellipsis">
                                {user.trangThai}
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
