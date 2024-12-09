import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, LocalShipping, CheckCircle, QrCodeScanner } from '@mui/icons-material';
import swal from 'sweetalert';

function SearchOrder() {
    const [orderId, setOrderId] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!orderId) {
            swal('Lỗi', 'Vui lòng nhập mã hóa đơn', 'error');
            return;
        }

        try {
            // Gọi API để kiểm tra thông tin hóa đơn
            const response = await axios.get(`http://localhost:8080/api/hoa-don/${orderId}`);
            const bill = response.data;

            // Kiểm tra trạng thái hóa đơn
            switch (bill.trangThai) {
                case 9:
                    swal('Thông báo', 'Hóa đơn đã được trả hàng! Vui lòng chọn hóa đơn khác', 'warning');
                    break;
                case 7:
                    // Nếu là trạng thái Hoàn thành, cho phép trả hàng
                    navigate(`/admin/tra-hang/don-hang?orderId=${orderId}`);
                    break;
                default:
                    swal('Thông báo', 'Hóa đơn chưa hoàn thành! Không thể trả hàng', 'warning');
            }
        } catch (error) {
            // Xử lý khi không tìm thấy hóa đơn
            if (error.response && error.response.status === 404) {
                swal('Lỗi', 'Không tìm thấy hóa đơn', 'error');
            } else {
                swal('Lỗi', 'Có lỗi xảy ra khi tìm kiếm hóa đơn', 'error');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-[1000px]">
                {/* Tiêu đề */}
                <div className="flex items-center mb-6">
                    <LocalShipping className="text-[#2f19ae] mr-2" />
                    <h1 className="text-2xl font-bold text-[#2f19ae]">Trả hàng</h1>
                </div>

                {/* Phần tìm kiếm */}
                <div className="flex items-center mb-6">
                    <CheckCircle className="text-[#2f19ae] text-xl mr-2" />
                    <label className="text-lg mr-4">Mã hóa đơn:</label>
                    <div className="flex items-center border border-[#2f19ae] rounded-lg overflow-hidden">
                        <Search className="text-[#2f19ae] p-2" />
                        <input
                            type="text"
                            placeholder="Nhập mã hóa đơn..."
                            className="p-2 outline-none w-60"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                    </div>
                    <button
                        className="bg-[#2f19ae] text-white px-2 py-2 rounded-lg ml-4 flex items-center hover:bg-[#1d0e8b] transition-colors"
                        onClick={handleSearch}
                    >
                        <Search className="mr-2" />
                        Tìm kiếm
                    </button>
                    <button className="border border-[#2f19ae] text-[#2f19ae] px-2 py-2 rounded-lg ml-2 flex items-center hover:bg-[#f0eaff] transition-colors">
                        <QrCodeScanner className="mr-2" />
                        Quét mã
                    </button>
                </div>

                {/* Hình ảnh minh họa */}
                <div className="flex justify-center mb-6">
                    <img
                        src="https://files.oaiusercontent.com/file-QVi8IMXpZyt8WvQSV6udHhvB?se=2024-11-14T04%3A10%3A01Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D1f92fc6d-74b4-40a7-aab4-99bde59d92d2.webp&sig=ifShX5Uxt73frBNoMQ2DZImpfEAmnJx4zBNrGegqupg%3D"
                        alt="Illustration of a person loading boxes into a truck"
                        className="rounded-lg shadow-lg"
                        width={400}
                    />
                </div>

                {/* Tiêu đề chính */}
                <h2 className="text-3xl font-bold text-center text-[#2f19ae]">TRẢ HÀNG</h2>
            </div>
        </div>
    );
}

export default SearchOrder;
