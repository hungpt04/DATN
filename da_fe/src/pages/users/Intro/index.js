function Intro() {
    return (
        <div className="p-5">
            <p className="text-3xl font-bold mb-2">Giới thiệu</p>
            <p className="text-base mb-2 text-gray-800">
                Chào mừng bạn đến với website bán vợt cầu lông <span className="font-medium">Backet</span>. Chúng tôi
                cam kết mang đến sản phẩm chất lượng và dịch vụ tốt nhất cho khách hàng.
            </p>
            <hr />
            <h2 className="text-2xl font-semibold mt-3">Chính sách của chúng tôi</h2>
            <div className="mt-5">
                <p className="text-lg font-semibold mb-3 text-gray-800">Chính sách bán hàng</p>
                <ul className="list-disc pl-5 space-y-3" style={{ listStyleType: 'none' }}>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Thông tin sản phẩm:</span> Cung cấp đầy đủ và chính xác về vợt cầu lông.
                    </li>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Giá cả khuyến mãi:</span> Niêm yết giá rõ ràng, minh bạch và kèm theo điều kiện chương
                        trình khuyến mãi.
                    </li>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Tình trạng hàng hoá:</span> Cung cấp thông tin về tình trạng còn hay hết hàng.
                    </li>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Đặt hàng và thanh toán:</span> Các bước đặt hàng, hình thức thanh toán đa dạng, hướng
                        dẫn trả hàng hoặc sửa thông tin đơn hàng.
                    </li>
                </ul>
            </div>

            {/* Chính Sách Trả Hàng */}
            <div className="mt-5">
                <p className="text-lg font-semibold mb-3 text-gray-800">Chính sách trả hàng</p>
                <ul className="list-disc pl-5 space-y-3" style={{ listStyleType: 'none' }}>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Điều kiện trả hàng:</span> Sản phẩm lỗi, giao nhầm, không đúng yêu cầu của khách hàng.
                    </li>
                    {/* <li>
                        <span>Thời gian áp dụng:</span> Trong vòng 7 ngày.
                    </li> */}
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Phương thức trả:</span> Tự đến cửa hàng hoặc gửi qua bưu điện.
                    </li>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Chi phí trả:</span> Miễn phí hoặc chịu phí tùy vào từng trường hợp.
                    </li>
                </ul>
            </div>

            {/* Chính Sách Bảo Mật Thông Tin */}
            <div className="mt-5">
                <p className="text-lg font-semibold mb-3 text-gray-800">Chính sách bảo mật thông tin</p>
                <ul className="list-disc pl-5 space-y-3" style={{ listStyleType: 'none' }}>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Thu thập thông tin khách hàng:</span> Chỉ để tư vấn khách hàng.
                    </li>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Phạm vi sử dụng thông tin:</span> Chỉ sử dụng trong nội bộ.
                    </li>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Cam kết bảo mật:</span> Bảo vệ quyền lợi khách hàng và dữ liệu cá nhân.
                    </li>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Quyền của khách hàng:</span> Chỉnh sửa, xoá thông tin cá nhân.
                    </li>
                </ul>
            </div>

            {/* Chính Sách Thanh Toán */}
            <div className="mt-5">
                <p className="text-lg font-semibold mb-3 text-gray-800">Chính sách thanh toán</p>
                <ul className="list-disc pl-5 space-y-3" style={{ listStyleType: 'none' }}>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Các hình thức thanh toán:</span> Tiền mặt hoặc chuyển khoản ngân hàng VNPAY.
                    </li>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Hướng dẫn thanh toán:</span> Các bước thanh toán rõ ràng.
                    </li>
                </ul>
            </div>

            {/* Chính Sách Hoàn Tiền */}
            <div className="mt-5">
                <p className="text-lg font-semibold mb-3 text-gray-800">Chính sách trả hàng hoàn tiền</p>
                <p className="text-base text-gray-700 pl-5">Chính sách bảo vệ quyền lợi người tiêu dùng và hỗ trợ khách hàng gặp vấn đề.</p>
                <p className="text-base text-gray-700 pl-5">Xác nhận trả hàng 1 lần duy nhất cho 1 đơn hàng</p>
            </div>
            {/* Chính Sách Sử Dụng Website */}
            <div className="mt-5">
                <p className="text-lg font-semibold mb-3 text-gray-800">Chính sách sử dụng website</p>
                <ul className="list-disc pl-5 space-y-3" style={{ listStyleType: 'none' }}>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Quyền và trách nhiệm:</span> Quyền và trách nhiệm của người dùng và chủ website.
                    </li>
                </ul>
            </div>

            {/* Chính Sách Khuyến Mãi */}
            <div className="mt-5">
                <p className="text-lg font-semibold mb-3 text-gray-800">Chính sách khuyến mãi và ưu đãi</p>
                <ul className="list-disc pl-5 space-y-3" style={{ listStyleType: 'none' }}>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Điều kiện và thời gian áp dụng:</span> Các chương trình khuyến mại.
                    </li>
                    <li className="text-base text-gray-700">
                        <span className="font-medium">Quy định sử dụng:</span> Mã giảm giá, voucher đi kèm sản phẩm.
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Intro;
