// import swal from 'sweetalert';
// import { useState, useEffect, useContext } from 'react';
// import { StarIcon } from '@heroicons/react/20/solid';
// import { Radio, RadioGroup } from '@headlessui/react';
// import axios from 'axios';
// import classNames from 'classnames';
// import { useParams } from 'react-router-dom';
// import { CartContext } from '../Cart/CartContext';
// import { Button, IconButton } from '@mui/material';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// export default function ProductDetail() {
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedColor, setSelectedColor] = useState(null);
//     const [selectedWeight, setSelectedWeight] = useState(null);
//     const { setCartItemCount } = useContext(CartContext);

//     const [currentPrice, setCurrentPrice] = useState(null);

//     const [quantity, setQuantity] = useState(1);

//     const [currentImages, setCurrentImages] = useState([]);

//     const { id } = useParams();

//     // Thêm state để lưu thông tin khuyến mãi
//     const [promotion, setPromotion] = useState(null);

//     // Thêm useEffect để lấy thông tin khuyến mãi
//     useEffect(() => {
//         const fetchPromotion = async () => {
//             try {
//                 if (product && selectedColor && selectedWeight) {
//                     const selectedVariant = product.variants.find(
//                         (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
//                     );
//                     console.log('Se lech tut variant', selectedVariant.donGia);

//                     if (selectedVariant) {
//                         const response = await axios.get(
//                             `http://localhost:8080/api/san-pham-khuyen-mai/san-pham-ct/${selectedVariant.id}`,
//                         );

//                         if (response.data.length > 0) {
//                             setPromotion(response.data[0]);
//                         } else {
//                             setPromotion(null);
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching promotion:', error);
//                 setPromotion(null);
//             }
//         };

//         fetchPromotion();
//     }, [product, selectedColor, selectedWeight]);

//     // Lấy id người dùng
//     const [customerId, setCustomerId] = useState(null);
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             const fetchUserInfo = async () => {
//                 try {
//                     const response = await axios.get('http://localhost:8080/api/tai-khoan/my-info', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });

//                     // Lưu ID người dùng
//                     const userId = response.data.id; // Trong trường hợp này là 11
//                     console.log('User ID:', userId);
//                     setCustomerId(userId);
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                 }
//             };
//             fetchUserInfo();
//         }
//     }, []);

//     useEffect(() => {
//         if (product && selectedColor && selectedWeight) {
//             const selectedVariant = product.variants.find(
//                 (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
//             );

//             if (selectedVariant) {
//                 setCurrentPrice(selectedVariant.donGia);
//                 setQuantity(1);

//                 // Lấy hình ảnh của biến thể được chọn
//                 const variantImages = product.variants
//                     .filter((v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight)
//                     .flatMap((v) => v.hinhAnhUrls);

//                 setCurrentImages(variantImages.length > 0 ? variantImages : product.hinhAnhUrls);
//             }
//         }
//     }, [selectedColor, selectedWeight, product]);

//     const handleIncrease = () => {
//         const selectedVariant = product.variants.find(
//             (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
//         );
//         if (selectedVariant && quantity < selectedVariant.soLuong) {
//             setQuantity(quantity + 1);
//         }
//     };

//     const handleDecrease = () => {
//         if (quantity > 1) {
//             setQuantity(quantity - 1);
//         }
//     };

//     const loadProductsWithImages = async (sanPhamId) => {
//         try {
//             const response = await axios.get(`http://localhost:8080/api/san-pham-ct/with-images/${sanPhamId}`);
//             const productData = response.data;

//             // Get all products with same name
//             const allProductsResponse = await axios.get('http://localhost:8080/api/san-pham-ct/with-images');
//             const allProducts = allProductsResponse.data;

//             const sameNameProducts = allProducts.filter((p) => p.sanPhamTen === productData.sanPhamTen);

//             // Get unique colors and weights
//             const colors = [...new Set(sameNameProducts.map((p) => p.mauSacTen))];
//             const weights = [...new Set(sameNameProducts.map((p) => p.trongLuongTen))];

