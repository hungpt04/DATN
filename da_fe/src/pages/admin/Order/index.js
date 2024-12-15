import axios from 'axios';
import { useEffect, useState } from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import ExcelJS from 'exceljs'

function Order() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(7);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState(''); // Trạng thái tìm kiếm
    const navigate = useNavigate();
    const [excelData, setExcelData] = useState([]); // Dữ liệu excel

    const loadOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/hoa-don');
            const sortedOrders = response.data.sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));
            setOrders(sortedOrders);
            setFilteredOrders(sortedOrders);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    const handleViewOrder = async (order) => {
        try {
            // Lấy thông tin hóa đơn theo ID
            const hoaDonResponse = await axios.get(`http://localhost:8080/api/hoa-don/${order.id}`);

            // Chuyển đến trang OrderHistory và truyền thông tin hóa đơn và thanh toán
            navigate('/admin/quan-ly-don-hang/order-history', {
                state: { order: hoaDonResponse.data || null }, // Gửi null nếu không có thanh toán
            });
        } catch (error) {
            console.error('Failed to fetch order details', error);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        let filtered = orders;

        if (startDate) {
            filtered = filtered.filter((order) => new Date(order.ngayTao) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter((order) => new Date(order.ngayTao) <= new Date(endDate));
        }

        if (selectedType === 'online') {
            filtered = filtered.filter((order) => order.loaiHoaDon === 'Trực tuyến');
        } else if (selectedType === 'in-store') {
            filtered = filtered.filter((order) => order.loaiHoaDon === 'Tại quầy');
        }

        if (selectedStatus !== 'all') {
            filtered = filtered.filter((order) => order.trangThai === parseInt(selectedStatus, 10));
        }

        if (searchTerm) {
            filtered = filtered.filter((order) => order.ma.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setFilteredOrders(filtered);
        setCurrentPage(1);
    }, [startDate, endDate, selectedType, selectedStatus, searchTerm, orders]);

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const getStatusLabel = (status) => {
        switch (status) {
            case 1:
                return { label: 'Chờ xác nhận', color: 'bg-yellow-200 text-yellow-800' };
            case 2:
                return { label: 'Chờ giao hàng', color: 'bg-blue-200 text-blue-800' };
            case 3:
                return { label: 'Đang vận chuyển', color: 'bg-purple-200 text-purple-800' };
            case 4:
                return { label: 'Đã giao hàng', color: 'bg-gray-200 text-green-800' };
            case 5:
                return { label: 'Đã thanh toán', color: 'bg-teal-200 text-teal-800' };
            case 6:
                return { label: 'Chờ thanh toán', color: 'bg-orange-200 text-orange-800' };
            case 7:
                return { label: 'Hoàn thành', color: 'bg-pink-200 text-gray-800' };
            case 8:
                return { label: 'Đã hủy', color: 'bg-red-200 text-red-800' };
            case 9:
                return { label: 'Trả hàng', color: 'bg-red-400 text-white' };
            default:
                return { label: 'Không xác định', color: 'bg-gray-200 text-gray-800' };
        }
    };

    const statusOptions = [
        { label: 'TẤT CẢ', value: 'all' },
        { label: 'ĐÃ HUỶ', value: '8' },
        { label: 'CHỜ XÁC NHẬN', value: '1' },
        { label: 'CHỜ GIAO HÀNG', value: '2' },
        { label: 'ĐANG VẬN CHUYỂN', value: '3' },
        { label: 'ĐÃ GIAO HÀNG', value: '4' },
        { label: 'ĐÃ THANH TOÁN', value: '5' },
        { label: 'CHỜ THANH TOÁN', value: '6' },
        { label: 'HOÀN THÀNH', value: '7' },
    ];

    const getAllDonHangExcel = () => {
        axios.get(`http://localhost:8080/api/hoa-don`)
            .then((response) => {
                setExcelData(response.data);
            })
            .catch((error) => {
                console.error("Có lỗi xảy ra:", error);
            });
    };

    useEffect(() => {
        getAllDonHangExcel();
    }, [])

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('VoucherData')

        const columns = [
            { header: 'STT', key: 'stt', width: 5 },
            { header: 'Mã', key: 'ma', width: 8 },
            { header: 'Tổng sản phẩm', key: 'soLuong', width: 15 },
            { header: 'Tổng số tiền', key: 'tongTien', width: 15 },
            { header: 'Tên khách hàng', key: 'hoTen', width: 15 },
            { header: 'Ngày tạo', key: 'ngayTao', width: 17.5 },
            { header: 'Loại hóa đơn', key: 'loaiHoaDon', width: 17.5 },
            { header: 'Trạng thái', key: 'trangThai', width: 20 },
        ]

        const statusMap = {
            1: 'Chờ xác nhận',
            2: 'Chờ giao hàng',
            3: 'Đang vận chuyển',
            4: 'Đã giao hàng',
            5: 'Đã thanh toán',
            6: 'Chờ thanh toán',
            7: 'Hoàn thành',
            8: 'Đã hủy',
            9: 'Trả hàng'
          };

        worksheet.columns = columns

        excelData.forEach((item, index) => {
            worksheet.addRow({
                stt: index + 1,
                ma: item.ma,
                soLuong: item.soLuong,
                tongTien: item.tongTien,
                hoTen: item.taiKhoan ? item.taiKhoan.hoTen : 'Khách lẻ',
                ngayTao: item.ngayTao,
                loaiHoaDon: item.loaiHoaDon,
                trangThai: statusMap[item.trangThai],
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
            link.download = 'DonHang_data.xlsx'
            link.click()
        })
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Quản lý đơn hàng</h1>
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm hoá đơn"
                    className="border rounded p-2 flex-grow mr-2"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                {/* <button className="border rounded p-2 bg-[#2f19ae] text-white mr-2">Quét mã</button>
                <button className="border rounded p-2 bg-[#2f19ae] text-white">Tạo hoá đơn</button> */}
            </div>
            <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                    <label className="mr-2 font-semibold">Từ ngày</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>
                <div className="flex items-center mr-4">
                    <label className="mr-2 font-semibold">Đến ngày</label>
                    <input type="date" value={endDate} onChange={handleEndDateChange} className="border rounded p-2" />
                </div>
                <div className="flex items-center mr-4">
                    <label className="mr-2 font-semibold">Loại:</label>
                    <label className="mr-2">
                        <input
                            type="radio"
                            name="type"
                            value="all"
                            checked={selectedType === 'all'}
                            onChange={handleTypeChange}
                            className="mr-1"
                        />
                        Tất cả
                    </label>
                    <label className="mr-2">
                        <input
                            type="radio"
                            name="type"
                            value="online"
                            checked={selectedType === 'online'}
                            onChange={handleTypeChange}
                            className="mr-1"
                        />
                        Trực tuyến
                    </label>
                    <label className="mr-2">
                        <input
                            type="radio"
                            name="type"
                            value="in-store"
                            checked={selectedType === 'in-store'}
                            onChange={handleTypeChange}
                            className="mr-1"
                        />
                        Tại quầy
                    </label>
                </div>
                <button onClick={exportToExcel} className="border rounded p-2 bg-[#2f19ae] text-white">Export Excel</button>
            </div>

            <div className="border-b mb-4">
                <ul className="flex">
                    {statusOptions.map((status) => (
                        <li
                            key={status.value}
                            onClick={() => setSelectedStatus(status.value)}
                            className={`mr-4 pb-2 text-xs cursor-pointer ${selectedStatus === status.value ? 'border-b-2 border-blue-500' : ''
                                }`}
                        >
                            {status.label}
                        </li>
                    ))}
                </ul>
            </div>

            <table className="min-w-full bg-white text-xs">
                <thead>
                    <tr>
                        <th className="py-1 px-2 border-b text-left">#</th>
                        <th className="py-1 px-2 border-b text-left">Mã</th>
                        <th className="py-1 px-2 border-b text-left">Tổng SP</th>
                        <th className="py-1 px-2 border-b text-left">Tổng số tiền</th>
                        <th className="py-1 px-2 border-b text-left">Tên khách hàng</th>
                        <th className="py-1 px-2 border-b text-left">Ngày tạo</th>
                        <th className="py-1 px-2 border-b text-left">Loại hoá đơn</th>
                        <th className="py-1 px-2 border-b text-left">Trạng thái</th>
                        <th className="py-1 px-2 border-b text-left">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((order, index) => {
                        const { label, color } = getStatusLabel(order.trangThai);
                        return (
                            <tr key={order.id}>
                                <td className="py-1 px-2 border-b">{index + 1}</td>
                                <td className="py-1 px-2 border-b">{order.ma}</td>
                                <td className="py-1 px-2 border-b">{order.soLuong}</td>
                                <td className="py-1 px-2 border-b">{order.tongTien.toLocaleString() + ' VNĐ'}</td>
                                <td className="py-1 px-2 border-b">
                                    {order.taiKhoan ? order.taiKhoan.hoTen : 'Khách lẻ'}
                                </td>
                                <td className="py-1 px-2 border-b">
                                    {new Date(order.ngayTao).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="py-1 px-2 border-b">
                                    <span
                                        className={`${order.loaiHoaDon === 'Trực tuyến'
                                                ? 'bg-indigo-200 text-indigo-800'
                                                : 'bg-green-200 text-green-800'
                                            } py-0.5 px-2 rounded-full text-xs`}
                                    >
                                        {order.loaiHoaDon}
                                    </span>
                                </td>

                                <td className="py-1 px-2 border-b">
                                    <span className={`${color} py-0.5 px-2 rounded-full text-xs`}>{label}</span>
                                </td>
                                <td className="py-1 px-2 border-b">
                                    <button
                                        onClick={() => handleViewOrder(order)}
                                        className=" hover:bg-gray-400 font-medium py-2 px-4 rounded"
                                    >
                                        <RemoveRedEyeIcon className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="flex justify-center mb- 4 mt-7">
                <button
                    className={`${currentPage === 1 ? 'bg-gray-200 text-gray-800' : 'bg-white text-[#2f19ae]'
                        } border border-[#2f19ae] hover:bg-[#2f19ae] hover:text-white font-medium py-1 px-2 rounded mx-1 transition duration-200`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <SkipPreviousIcon />
                </button>

                {Array(totalPages)
                    .fill(0)
                    .map((_, index) => (
                        <button
                            key={index}
                            className={`${currentPage === index + 1 ? 'bg-[#2f19ae] text-white' : 'bg-white text-[#2f19ae]'
                                } border border-[#2f19ae] hover:bg-[#2f19ae] hover:text-white font-medium py-1 px-2 rounded mx-1 transition duration-200`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                <button
                    className={`${currentPage === totalPages ? 'bg-gray-200 text-gray-800' : 'bg-white text-[#2f19ae]'
                        } border border-[#2f19ae] hover:bg-[#2f19ae] hover:text-white font-medium py-1 px-2 rounded mx-1 transition duration-200`}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <SkipNextIcon />
                </button>
            </div>
        </div>
    );
}

export default Order;
