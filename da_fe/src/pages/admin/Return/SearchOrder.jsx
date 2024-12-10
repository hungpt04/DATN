import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LocalShipping, CheckCircle, QrCodeScanner } from '@mui/icons-material';

function SearchOrder() {
    const [orderId, setOrderId] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (orderId) {
            navigate(`/admin/tra-hang/don-hang?orderId=${orderId}`);
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
                        src="https://blog.dktcdn.net/files/ship-hang-nhanh3.jpg"
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