//             // Merge data
//             const mergedProduct = {
//                 ...productData,
//                 colors: colors,
//                 weights: weights,
//                 variants: sameNameProducts,
//             };

//             setProduct(mergedProduct);
//             setSelectedColor(productData.mauSacTen);
//             setSelectedWeight(productData.trongLuongTen);
//             // Đặt giá ban đầu là giá của biến thể đầu tiên
//             const initialVariant = sameNameProducts.find(
//                 (p) => p.mauSacTen === productData.mauSacTen && p.trongLuongTen === productData.trongLuongTen,
//             );
//             setCurrentPrice(initialVariant ? initialVariant.donGia : productData.donGia);
//             setLoading(false);
//         } catch (error) {
//             console.error('Failed to fetch Products with images', error);
//             setError(error.message);
//             setLoading(false);
//         }
//     };

//     const handleAddCart = async (values) => {
//         // Find the correct variant based on selected color and weight
//         const selectedVariant = product.variants.find(
//             (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
//         );

//         if (!selectedVariant) {
//             swal('Thất bại!', 'Vui lòng chọn màu sắc và trọng lượng!', 'error');
//             return;
//         }

//         if (quantity > selectedVariant.soLuong) {
//             swal('Thất bại!', 'Số lượng vượt quá số lượng trong kho!', 'error');
//             return;
//         }

//         // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
//         try {
//             const response = await axios.get('http://localhost:8080/api/gio-hang'); // Lấy giỏ hàng hiện tại
//             const cartItems = response.data;

//             // Xác định giá để thêm vào giỏ hàng
//             const priceToAdd = promotion ? promotion.giaKhuyenMai : selectedVariant.donGia;

//             const existingItem = cartItems.find(
//                 (item) => item.sanPhamCT.id === selectedVariant.id && item.taiKhoan.id === values.taiKhoanId,
//             );

//             if (existingItem) {
//                 // Nếu sản phẩm đã tồn tại, cập nhật số lượng
//                 const updatedCartItem = {
//                     ...existingItem,
//                     soLuong: existingItem.soLuong + quantity,
//                     donGia: priceToAdd, // Cập nhật giá mới
//                 };

//                 await axios.put(`http://localhost:8080/api/gio-hang/${existingItem.id}`, updatedCartItem);
//                 swal('Thành công!', 'Số lượng sản phẩm đã được cập nhật trong giỏ hàng!', 'success');
//             } else {
//                 // Nếu sản phẩm chưa tồn tại, thêm mới
//                 const newCart = {
//                     sanPhamCT: {
//                         id: selectedVariant.id,
//                     },
//                     taiKhoan: {
//                         id: values.taiKhoanId,
//                     },
//                     soLuong: quantity,
//                     donGia: priceToAdd, // Thêm giá mới
//                     trangThai: values.trangThai === '1' ? 1 : 0,
//                     ngayTao: new Date(),
//                     ngaySua: new Date(),
//                 };

//                 await axios.post('http://localhost:8080/api/gio-hang', newCart);
//                 swal('Thành công!', 'Giỏ hàng đã được thêm!', 'success');
//             }

//             setCartItemCount((prevCount) => prevCount + quantity); // Cập nhật số lượng sản phẩm trong giỏ hàng
//         } catch (error) {
//             console.error('Có lỗi xảy ra khi thêm Giỏ hàng!', error);
//             swal('Thất bại!', 'Có lỗi xảy ra khi thêm Giỏ hàng!', 'error');
//         }
//     };

