import swal from 'sweetalert';
import { useState, useEffect, useContext } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { Radio, RadioGroup } from '@headlessui/react';
import axios from 'axios';
import classNames from 'classnames'; // Import classNames ở đây
import { useParams } from 'react-router-dom';
import { CartContext } from '../Cart/CartContext';
import ClipLoader from 'react-spinners/ClipLoader'; // Thêm react-spinners

export default function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true); // Sử dụng trạng thái loading
    const [error, setError] = useState(null);
    const { setCartItemCount } = useContext(CartContext);

    const { id } = useParams();

    const loadProductsWithImages = async (sanPhamId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/san-pham-ct/with-images/${sanPhamId}`);
            setProduct(response.data);
            setLoading(false); // Dừng loading khi dữ liệu được tải xong
        } catch (error) {
            console.error('Failed to fetch Products with images', error);
            setError(error.message);
            setLoading(false); // Dừng loading nếu có lỗi xảy ra
        }
    };

    useEffect(() => {
        loadProductsWithImages(id);
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader size={50} color={'#123abc'} loading={loading} />
            </div>
        );
    }

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-white">
            <div className="pt-6">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10">
                    {/* Image gallery */}
                    <div className="flex flex-col items-center h-[510px]">
                        <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]">
                            <img
                                alt={product.hinhAnhUrls[0]}
                                src={product.hinhAnhUrls[0]}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="flex flex-wrap space-x-5 justify-center">
                            {product.hinhAnhUrls.map((link, index) => (
                                <div
                                    key={index}
                                    className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-w-[5rem] max-h-[10rem] mt-4"
                                >
                                    <img
                                        alt={`Image ${index}`}
                                        src={link}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="lg:col-span-1 maxt-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24">
                        <div className="lg:col-span-2">
                            <h1 className="text-[25px] lg:text-[29px] font-semibold text-gray-900">
                                {product.sanPhamTen}
                            </h1>
                            <div className="flex justify-between text-sm">
                                <p>
                                    Mã: <span className="text-[#2f19ae]">{product.sanPhamMa}</span>
                                </p>
                                <p>
                                    Thương hiệu: <span className="text-[#2f19ae]">{product.thuongHieuTen}</span>
                                </p>
                                <p>
                                    Tình trạng:{' '}
                                    <span className="text-[#2f19ae]">
                                        {product.soLuong > 0 ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mt-4 lg:row-span-3 lg:mt-0">
                            <h2 className="sr-only">Product information</h2>
                            <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900 mt-6">
                                <p className="font-semibold text-red-600">{product.donGia.toLocaleString()} ₫</p>
                                <p className="opacity-50 line-through ">Giá cũ: 3,972,000 ₫</p>
                                <p className="text-green-600 font-semibold">7% Off</p>
                            </div>

                            {/* Reviews */}
                            <div className="mt-6">
                                <h3 className="sr-only">Reviews</h3>
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                aria-hidden="true"
                                                className={classNames(
                                                    4 > rating ? 'text-gray-900' : 'text-gray-200',
                                                    'h-5 w-5 flex-shrink-0',
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="sr-only">4 out of 5 stars</p>
                                    <a
                                        href="blabla"
                                        className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        100 reviews
                                    </a>
                                </div>
                            </div>

                            <form className="mt-10">
                                {/* Options */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Màu sắc</h3>

                                    <fieldset aria-label="Chọn màu" className="mt-4">
                                        <RadioGroup className="flex items-center space-x-3">
                                            <Radio value={product.mauSacTen} className="cursor-pointer">
                                                <span
                                                    className="h-8 w-8 rounded-full border border-black border-opacity-10"
                                                    style={{ backgroundColor: product.mauSacTen, display: 'block' }}
                                                />
                                            </Radio>
                                        </RadioGroup>
                                    </fieldset>
                                </div>

                                {/* Sizes */}
                                <div className="mt-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Kích cỡ</h3>
                                    </div>

                                    <fieldset aria-label="Chọn kích cỡ" className="mt-4">
                                        <RadioGroup className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                                            {[{ name: product.trongLuongTen, inStock: true }].map((size) => (
                                                <Radio
                                                    key={size.name}
                                                    value={size.name}
                                                    disabled={!size.inStock}
                                                    className={classNames(
                                                        size.inStock
                                                            ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                                            : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                        'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                                                    )}
                                                >
                                                    <span>{size.name}</span>
                                                    {size.inStock ? (
                                                        <span
                                                            aria-hidden="true"
                                                            className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
                                                        />
                                                    ) : (
                                                        <span
                                                            aria-hidden="true"
                                                            className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                                        >
                                                            <svg
                                                                stroke="currentColor"
                                                                viewBox="0 0 100 100"
                                                                preserveAspectRatio="none"
                                                                className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                                            >
                                                                <line
                                                                    x1={0}
                                                                    x2={100}
                                                                    y1={100}
                                                                    y2={0}
                                                                    vectorEffect="non-scaling-stroke"
                                                                />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </Radio>
                                            ))}
                                        </RadioGroup>
                                    </fieldset>
                                </div>

                                <button
                                    type="button"
                                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
