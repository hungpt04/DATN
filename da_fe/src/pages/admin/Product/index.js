import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { useForm } from 'react-hook-form';

function Product() {
    const [products, setProducts] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 4;

    const [showImageModal, setShowImageModal] = useState(false);
    const [imageList, setImageList] = useState([]);

    const handleAddImage = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => URL.createObjectURL(file));
        setImageList((prev) => [...prev, ...newImages]);
    };

    const handleSelectImage = (image) => {
        if (selectedImages.includes(image)) {
            setSelectedImages(selectedImages.filter((img) => img !== image));
        } else {
            if (selectedImages.length + currentImages.length < 5) {
                setSelectedImages([...selectedImages, image]);
            } else {
                swal('Cảnh báo', 'Chỉ được chọn tối đa 5 ảnh', 'warning');
            }
        }
    };

    const handleSaveImages = () => {
        setShowImageModal(false);
    };

    // Form handling
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm();

    // Modal states
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [showStiffModal, setShowStiffModal] = useState(false);

    // Data states
    const [brands, setBrands] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [balances, setBalances] = useState([]);
    const [stiffs, setStiffs] = useState([]);

    const [colors, setColors] = useState([]);
    const [weights, setWeights] = useState([]);

    const [showColorModal, setShowColorModal] = useState(false);
    const [selectedColors, setSelectedColors] = useState([]);

    const [showWeightModal, setShowWeightModal] = useState(false);
    const [selectedWeights, setSelectedWeights] = useState([]);

    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const validImageFiles = files.filter((file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type));

        if (validImageFiles.length + currentImages.length > 5) {
            swal('Cảnh báo', 'Chỉ được chọn tối đa 5 ảnh', 'warning');
            return;
        }

        const newPreviewImages = validImageFiles.map((file) => URL.createObjectURL(file));

        setSelectedImages([...selectedImages, ...validImageFiles]);
        setPreviewImages([...previewImages, ...newPreviewImages]);
    };

    const removeImage = (index, isPreview = true) => {
        if (isPreview) {
            const newPreviewImages = [...previewImages];
            const newSelectedImages = [...selectedImages];

            newPreviewImages.splice(index, 1);
            newSelectedImages.splice(index, 1);

            setPreviewImages(newPreviewImages);
            setSelectedImages(newSelectedImages);
        } else {
            // Xóa ảnh hiện tại
            const newCurrentImages = [...currentImages];
            newCurrentImages.splice(index, 1);
            setCurrentImages(newCurrentImages);
        }
    };

    const handleColorModal = () => {
        setShowColorModal(true);
    };

    const handleWeightModal = () => {
        setShowWeightModal(true);
    };

    const loadColors = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/mau-sac');
            setColors(response.data);
        } catch (error) {
            console.error('Failed to fetch Colors', error);
        }
    };

    const loadWeights = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/trong-luong');
            setWeights(response.data);
        } catch (error) {
            console.error('Failed to fetch Weights', error);
        }
    };

    const loadProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/san-pham-ct'); // Lấy dữ liệu từ API
            const productsData = response.data;

            // Tính số lượng biến thể cho mỗi sản phẩm
            const productCounts = productsData.reduce((acc, product) => {
                const productId = product.sanPham.id;
                if (!acc[productId]) {
                    acc[productId] = { count: 0, product: product.sanPham };
                }
                acc[productId].count += 1;
                return acc;
            }, {});

            // Chuyển đổi kết quả thành mảng
            const productsWithCounts = Object.values(productCounts).map((item) => ({
                ...item.product,
                soLuongBienThe: item.count, // Thêm số lượng biến thể vào sản phẩm
            }));

            setProducts(productsWithCounts);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const loadBrands = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/thuong-hieu');
            setBrands(response.data);
        } catch (error) {
            console.error('Failed to fetch brands', error);
        }
    };

    const loadMaterials = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/chat-lieu');
            setMaterials(response.data);
        } catch (error) {
            console.error('Failed to fetch Material', error);
        }
    };

    const loadBalances = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/diem-can-bang');
            setBalances(response.data);
        } catch (error) {
            console.error('Failed to fetch balances', error);
        }
    };

    const loadStiffs = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/do-cung');
            setStiffs(response.data);
        } catch (error) {
            console.error('Failed to fetch stiffs', error);
        }
    };

    useEffect(() => {
        loadProducts();
        loadBrands();
        loadMaterials();
        loadBalances();
        loadStiffs();
        loadColors();
        loadWeights();
    }, []);

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setSelectedProduct(null);
        reset();
    };

    // Get current products based on pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calculate total pages
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Pagination controls
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Modal handlers

    const handleAddMaterialModal = () => {
        reset();
        setShowMaterialModal(true);
    };

    const handleAddBalanceModal = () => {
        reset();
        setShowBalanceModal(true);
    };

    const handleAddStiffModal = () => {
        reset();
        setShowStiffModal(true);
    };

    const handleUpdateProduct = async (formData) => {
        try {
            // Tạo FormData để upload nhiều file
            const formDataUpload = new FormData();

            // Thêm các file ảnh mới
            selectedImages.forEach((file) => {
                formDataUpload.append('images', file);
            });

            // Upload ảnh và nhận về URL
            let uploadedImageUrls = [];
            if (selectedImages.length > 0) {
                const uploadResponse = await axios.post('http://localhost:8080/api/upload-images', formDataUpload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                uploadedImageUrls = uploadResponse.data;
            }

            // Kết hợp URL ảnh cũ và mới
            const finalImageUrls = [...currentImages, ...uploadedImageUrls];

            const updatedProduct = {
                id: selectedProduct.id,
                soLuong: formData.quantity || selectedProduct.soLuong,
                donGia: formData.price || selectedProduct.donGia,
                trangThai: formData.status === 'Active' ? 1 : 0,
                sanPham: {
                    id: selectedProduct.sanPham.id,
                    ten: formData.productName,
                    hinhAnh: finalImageUrls, // Danh sách URL ảnh
                },
                thuongHieu: { id: parseInt(formData.brand) },
                chatLieu: { id: parseInt(formData.material) },
                diemCanBang: { id: parseInt(formData.balancePoint) },
                doCung: { id: parseInt(formData.hardness) },
                mauSac: {
                    id: colors.find((c) => c.ten === selectedColors[0])?.id || 1,
                },
                trongLuong: {
                    id: weights.find((w) => w.ten === selectedWeights[0])?.id || 1,
                },
                moTa: formData.description,
            };

            const response = await axios.put(
                `http://localhost:8080/api/san-pham-ct/${selectedProduct.id}`,
                updatedProduct,
            );

            if (response.status === 200) {
                swal({
                    title: 'Thành công!',
                    text: 'Sản phẩm đã được cập nhật thành công!',
                    button: 'Đóng',
                });
                loadProducts();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Failed to update product:', error);
            swal({
                title: 'Thất bại!',
                text: 'Có lỗi xảy ra khi cập nhật sản phẩm!',
                icon: 'error',
                button: 'Đóng',
            });
        }
    };

    const handleUpdateClick = (product) => {
        console.log('Selected Product:', product); // Log sản phẩm để kiểm tra cấu trúc
        setSelectedProduct(product);
        setShowUpdateModal(true);

        // Reset các state ảnh
        setSelectedImages([]);
        setPreviewImages([]);

        // Load ảnh hiện tại
        const productImages = product.sanPham?.hinhAnh || []; // Kiểm tra đường dẫn đúng
        setCurrentImages(productImages);

        // Các logic set giá trị form khác...
        reset();
        setValue('productName', product.sanPham.ten);
        setValue('brand', product.thuongHieu?.id);
        setValue('material', product.chatLieu?.id);
        setValue('balancePoint', product.diemCanBang?.id);
        setValue('hardness', product.doCung?.id);
        setValue('status', product.trangThai ? 'Active' : 'Inactive');
        setValue('description', product.moTa);
        setValue('price', product.donGia);
        setValue('quantity', product.soLuong);

        // Load và set màu sắc
        if (product.mauSac) {
            setSelectedColors([product.mauSac.ten]);
        } else {
            setSelectedColors([]);
        }

        // Load và set trọng lượng
        if (product.trongLuong) {
            setSelectedWeights([product.trongLuong.ten]);
        } else {
            setSelectedWeights([]);
        }
    };

    // Add handlers

    return (
        <div>
            <h1 className="text-center text-5xl font-bold text-gray-800">Danh sách sản phẩm</h1>
            <div>
                <div className="flex justify-end mb-4">
                    <Link to={'/admin/quan-ly-san-pham/san-pham-ct/add'}>
                        <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium py-2 px-4 rounded">
                            <AddIcon />
                        </button>
                    </Link>
                </div>
                <table className="w-full table-auto bg-white rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="py-4 px-6 text-left">STT</th>
                            <th className="py-4 px-6 text-left">Tên</th>
                            <th className="py-4 px-6 text-left">Số lượng</th>
                            <th className="py-4 px-6 text-left">Trạng thái</th>
                            <th className="py-4 px-6 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product, index) => (
                            <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-100">
                                <td className="py-4 px-6">{indexOfFirstProduct + index + 1}</td>
                                <td className="py-4 px-6">{product.ten}</td>
                                <td className="py-4 px-6">{product.soLuongBienThe || 0}</td>
                                <td className="py-4 px-6">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                            product.trangThai
                                ? 'text-red-600 bg-red-100 border border-red-600'
                                :  'text-green-600 bg-green-100 border border-green-600'
                        }`}
                                    >
                                        {product.trangThai ? 'Inactive' : 'Active'}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <Link to={`/admin/quan-ly-san-pham/san-pham-ct/${product.id}/variants`}>
                                        <button className="hover:bg-gray-400 font-medium py-2 px-4 rounded">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border border-gray-400 rounded-l-lg p-2 hover:bg-gray-200"
                >
                    <SkipPreviousIcon />
                </button>
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`border-t border-b border-gray-400 px-4 py-2 ${
                            index + 1 === currentPage ? 'bg-gray-200' : ''
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border border-gray-400 rounded-r-lg p-2 hover:bg-gray-200"
                >
                    <SkipNextIcon />
                </button>
            </div>

            {showImageModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
                        <h3 className="text-lg font-bold mb-4">Chọn ảnh</h3>
                        <input type="file" multiple accept="image/jpeg,image/png,image/gif" onChange={handleAddImage} />
                        <div className="mt-4 grid grid-cols-4 gap-2">
                            {imageList.map((image, index) => (
                                <div key={index} className="relative">
                                    <input
                                        type="checkbox"
                                        checked={selectedImages.includes(image)}
                                        onChange={() => handleSelectImage(image)}
                                        className="absolute top-1 left-1 z-10"
                                    />
                                    <img src={image} alt="preview" className="w-full h-24 object-cover rounded" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowImageModal(false);
                                    setImageList([]);
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleSaveImages}
                                type="button"
                                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                            >
                                Lưu ảnh
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Product;