//     useEffect(() => {
//         loadProductsWithImages(id);
//     }, [id]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div className="bg-white">
//             <div className="pt-6">
//                 <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10">
//                     {/* Image gallery */}
//                     <div className="flex flex-col items-center h-[510px]">
//                         <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]">
//                             <img
//                                 alt={currentImages[0]}
//                                 src={currentImages[0]}
//                                 className="h-full w-full object-cover object-center"
//                             />
//                         </div>
//                         <div className="flex flex-wrap space-x-5 justify-center">
//                             {currentImages.slice(1).map((link, index) => (
//                                 <div
//                                     key={index}
//                                     className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-w-[5rem] max-h-[10rem] mt-4"
//                                 >
//                                     <img
//                                         alt={`Image ${index}`}
//                                         src={link}
//                                         className="h-full w-full object-cover object-center"
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Product info */}
//                     <div className="lg:col-span-1 maxt-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24">
//                         <div className="lg:col-span-2">
//                             <h1 className="text-[25px] lg:text-[29px] font-semibold text-gray-900">
//                                 {product.sanPhamTen}
//                             </h1>
//                             <div className="flex justify-between text-sm">
//                                 <p>
//                                     Thương hiệu: <span className="text-[#2f19ae]">{product.thuongHieuTen}</span>
//                                 </p>
//                                 <p>
//                                     Tình trạng:{' '}
//                                     <span className="text-[#2f19ae]">
//                                         {product.soLuong > 0 ? 'Còn hàng' : 'Hết hàng'}
//                                     </span>
//                                 </p>
//                                 <p>
//                                     Số lượng trong kho:{' '}
//                                     <span className="text-[#2f19ae]">
//                                         {product.variants.find(
//                                             (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
//                                         )?.soLuong || 0}
//                                     </span>
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Price */}
//                         <div className="mt-4 lg:row-span-3 lg:mt-0">
//                             <h2 className="sr-only">Product information</h2>
//                             <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900 mt-6">
//                                 {promotion ? (
//                                     <>
//                                         <p className="font-semibold text-red-600">
//                                             {promotion.giaKhuyenMai.toLocaleString()} ₫
//                                         </p>
//                                         <p className="line-through text-gray-500">{currentPrice.toLocaleString()} ₫</p>
//                                         <p className="text-green-600 font-semibold">
//                                             -{Math.round((1 - promotion.giaKhuyenMai / currentPrice) * 100)}%
//                                         </p>
//                                     </>
//                                 ) : (
//                                     <p className="font-semibold text-red-600">
//                                         {currentPrice ? currentPrice.toLocaleString() : product.donGia.toLocaleString()}{' '}
//                                         ₫
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Reviews */}
//                             <div className="mt-6">
//                                 <h3 className="sr-only">Reviews</h3>
//                                 <div className="flex items-center">
//                                     <div className="flex items-center">
//                                         {[0, 1, 2, 3, 4].map((rating) => (
//                                             <StarIcon
//                                                 key={rating}
//                                                 aria-hidden="true"
//                                                 className={classNames(
//                                                     4 > rating ? 'text-gray-900' : 'text-gray-200',
//                                                     'h-5 w-5 flex-shrink-0',
//                                                 )}
//                                             />
//                                         ))}
//                                     </div>
//                                     <p className="sr-only">4 out of 5 stars</p>
//                                     <a
//                                         href="blabla"
//                                         className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
//                                     >
//                                         100 reviews
//                                     </a>
//                                 </div>
//                             </div>

//                             <form className="mt-10">
//                                 {/* Colors */}
//                                 <div>
//                                     <h3 className="text-sm font-medium text-gray-900">Màu sắc</h3>

//                                     <fieldset aria-label="Chọn màu" className="mt-4">
//                                         <RadioGroup
//                                             value={selectedColor}
//                                             onChange={setSelectedColor}
//                                             className="flex items-center space-x-3"
//                                         >
//                                             {product.colors.map((color) => {
//                                                 const variant = product.variants.find(
//                                                     (v) => v.mauSacTen === color && v.trongLuongTen === selectedWeight,
//                                                 );
//                                                 const inStock = variant && variant.soLuong > 0;

