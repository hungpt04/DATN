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
                        <p className="font-bold opacity-60">{product.sanPhamCT.sanPham.ten}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <p className="font-bold text-red-500">{product.sanPhamCT.donGia.toLocaleString()} ₫</p>
                        {/* Uncomment below if you have a sale price to show */}
                        {/* <p className="line-through opacity-50">4.229.000 ₫</p>
                            <p className="text-green-600 font-semibold">20% off</p> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
