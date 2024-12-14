import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductCard({ product }) {
    const navigate = useNavigate();
    const [promotion, setPromotion] = useState(null);

    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/san-pham-khuyen-mai/san-pham-ct/${product.id}`,
                );

                if (response.data.length > 0) {
                    setPromotion(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching promotion:', error);
            }
        };

        fetchPromotion();
    }, [product.id]);

    const handleProductClick = () => {
        navigate(`/san-pham/san-pham-ct/${product.id}`);
    };

    // Thêm kiểm tra null
    if (!product) return null;

    // Tìm ảnh có chứa từ "main" trong URL
    const mainImage = product.hinhAnhUrls?.find((url) => url.includes('main')) || product.hinhAnhUrls?.[0];

    return (
        <div className="flex flex-wrap">
            <div className="productCard w-[195px] m-3 transition-all cursor-pointer relative">
                {/* Sale badge */}
                {promotion && (
                    <div className="absolute  text-white px-2 py-1 rounded-full text-xs z-10">
                        <p className="text-green-600 font-semibold text-sm">
                            {/* Thêm kiểm tra null */}
                            {Math.round((1 - (promotion.giaKhuyenMai || 0) / (product.donGia || 0)) * 100)}% off
                        </p>
                    </div>
                )}

                <div className="h-[15rem]" onClick={handleProductClick}>
                    <img className="w-full h-full object-cover" src={mainImage} alt={product.sanPhamTen || 'Product'} />
                </div>

                <div className="textPart bg-white p-3">
                    <div>
                        <p className="font-bold opacity-60" style={{ fontSize: '13px' }}>
                            {product.sanPhamTen || 'Unnamed Product'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {promotion ? (
                            <>
                                <p className="font-bold text-red-500 text-sm">
                                    {(promotion.giaKhuyenMai || 0).toLocaleString()} ₫
                                </p>
                                <p className="line-through opacity-50 text-sm">
                                    {(product.donGia || 0).toLocaleString()} ₫
                                </p>
                            </>
                        ) : (
                            <p className="font-bold text-red-500 text-sm">{(product.donGia || 0).toLocaleString()} ₫</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