//                                                 return (
//                                                     <Radio
//                                                         key={color}
//                                                         value={color}
//                                                         disabled={!inStock}
//                                                         className={classNames(
//                                                             inStock
//                                                                 ? 'cursor-pointer'
//                                                                 : 'cursor-not-allowed opacity-50',
//                                                             'group relative flex items-center justify-center rounded-full',
//                                                         )}
//                                                     >
//                                                         <span
//                                                             className={classNames(
//                                                                 'h-8 w-8 rounded-full border',
//                                                                 inStock
//                                                                     ? 'border-black border-opacity-20 group-data-[checked]:border-indigo-500 group-data-[checked]:border-4'
//                                                                     : 'border-gray-200 line-through',
//                                                             )}
//                                                             style={{
//                                                                 backgroundColor: color,
//                                                                 display: 'block',
//                                                                 position: 'relative',
//                                                             }}
//                                                         >
//                                                             {!inStock && (
//                                                                 <svg
//                                                                     stroke="currentColor"
//                                                                     viewBox="0 0 100 100"
//                                                                     preserveAspectRatio="none"
//                                                                     className="absolute inset-0 h-full w-full stroke-2 text-gray-400"
//                                                                 >
//                                                                     <line
//                                                                         x1={0}
//                                                                         x2={100}
//                                                                         y1={100}
//                                                                         y2={0}
//                                                                         vectorEffect="non-scaling-stroke"
//                                                                     />
//                                                                 </svg>
//                                                             )}
//                                                         </span>
//                                                     </Radio>
//                                                 );
//                                             })}
//                                         </RadioGroup>
//                                     </fieldset>
//                                 </div>

//                                 {/* Weights */}
//                                 <div className="mt-10">
//                                     <div className="flex items-center justify-between">
//                                         <h3 className="text-sm font-medium text-gray-900">Trọng lượng</h3>
//                                     </div>

//                                     <fieldset aria-label="Chọn trọng lượng" className="mt-4">
//                                         <RadioGroup
//                                             value={selectedWeight}
//                                             onChange={setSelectedWeight}
//                                             className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
//                                         >
//                                             {product.weights.map((weight) => {
//                                                 const variant = product.variants.find(
//                                                     (v) => v.mauSacTen === selectedColor && v.trongLuongTen === weight,
//                                                 );
//                                                 const inStock = variant && variant.soLuong > 0;

//                                                 return (
//                                                     <Radio
//                                                         key={weight}
//                                                         value={weight}
//                                                         disabled={!inStock}
//                                                         className={classNames(
//                                                             inStock
//                                                                 ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
//                                                                 : 'cursor-not-allowed bg-gray-50 text-gray-200',
//                                                             'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
//                                                         )}
//                                                     >
//                                                         <span>{weight}</span>
//                                                         {inStock ? (
//                                                             <span
//                                                                 aria-hidden="true"
//                                                                 className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
//                                                             />
//                                                         ) : (
//                                                             <span
//                                                                 aria-hidden="true"
//                                                                 className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
//                                                             >
//                                                                 <svg
//                                                                     stroke="currentColor"
//                                                                     viewBox="0 0 100 100"
//                                                                     preserveAspectRatio="none"
//                                                                     className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
//                                                                 >
//                                                                     <line
//                                                                         x1={0}
//                                                                         x2={100}
//                                                                         y1={100}
//                                                                         y2={0}
//                                                                         vectorEffect="non-scaling-stroke"
//                                                                     />
//                                                                 </svg>
//                                                             </span>
//                                                         )}
//                                                     </Radio>
//                                                 );
//                                             })}
//                                         </RadioGroup>
//                                     </fieldset>
//                                 </div>

//                                 <div className="flex items-center space-x-2 mt-5">
//                                     <IconButton sx={{ color: '#2f19ae' }} aria-label="remove" onClick={handleDecrease}>
//                                         <RemoveCircleOutlineIcon />
//                                     </IconButton>
//                                     <input
//                                         className="py-1 px-1 border rounded-sm w-16"
//                                         value={quantity}
//                                         onChange={(e) => setQuantity(Number(e.target.value))}
//                                         min="1"
//                                     />
//                                     <IconButton sx={{ color: '#2f19ae' }} aria-label="add" onClick={handleIncrease}>
//                                         <AddCircleOutlineIcon />
//                                     </IconButton>
//                                 </div>

