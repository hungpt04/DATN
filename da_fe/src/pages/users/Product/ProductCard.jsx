import './ProductCard.css';

function ProductCard({ product }) {
    return (
        <div className="flex flex-wrap">
            <div className="productCard w-[195px] m-3 transition-all cursor-pointer">
                <div className="h-[15rem]">
                    <img
                        className="w-full h-full object-cover"
                        src={product.link}
                        alt={product.sanPhamCT.sanPham.ten}
                    />
                </div>

                <div className="textPart bg-white p-3">
                    <div>
                        {/* Chỉnh kích thước font của tên sản phẩm */}
                        <p className="font-bold opacity-60" style={{ fontSize: '13px' }}>
                            {product.sanPhamCT.sanPham.ten}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Chỉnh kích thước font của giá sản phẩm */}
                        <p className="font-bold text-red-500 text-sm">{product.sanPhamCT.donGia.toLocaleString()} ₫</p>
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
