import './ProductCard.css';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleProductClick = () => {
        navigate(`/san-pham/san-pham-ct/${product.id}`); // Điều hướng đến trang ProductDetail với ID sản phẩm
    };

    // Tìm ảnh có chứa từ "main" trong URL
    const mainImage = product.hinhAnhUrls.find((url) => url.includes('main')) || product.hinhAnhUrls[0];

    console.log(mainImage); // Xóa dòng này khi không cần thiết
    console.log('Hình ảnh URLs:', product.hinhAnhUrls[0]);

    return (
        <div className="flex flex-wrap">
            <div className="productCard w-[195px] m-3 transition-all cursor-pointer">
                <div className="h-[15rem]" onClick={handleProductClick}>
                    <img className="w-full h-full object-cover" src={mainImage} alt={product.sanPhamTen} />
                </div>

                <div className="textPart bg-white p-3">
                    <div>
                        {/* Chỉnh kích thước font của tên sản phẩm */}
                        <p className="font-bold opacity-60" style={{ fontSize: '13px' }}>
                            {product.sanPhamTen}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Chỉnh kích thước font của giá sản phẩm */}
                        <p className="font-bold text-red-500 text-sm">{product.donGia.toLocaleString()} ₫</p>
                        {/* Uncomment below if you have a sale price to show */}
                        {/* <p className="line-through opacity-50 text-sm">4.229.000 ₫</p>
                            <p className="text-green-600 font-semibold text-sm">20% off</p> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