//                                 <button
//                                     type="button"
//                                     className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                                     onClick={() => {
//                                         handleAddCart({
//                                             taiKhoanId: customerId,
//                                             soLuong: quantity,
//                                             trangThai: 1,
//                                         });
//                                     }}
//                                 >
//                                     THÊM VÀO GIỎ HÀNG
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// }


import swal from 'sweetalert';
import { useState, useEffect, useContext } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { Radio, RadioGroup } from '@headlessui/react';
import axios from 'axios';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { CartContext } from '../Cart/CartContext';
import { Button, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedWeight, setSelectedWeight] = useState(null);
    const { setCartItemCount } = useContext(CartContext);

    const [currentPrice, setCurrentPrice] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [currentImages, setCurrentImages] = useState([]);

    const { id } = useParams();

    // Thêm state để lưu thông tin khuyến mãi
    const [promotion, setPromotion] = useState(null);

    // Thêm useEffect để lấy thông tin khuyến mãi
    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                if (product && selectedColor && selectedWeight) {
                    const selectedVariant = product.variants.find(
                        (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
                    );
                    console.log('Se lech tut variant', selectedVariant.donGia);

                    if (selectedVariant) {
                        const response = await axios.get(
                            `http://localhost:8080/api/san-pham-khuyen-mai/san-pham/${selectedVariant.id}`,
                        );

                        if (response.data.length > 0) {
                            const fetchedPromotion = response.data[0];
                            // Kiểm tra trạng thái khuyến mãi
                            if (
                                fetchedPromotion.khuyenMai.trangThai !== 2 &&
                                fetchedPromotion.khuyenMai.trangThai !== 0
                            ) {
                                setPromotion(fetchedPromotion);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching promotion:', error);
                setPromotion(null);
            }
        };

        fetchPromotion();
    }, [product, selectedColor, selectedWeight]);

    // Lấy id người dùng
    const [customerId, setCustomerId] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/tai-khoan/my-info', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    // Lưu ID người dùng
                    const userId = response.data.id; // Trong trường hợp này là 11
                    console.log('User ID:', userId);
                    setCustomerId(userId);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserInfo();
        }
    }, []);

    // useEffect(() => {
    //     if (product && selectedColor && selectedWeight) {
    //         const selectedVariant = product.variants.find(
    //             (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
    //         );

    //         if (selectedVariant) {
    //             setCurrentPrice(selectedVariant.donGia);
    //             setQuantity(1);

    //             // Lấy hình ảnh của biến thể được chọn
    //             const variantImages = product.variants
    //                 .filter((v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight)
    //                 .flatMap((v) => v.hinhAnhUrls);

    //             setCurrentImages(variantImages.length > 0 ? variantImages : product.hinhAnhUrls);
    //         }
    //     }
    // }, [selectedColor, selectedWeight, product]);

    useEffect(() => {
        if (product && selectedColor && selectedWeight) {
            const selectedVariant = product.variants.find(
                (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
            );

            if (selectedVariant) {
                setCurrentPrice(selectedVariant.donGia);
                setQuantity(1);

                // Lấy hình ảnh của biến thể được chọn
                const variantImages = product.variants
                    .filter((v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight)
                    .flatMap((v) => v.hinhAnhUrls);

                setCurrentImages(variantImages.length > 0 ? variantImages : product.hinhAnhUrls);

                // Cập nhật giá khuyến mãi
                const fetchPromotion = async () => {
                    try {
                        const response = await axios.get(
                            `http://localhost:8080/api/san-pham-khuyen-mai/san-pham/${selectedVariant.id}`,
                        );

                        if (response.data.length > 0) {
                            const fetchedPromotion = response.data[0];
                            // Kiểm tra trạng thái khuyến mãi
                            if (
                                fetchedPromotion.khuyenMai.trangThai !== 2 &&
                                fetchedPromotion.khuyenMai.trangThai !== 0
                            ) {
                                setPromotion(fetchedPromotion);
                            } else {
                                setPromotion(null); // Nếu không có khuyến mãi hợp lệ, đặt promotion là null
                            }
                        } else {
                            setPromotion(null); // Nếu không có khuyến mãi, đặt promotion là null
                        }
                    } catch (error) {
                        console.error('Error fetching promotion:', error);
                        setPromotion(null);
                    }
                };

                fetchPromotion();
            }
        }
    }, [selectedColor, selectedWeight, product]);

    const handleIncrease = () => {
        const selectedVariant = product.variants.find(
            (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
        );
        if (selectedVariant && quantity < selectedVariant.soLuong) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const loadProductsWithImages = async (sanPhamId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/san-pham-ct/with-images/${sanPhamId}`);
            const productData = response.data;

            // Get all products with same name
            const allProductsResponse = await axios.get('http://localhost:8080/api/san-pham-ct/with-images');
            const allProducts = allProductsResponse.data;

            const sameNameProducts = allProducts.filter((p) => p.sanPhamTen === productData.sanPhamTen);

            // Get unique colors and weights
            const colors = [...new Set(sameNameProducts.map((p) => p.mauSacTen))];
            const weights = [...new Set(sameNameProducts.map((p) => p.trongLuongTen))];

            // Merge data
            const mergedProduct = {
                ...productData,
                colors: colors,
                weights: weights,
                variants: sameNameProducts,
            };

            setProduct(mergedProduct);
            setSelectedColor(productData.mauSacTen);
            setSelectedWeight(productData.trongLuongTen);
            // Đặt giá ban đầu là giá của biến thể đầu tiên
            const initialVariant = sameNameProducts.find(
                (p) => p.mauSacTen === productData.mauSacTen && p.trongLuongTen === productData.trongLuongTen,
            );
            setCurrentPrice(initialVariant ? initialVariant.donGia : productData.donGia);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch Products with images', error);
            setError(error.message);
            setLoading(false);
        }
    };

    // const handleAddCart = async (values) => {
    //     // Find the correct variant based on selected color and weight
    //     const selectedVariant = product.variants.find(
    //         (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
    //     );

    //     if (!selectedVariant) {
    //         swal('Thất bại!', 'Vui lòng chọn màu sắc và trọng lượng!', 'error');
    //         return;
    //     }

    //     if (quantity > selectedVariant.soLuong) {
    //         swal('Thất bại!', 'Số lượng vượt quá số lượng trong kho!', 'error');
    //         return;
    //     }

    //     // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/gio-hang'); // Lấy giỏ hàng hiện tại
    //         const cartItems = response.data;

    //         // Xác định giá để thêm vào giỏ hàng
    //         const priceToAdd = promotion ? promotion.giaKhuyenMai : selectedVariant.donGia;

    //         const existingItem = cartItems.find(
    //             (item) => item.sanPhamCT.id === selectedVariant.id && item.taiKhoan.id === values.taiKhoanId,
    //         );

    //         if (existingItem) {
    //             // Nếu sản phẩm đã tồn tại, cập nhật số lượng
    //             const updatedCartItem = {
    //                 ...existingItem,
    //                 soLuong: existingItem.soLuong + quantity,
    //                 donGia: priceToAdd, // Cập nhật giá mới
    //             };

    //             await axios.put(`http://localhost:8080/api/gio-hang/${existingItem.id}`, updatedCartItem);
    //             swal('Thành công!', 'Số lượng sản phẩm đã được cập nhật trong giỏ hàng!', 'success');
    //         } else {
    //             // Nếu sản phẩm chưa tồn tại, thêm mới
    //             const newCart = {
    //                 sanPhamCT: {
    //                     id: selectedVariant.id,
    //                 },
    //                 taiKhoan: {
    //                     id: values.taiKhoanId,
    //                 },
    //                 soLuong: quantity,
    //                 donGia: priceToAdd, // Thêm giá mới
    //                 trangThai: values.trangThai === '1' ? 1 : 0,
    //                 ngayTao: new Date(),
    //                 ngaySua: new Date(),
    //             };

    //             await axios.post('http://localhost:8080/api/gio-hang', newCart);
    //             swal('Thành công!', 'Giỏ hàng đã được thêm!', 'success');
    //         }

    //         setCartItemCount((prevCount) => prevCount + quantity); // Cập nhật số lượng sản phẩm trong giỏ hàng
    //     } catch (error) {
    //         console.error('Có lỗi xảy ra khi thêm Giỏ hàng!', error);
    //         swal('Thất bại!', 'Có lỗi xảy ra khi thêm Giỏ hàng!', 'error');
    //     }
    // };

    const handleAddCart = async (values) => {
        // Find the correct variant based on selected color and weight
        const selectedVariant = product.variants.find(
            (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
        );

        if (!selectedVariant) {
            swal('Thất bại!', 'Vui lòng chọn màu sắc và trọng lượng!', 'error');
            return;
        }

        if (quantity > selectedVariant.soLuong) {
            swal('Thất bại!', 'Số lượng vượt quá số lượng trong kho!', 'error');
            return;
        }

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        try {
            const response = await axios.get('http://localhost:8080/api/gio-hang'); // Lấy giỏ hàng hiện tại
            const cartItems = response.data;

            // Xác định giá để thêm vào giỏ hàng
            const priceToAdd = promotion ? promotion.giaKhuyenMai : selectedVariant.donGia;

            const existingItem = cartItems.find(
                (item) => item.sanPhamCT.id === selectedVariant.id && item.taiKhoan.id === values.taiKhoanId,
            );

            if (existingItem) {
                // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                const updatedCartItem = {
                    ...existingItem,
                    soLuong: existingItem.soLuong + quantity,
                    donGia: priceToAdd, // Cập nhật giá mới
                };

                await axios.put(`http://localhost:8080/api/gio-hang/${existingItem.id}`, updatedCartItem);
                swal('Thành công!', 'Số lượng sản phẩm đã được cập nhật trong giỏ hàng!', 'success');
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm mới
                const newCart = {
                    sanPhamCT: {
                        id: selectedVariant.id,
                    },
                    taiKhoan: {
                        id: values.taiKhoanId,
                    },
                    soLuong: quantity,
                    donGia: priceToAdd, // Thêm giá mới
                    trangThai: values.trangThai === '1' ? 1 : 0,
                    ngayTao: new Date(),
                    ngaySua: new Date(),
                };

                await axios.post('http://localhost:8080/api/gio-hang', newCart);
                swal('Thành công!', 'Giỏ hàng đã được thêm!', 'success');
            }

            setCartItemCount((prevCount) => prevCount + quantity); // Cập nhật số lượng sản phẩm trong giỏ hàng
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm Giỏ hàng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm Giỏ hàng!', 'error');
        }
    };

    

    useEffect(() => {
        loadProductsWithImages(id);
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-white">
            <div className="pt-6">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10">
                    {/* Image gallery */}
                    <div className="flex flex-col items-center h-[510px]">
                        <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]">
                            <img
                                alt={currentImages[0]}
                                src={currentImages[0]}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="flex flex-wrap space-x-5 justify-center">
                            {currentImages.slice(1).map((link, index) => (
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
                                    Thương hiệu: <span className="text-[#2f19ae]">{product.thuongHieuTen}</span>
                                </p>
                                <p>
                                    Tình trạng:{' '}
                                    <span className="text-[#2f19ae]">
                                        {product.soLuong > 0 ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                </p>
                                <p>
                                    Số lượng trong kho:{' '}
                                    <span className="text-[#2f19ae]">
                                        {product.variants.find(
                                            (v) => v.mauSacTen === selectedColor && v.trongLuongTen === selectedWeight,
                                        )?.soLuong || 0}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mt-4 lg:row-span-3 lg:mt-0">
                            <h2 className="sr-only">Product information</h2>
                            <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900 mt-6">
                                {promotion ? (
                                    <>
                                        {/* <p className="font-semibold text-red-600">
                                            {(product.donGia * (1 - promotion.khuyenMai.giaTri / 100)).toLocaleString()}{' '}
                                            ₫
                                        </p> */}
                                        <p className="font-semibold text-red-600">
                                            {promotion
                                                ? (currentPrice * (1 - promotion.khuyenMai.giaTri / 100)).toLocaleString() + ' ₫'
                                                : currentPrice.toLocaleString() + ' ₫'}
                                        </p>
                                        <p className="line-through text-gray-500">{currentPrice.toLocaleString()} ₫</p>
                                        <p className="text-green-600 font-semibold">
                                            {promotion.khuyenMai.giaTri}% off
                                        </p>
                                    </>
                                ) : (
                                    <p className="font-semibold text-red-600">
                                        {currentPrice ? currentPrice.toLocaleString() : product.donGia.toLocaleString()}{' '}
                                        ₫
                                    </p>
                                )}
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
                                {/* Colors */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Màu sắc</h3>

                                    <fieldset aria-label="Chọn màu" className="mt-4">
                                        <RadioGroup
                                            value={selectedColor}
                                            onChange={setSelectedColor}
                                            className="flex items-center space-x-3"
                                        >
                                            {product.colors.map((color) => {
                                                const variant = product.variants.find(
                                                    (v) => v.mauSacTen === color && v.trongLuongTen === selectedWeight,
                                                );
                                                const inStock = variant && variant.soLuong > 0;

                                                return (
                                                    <Radio
                                                        key={color}
                                                        value={color}
                                                        disabled={!inStock}
                                                        className={classNames(
                                                            inStock
                                                                ? 'cursor-pointer'
                                                                : 'cursor-not-allowed opacity-50',
                                                            'group relative flex items-center justify-center rounded-full',
                                                        )}
                                                    >
                                                        <span
                                                            className={classNames(
                                                                'h-8 w-8 rounded-full border',
                                                                inStock
                                                                    ? 'border-black border-opacity-20 group-data-[checked]:border-indigo-500 group-data-[checked]:border-4'
                                                                    : 'border-gray-200 line-through',
                                                            )}
                                                            style={{
                                                                backgroundColor: color,
                                                                display: 'block',
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            {!inStock && (
                                                                <svg
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 100 100"
                                                                    preserveAspectRatio="none"
                                                                    className="absolute inset-0 h-full w-full stroke-2 text-gray-400"
                                                                >
                                                                    <line
                                                                        x1={0}
                                                                        x2={100}
                                                                        y1={100}
                                                                        y2={0}
                                                                        vectorEffect="non-scaling-stroke"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </span>
                                                    </Radio>
                                                );
                                            })}
                                        </RadioGroup>
                                    </fieldset>
                                </div>

                                {/* Weights */}
                                <div className="mt-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Trọng lượng</h3>
                                    </div>

                                    <fieldset aria-label="Chọn trọng lượng" className="mt-4">
                                        <RadioGroup
                                            value={selectedWeight}
                                            onChange={setSelectedWeight}
                                            className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                                        >
                                            {product.weights.map((weight) => {
                                                const variant = product.variants.find(
                                                    (v) => v.mauSacTen === selectedColor && v.trongLuongTen === weight,
                                                );
                                                const inStock = variant && variant.soLuong > 0;

                                                return (
                                                    <Radio
                                                        key={weight}
                                                        value={weight}
                                                        disabled={!inStock}
                                                        className={classNames(
                                                            inStock
                                                                ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                                                : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                            'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                                                        )}
                                                    >
                                                        <span>{weight}</span>
                                                        {inStock ? (
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
                                                );
                                            })}
                                        </RadioGroup>
                                    </fieldset>
                                </div>

                                <div className="flex items-center space-x-2 mt-5">
                                    <IconButton sx={{ color: '#2f19ae' }} aria-label="remove" onClick={handleDecrease}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                    <input
                                        className="py-1 px-1 border rounded-sm w-16"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        min="1"
                                    />
                                    <IconButton sx={{ color: '#2f19ae' }} aria-label="add" onClick={handleIncrease}>
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                </div>

                                <button
                                    type="button"
                                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={() => {
                                        handleAddCart({
                                            taiKhoanId: customerId,
                                            soLuong: quantity,
                                            trangThai: 1,
                                        });
                                    }}
                                >
                                    THÊM VÀO GIỎ HÀNG
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
