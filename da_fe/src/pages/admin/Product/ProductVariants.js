import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import AddIcon from '@mui/icons-material/Add';
import { TbEyeEdit } from 'react-icons/tb';

function ProductVariants() {
    const navigate = useNavigate();
    const { productId } = useParams(); // Lấy ID sản phẩm từ URL
    const [variants, setVariants] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);

    const [uploadImage, setUploadImage] = useState({});

    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedWeights, setSelectedWeights] = useState([]);

    const [colors, setColors] = useState([]);
    const [weights, setWeights] = useState([]);
    const [brands, setBrands] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [balances, setBalances] = useState([]);
    const [stiffs, setStiffs] = useState([]);

    // Modal states
    const [showColorModal, setShowColorModal] = useState(false);
    const [showWeightModal, setShowWeightModal] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [showStiffModal, setShowStiffModal] = useState(false);

    const [showAddColorModal, setShowAddColorModal] = useState(false);
    const [showAddWeightModal, setShowAddWeightModal] = useState(false);

    // States for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');
    const [weightFilter, setWeightFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');

    const handleAddWeightModal = () => {
        setShowAddWeightModal(true);
    };

    // Modal handlers
    const handleColorModal = () => {
        setShowColorModal(true);
    };

    const handleAddColorModal = () => {
        setShowAddColorModal(true);
    };

    const handleWeightModal = () => {
        setShowWeightModal(true);
    };

    const handleAddBrandModal = () => {
        setShowBrandModal(true);
    };

    const handleAddMaterialModal = () => {
        setShowMaterialModal(true);
    };

    const handleAddBalanceModal = () => {
        setShowBalanceModal(true);
    };

    const handleAddStiffModal = () => {
        setShowStiffModal(true);
    };

    const handleAddWeight = async (values) => {
        const newWeight = {
            ten: values.weightName,
            trangThai: values.status === '1' ? 1 : 0,
        };
        try {
            await axios.post('http://localhost:8080/api/trong-luong', newWeight);
            swal('Thành công!', 'Trọng lượng đã được thêm!', 'success');
            setShowAddWeightModal(false);
            loadWeights();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm Trọng lượng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm Trọng lượng!', 'error');
        }
    };

    const handleAddColor = async (values) => {
        const newColor = {
            ten: values.colorName,
            trangThai: values.status === '1' ? 1 : 0,
        };
        try {
            await axios.post('http://localhost:8080/api/mau-sac', newColor);
            swal('Thành công!', 'Màu sắc đã được thêm!', 'success');
            setShowAddColorModal(false);
            loadColors();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm Màu sắc!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm Màu sắc!', 'error');
        }
    };

    const loadVariants = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/san-pham-ct/sp?productId=${productId}`);
            setVariants(response.data);
        } catch (error) {
            console.error('Failed to fetch product variants', error);
        }
    };

    const loadImages = async (idspct) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/san-pham-ct/with-images/${idspct}`);
            console.log('images: ', response.data);
            setCurrentImages(response.data.hinhAnhUrls);
        } catch (error) {
            console.error('Failed to fetch product Images', error);
        }
    };

    const loadColors = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/mau-sac');
            setColors(response.data);
        } catch (error) {
            console.error('Failed to fetch colors', error);
        }
    };

    const loadWeights = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/trong-luong');
            setWeights(response.data);
        } catch (error) {
            console.error('Failed to fetch weights', error);
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
            console.error('Failed to fetch materials', error);
        }
    };

    const loadBalances = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/diem-can-bang');
            setBalances(response.data);
        } catch (error) {
            console.error('Failed to fetch balance points', error);
        }
    };

    const loadStiffs = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/do-cung');
            setStiffs(response.data);
        } catch (error) {
            console.error('Failed to fetch stiffness levels', error);
        }
    };

    const filteredProducts = variants.filter((product) => {
        // Kiểm tra sự tồn tại của các thuộc tính trước khi truy cập
        const productName = product.sanPham?.ten || '';
        const brandName = product.thuongHieu?.ten || '';
        const colorName = product.mauSac?.ten || '';
        const weightName = product.trongLuong?.ten || '';
        const price = product.donGia || 0;

        const matchesSearchTerm = productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = brandFilter ? brandName === brandFilter : true;
        const matchesColor = colorFilter ? colorName === colorFilter : true;
        const matchesWeight = weightFilter ? weightName === weightFilter : true;
        const matchesPrice = priceFilter ? price <= parseFloat(priceFilter) : true;

        return matchesSearchTerm && matchesBrand && matchesColor && matchesWeight && matchesPrice;
    });

    // Form handling
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm();

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setSelectedProduct(null);
    };

    const handleAddBrand = async (values) => {
        const newBrand = {
            ten: values.brandName,
            trangThai: values.status === '1' ? 1 : 0,
        };
        try {
            await axios.post('http://localhost:8080/api/thuong-hieu', newBrand);
            swal('Thành công!', 'Thương hiệu đã được thêm!', 'success');
            setShowBrandModal(false);
            loadBrands();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm thương hiệu!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm thương hiệu!', 'error');
        }
    };

    const handleAddStiff = async (values) => {
        const newStiff = {
            ten: values.stiffName,
            trangThai: values.status === '1' ? 1 : 0,
        };
        try {
            await axios.post('http://localhost:8080/api/do-cung', newStiff);
            swal('Thành công!', 'Độ cứng đã được thêm!', 'success');
            setShowStiffModal(false);
            loadStiffs();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm Độ cứng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm Độ cứng!', 'error');
        }
    };

    const handleAddBalance = async (values) => {
        const newBalance = {
            ten: values.balanceName,
            trangThai: values.status === '1' ? 1 : 0,
        };
        try {
            await axios.post('http://localhost:8080/api/diem-can-bang', newBalance);
            swal('Thành công!', 'Điểm cân bằng đã được thêm!', 'success');
            setShowBalanceModal(false);
            loadBalances();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm Điểm cân bằng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm Điểm cân bằng!', 'error');
        }
    };

    const handleRemoveImage = async (index, isPreview) => {
        try {
            if (isPreview) {
                // Nếu là ảnh preview, xóa khỏi previewImages
                setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
            } else {
                // Nếu là ảnh hiện tại, xóa khỏi currentImages
                const imageToRemove = currentImages[index];

                // Cập nhật currentImages để xóa ảnh
                const updatedCurrentImages = currentImages.filter((_, i) => i !== index);
                setCurrentImages(updatedCurrentImages);

                // Lấy ra các variant cùng màu
                const sameColorVariants = variants.filter(
                    (v) => v.mauSac.ten === selectedProduct.mauSac.ten && v.id !== selectedProduct.id,
                );

                // Xóa ảnh khỏi tất cả các variant cùng màu
                await Promise.all(
                    sameColorVariants.map(async (colorVariant) => {
                        try {
                            // Gửi request để xóa ảnh cho variant cùng màu
                            await axios.put(
                                `http://localhost:8080/api/san-pham-ct/with-images/${colorVariant.id}`,
                                updatedCurrentImages,
                            );
                        } catch (error) {
                            console.error('Failed to remove image from variant:', error);
                            swal('Thất bại!', 'Có lỗi xảy ra khi xóa hình ảnh!', 'error');
                        }
                    }),
                );
            }
        } catch (error) {
            console.error('Failed to remove image:', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi xóa hình ảnh!', 'error');
        }
    };

    console.log('anh moi: ', previewImages);

    const handleUpdateImages = async (variant) => {
        try {
            // Lấy ra các variant cùng màu
            const sameColorVariants = variants.filter(
                (v) => v.mauSac.ten === variant.mauSac.ten && v.id !== variant.id,
            );

            // Kiểm tra nếu có hình ảnh mới để upload
            if (uploadImage && uploadImage.length > 0) {
                const formData = new FormData();

                // Thêm từng file vào FormData
                uploadImage.forEach((file) => {
                    formData.append('images', file);
                });

                formData.append('idSanPhamCT', variant.id);

                // Upload hình ảnh mới
                const uploadResponse = await axios.post('http://localhost:8080/api/hinh-anh/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Lấy URLs của hình ảnh vừa upload
                const newImageUrls = uploadResponse.data.map((image) => image.link);

                // Kết hợp URLs của hình ảnh cũ và mới
                const combinedImageUrls = [...currentImages, ...newImageUrls];

                // Cập nhật URLs hình ảnh cho các variant cùng màu
                await Promise.all(
                    sameColorVariants.map(async (colorVariant) => {
                        await axios.put(
                            `http://localhost:8080/api/san-pham-ct/with-images/${colorVariant.id}`,
                            combinedImageUrls,
                        );
                    }),
                );
            }
        } catch (error) {
            console.error('Failed to update product images', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi cập nhật hình ảnh!', 'error');
        }
    };

    const handleUpdateProduct = async (formData) => {
        try {
            // Cập nhật thông tin cho variant được chọn
            const updatedVariant = {
                ...selectedProduct,
                donGia: parseFloat(formData.price),
                soLuong: formData.quantity,
                trangThai: formData.status === 'Active' ? 1 : 0,
                chatLieu: { id: parseInt(formData.material) },
                diemCanBang: { id: parseInt(formData.balancePoint) },
                doCung: { id: parseInt(formData.hardness) },
                mauSac: {
                    id: colors.find((c) => c.ten === selectedColors[0])?.id || selectedProduct.mauSac.id,
                },
                trongLuong: {
                    id: weights.find((w) => w.ten === selectedWeights[0])?.id || selectedProduct.trongLuong.id,
                },
                moTa: formData.description,
                sanPham: {
                    id: selectedProduct.sanPham.id,
                    ten: formData.productName,
                },
                thuongHieu: { id: parseInt(formData.brand) },
            };

            // Kết hợp ảnh hiện tại và ảnh mới
            const combinedImages = [...currentImages];

            // Upload ảnh mới nếu có
            if (uploadImage && uploadImage.length > 0) {
                const formDataUpload = new FormData();
                uploadImage.forEach((file) => {
                    formDataUpload.append('images', file);
                });
                formDataUpload.append('idSanPhamCT', selectedProduct.id);

                const uploadResponse = await axios.post(
                    'http://localhost:8080/api/hinh-anh/upload-image',
                    formDataUpload,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );

                // Thêm URLs của hình ảnh mới vào mảng
                const newImageUrls = uploadResponse.data.map((image) => image.link);
                combinedImages.push(...newImageUrls);
            }

            // Lấy ra các variant cùng màu
            const sameColorVariants = variants.filter(
                (v) => v.mauSac.ten === selectedProduct.mauSac.ten && v.id !== selectedProduct.id,
            );

            // Cập nhật ảnh cho các variant cùng màu
            await Promise.all(
                sameColorVariants.map(async (colorVariant) => {
                    await axios.put(
                        `http://localhost:8080/api/san-pham-ct/with-images/${colorVariant.id}`,
                        combinedImages,
                    );
                }),
            );

            // Gửi request cập nhật cho variant được chọn
            const response = await axios.put(
                `http://localhost:8080/api/san-pham-ct/${selectedProduct.id}`,
                updatedVariant,
            );

            // Cập nhật ảnh cho variant hiện tại
            await axios.put(`http://localhost:8080/api/san-pham-ct/with-images/${selectedProduct.id}`, combinedImages);

            swal({
                title: 'Thành công!',
                text: 'Sản phẩm đã được cập nhật thành công!',
                button: 'Đóng',
            });

            loadVariants();
            handleCloseModal();
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

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file) => file);
        setUploadImage(newImages);

        // Cập nhật trạng thái previewImages
        setPreviewImages((prevImages) => [...prevImages, ...newImages]);
    };

    const handleAddMaterial = async (values) => {
        const newMaterial = {
            ten: values.materialName,
            trangThai: values.status === '1' ? 1 : 0,
        };
        try {
            await axios.post('http://localhost:8080/api/chat-lieu', newMaterial);
            swal('Thành công!', 'Chất liệu đã được thêm!', 'success');
            setShowMaterialModal(false);
            loadMaterials();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm chất liệu!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm chất liệu!', 'error');
        }
    };

    const handleUpdateClick = (variant) => {
        loadImages(variant.id);
        console.log('Selected Product:', variant);
        setSelectedProduct(variant);
        setShowUpdateModal(true);

        // Reset các state ảnh
        setSelectedImages([]);
        setPreviewImages([]);

        // Load ảnh hiện tại
        const productImages = variant.sanPham?.hinhAnh || [];

        // Các logic set giá trị form khác...
        reset();
        setValue('productName', variant.sanPham.ten);
        setValue('brand', variant.thuongHieu?.id);
        setValue('material', variant.chatLieu?.id);
        setValue('balancePoint', variant.diemCanBang?.id);
        setValue('hardness', variant.doCung?.id);
        setValue('status', variant.trangThai ? 'Active' : 'Inactive');
        setValue('description', variant.moTa);
        setValue('price', variant.donGia);
        setValue('quantity', variant.soLuong);

        // Load và set màu sắc
        if (variant.mauSac) {
            setSelectedColors([variant.mauSac.ten]);
        } else {
            setSelectedColors([]);
        }

        // Load và set trọng lượng
        if (variant.trongLuong) {
            setSelectedWeights([variant.trongLuong.ten]);
        } else {
            setSelectedWeights([]);
        }
    };

    useEffect(() => {
        loadVariants();
        loadBrands();
        loadMaterials();
        loadBalances();
        loadStiffs();
        loadColors();
        loadWeights();
    }, [productId]);

    const handleNavigateToProduct = () => {
        navigate('/admin/quan-ly-san-pham/san-pham-ct');
    }

    return (
        <div>
            <div className="font-bold text-sm">
                <span
                    className="cursor-pointer"
                    onClick={handleNavigateToProduct}
                >
                    Sản phẩm
                </span>
                <span className="text-gray-400 ml-2">/ Chi tiết sản phẩm</span>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                />
            </div>
            <div className="flex space-x-4 mb-4">
                <select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                >
                    <option value="">Tất cả thương hiệu</option>
                    <option value="Yonex">Yonex</option>
                    <option value="Lining">Lining</option>
                    <option value="Victor">Victor</option>
                    <option value="Mizuno">Mizuno</option>
                    <option value="Adidas">Adidas</option>
                </select>

                <select
                    value={colorFilter}
                    onChange={(e) => setColorFilter(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                >
                    <option value="">Tất cả màu sắc</option>
                    <option value="Đỏ">Đỏ</option>
                    <option value="Xanh">Xanh</option>
                    <option value="Trắng">Trắng</option>
                </select>

                <select
                    value={weightFilter}
                    onChange={(e) => setWeightFilter(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                >
                    <option value="">Tất cả trọng lượng</option>
                    <option value="2U">2U</option>
                    <option value="3U">3U</option>
                    <option value="4U">4U</option>
                    <option value="5U">5U</option>
                    <option value="6U">6U</option>
                </select>

                <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                >
                    <option value="">Tất cả giá</option>
                    <option value="1000000">Dưới 1 triệu</option>
                    <option value="3000000">Dưới 3 triệu</option>
                    <option value="5000000">Dưới 5 triệu</option>
                </select>
            </div>

            <div>
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="py-2 px-3 text-center whitespace-nowrap">STT</th>
                            <th className="py-2 px-3 text-center whitespace-nowrap">Tên</th>
                            <th className="py-2 px-3 text-center whitespace-nowrap">Số lượng</th>
                            <th className="py-2 px-3 text-center whitespace-nowrap">Giá</th>
                            <th className="py-2 px-3 text-center whitespace-nowrap">Màu sắc</th>
                            <th className="py-2 px-3 text-center whitespace-nowrap">Trọng lượng</th>
                            <th className="py-2 px-3 text-center whitespace-nowrap">Thương hiệu</th>
                            <th className="py-2 px-3 text-center whitespace-nowrap">Trạng thái</th>
                            <th className="py-2 px-3 text-center whitespace-nowrap"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((variant, index) => (
                            <tr key={variant.id} className="border-t border-gray-200 hover:bg-gray-100">
                                <td className="py-2 px-3 whitespace-nowrap">{index + 1}</td>
                                <td className="py-2 px-3 whitespace-nowrap">{variant.sanPham.ten}</td>
                                <td className="py-2 px-3 whitespace-nowrap text-center">{variant.soLuong}</td>
                                <td className="py-2 px-3 whitespace-nowrap text-center">{variant.donGia}</td>
                                <td className="py-2 px-3 whitespace-nowrap text-center">{variant.mauSac.ten}</td>
                                <td className="py-2 px-3 whitespace-nowrap text-center">{variant.trongLuong.ten}</td>
                                <td className="py-2 px-3 whitespace-nowrap text-center">{variant.thuongHieu.ten}</td>
                                <td className="py-2 px-3 whitespace-nowrap text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${variant.trangThai
                                            ? 'text-green-600 bg-green-100'
                                            : 'text-red-600 bg-red-100'
                                            }`}
                                    >
                                        {variant.trangThai ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-2 px-3">
                                    <button
                                        onClick={() => handleUpdateClick(variant)}
                                        className="text-blue-500 text-2xl font-medium py-2 px-4 rounded"
                                    >
                                        <TbEyeEdit />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showUpdateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg w-3/4 max-h-[90vh] overflow-auto">
                        <h2 className="text-xl text-gray-500 font-bold mb-4">Cập nhật sản phẩm</h2>

                        <form onSubmit={handleSubmit(handleUpdateProduct)}>
                            <div className="bg-white p-4 rounded-md shadow-lg">
                                <div className="mb-2 flex justify-center">
                                    <div className="w-[85%]">
                                        <label className="block text-sm font-bold text-gray-700" htmlFor="productName">
                                            <span className="text-red-600">*</span>Tên sản phẩm (áp dụng cho tất cả biến thể)
                                        </label>
                                        <input
                                            type="text"
                                            id="productName"
                                            {...register('productName', { required: true })}
                                            className="mt-1 block h-10 w-full border border-gray-300 rounded-md p-1 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mb-2 grid grid-cols-2 gap-4 w-[85%] mx-auto">
                                    <div className="flex items-center">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-bold text-gray-700" htmlFor="brand">
                                                <span className="text-red-600">*</span>Thương hiệu (áp dụng cho tất cả biến thể)
                                            </label>
                                            <div className="flex items-center">
                                                <select
                                                    id="brand"
                                                    {...register('brand', { required: true })}
                                                    className="mt-1 block w-[90%] h-10 border border-gray-300 rounded-md p-2 text-sm"
                                                >
                                                    <option value="">Chọn thương hiệu</option>
                                                    {brands.map((brand) => (
                                                        <option key={brand.id} value={brand.id}>
                                                            {brand.ten}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handleAddBrandModal}
                                                    type="button"
                                                    className="bg-blue-500 border border-blue-500 text-white hover:bg-white hover:text-blue-500 font-medium py-1 px-2 w-9 h-9 rounded flex items-center justify-center ml-4"
                                                >
                                                    <AddIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-bold text-gray-700" htmlFor="material">
                                                <span className="text-red-600">*</span>Chất liệu
                                            </label>
                                            <div className="flex items-center">
                                                <select
                                                    id="material"
                                                    {...register('material', { required: true })}
                                                    className="mt-1 block w-[90%] h-10 border border-gray-300 rounded-md p-2 text-sm"
                                                >
                                                    <option value="">Chọn chất liệu</option>
                                                    {materials.map((material) => (
                                                        <option key={material.id} value={material.id}>
                                                            {material.ten}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handleAddMaterialModal}
                                                    type="button"
                                                    className="bg-blue-500 border border-blue-500 text-white hover:bg-white hover:text-blue-500 font-medium py-1 px-2 w-9 h-9 rounded flex items-center justify-center ml-4"

                                                >
                                                    <AddIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-bold text-gray-700" htmlFor="balancePoint">
                                                <span className="text-red-600">*</span>Điểm cân bằng
                                            </label>
                                            <div className="flex items-center">
                                                <select
                                                    id="balancePoint"
                                                    {...register('balancePoint', { required: true })}
                                                    className="mt-1 block w-[90%] h-10 border border-gray-300 rounded-md p-2 text-sm"
                                                >
                                                    <option value="">Chọn điểm cân bằng</option>
                                                    {balances.map((balance) => (
                                                        <option key={balance.id} value={balance.id}>
                                                            {balance.ten}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handleAddBalanceModal}
                                                    type="button"
                                                    className="bg-blue-500 border border-blue-500 text-white hover:bg-white hover:text-blue-500 font-medium py-1 px-2 w-9 h-9 rounded flex items-center justify-center ml-4"

                                                >
                                                    <AddIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-bold text-gray-700" htmlFor="hardness">
                                                <span className="text-red-600">*</span>Độ cứng
                                            </label>
                                            <div className="flex items-center">
                                                <select
                                                    id="hardness"
                                                    {...register('hardness', { required: true })}
                                                    className="mt-1 block w-[90%] h-10 border border-gray-300 rounded-md p-2 text-sm"
                                                >
                                                    <option value="">Chọn độ cứng</option>
                                                    {stiffs.map((stiff) => (
                                                        <option key={stiff.id} value={stiff.id}>
                                                            {stiff.ten}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handleAddStiffModal}
                                                    type="button"
                                                    className="bg-blue-500 border border-blue-500 text-white hover:bg-white hover:text-blue-500 font-medium py-1 px-2 w-9 h-9 rounded flex items-center justify-center ml-4"
                                                >
                                                    <AddIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-2 w-[85%] mx-auto">
                                    <label className="block text-sm font-bold text-gray-700" htmlFor="status">
                                        <span className="text-red-600">*</span>Trạng thái
                                    </label>
                                    <select
                                        id="status"
                                        {...register('status', { required: true })}
                                        className="mt-1 block w-full h-10 border border-gray-300 rounded-md p-2 text-sm"
                                    >
                                        <option value="">Chọn trạng thái</option>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>

                                <div className="mb-2 w-[85%] mx-auto">
                                    <label className="block text-sm font-bold text-gray-700" htmlFor="description">
                                        <span className="text-red-600">*</span>Mô tả
                                    </label>
                                    <textarea
                                        id="description"
                                        {...register('description', { required: true })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-sm h-20"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-md shadow-lg mt-4">
                                {/* Màu sắc */}
                                <div className="pl-24 mt-6">
                                    <div className="flex items-center">
                                        <label className="block text-sm font-bold text-gray-700 w-28" htmlFor="description">
                                            <span className="text-red-600">*</span>Màu sắc:
                                        </label>

                                        {selectedColors.map((color, index) => (
                                            <button
                                                key={index}
                                                className="border font-medium py-1 px-1 rounded w-9 h-6 flex items-center justify-center ml-2"
                                                style={{
                                                    backgroundColor: color,
                                                    color: '#fff',
                                                    borderColor: color === 'white' ? '#000' : 'transparent',
                                                }}
                                            ></button>
                                        ))}

                                        <button
                                            onClick={handleColorModal}
                                            type="button"
                                            className="bg-blue-500 border border-blue-500 text-white hover:bg-white hover:text-blue-500 font-medium py-1 px-2 w-9 h-6 rounded flex items-center justify-center ml-6"
                                        >
                                            <AddIcon />
                                        </button>
                                    </div>
                                </div>

                                {/* Trọng lượng */}
                                <div className="pl-24 mt-6 mb-6">
                                    <div className="flex items-center">
                                        <label className="block text-sm font-bold text-gray-700 w-28" htmlFor="description">
                                            <span className="text-red-600">*</span>Trọng lượng:
                                        </label>
                                        {selectedWeights.map((weight, index) => (
                                            <button
                                                key={index}
                                                className="border font-medium text-xs py-1 px-1 rounded w-9 h-6 flex items-center justify-center ml-2"
                                                style={{
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    borderColor: 'black',
                                                }}
                                            >
                                                {weight}
                                            </button>
                                        ))}

                                        <button
                                            onClick={handleWeightModal}
                                            type="button"
                                            className="bg-blue-500 border border-blue-500 text-white hover:bg-white hover:text-blue-500 font-medium py-1 px-2 w-9 h-6 rounded flex items-center justify-center ml-6"
                                        >
                                            <AddIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-md shadow-lg mt-4">
                                {/* Thêm các trường giá và số lượng */}
                                <div className="mb-2 grid grid-cols-2 gap-4 w-[85%] mx-auto">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700" htmlFor="price">
                                            <span className="text-red-600">*</span>Giá sản phẩm
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            {...register('price', {
                                                required: 'Giá sản phẩm là bắt buộc',
                                                min: {
                                                    value: 1000, // Giá tối thiểu 1,000 VND
                                                    message: 'Giá sản phẩm phải lớn hơn 1,000 VND',
                                                },
                                                max: {
                                                    value: 1000000000, // Giá tối đa 1 tỷ VND
                                                    message: 'Giá sản phẩm không được vượt quá 1 tỷ VND',
                                                },
                                            })}
                                            className="mt-1 block w-full h-10 border border-gray-300 rounded-md p-2 text-sm"
                                        />
                                        {errors.price && <span className="text-red-500">{errors.price.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700" htmlFor="quantity">
                                            <span className="text-red-600">*</span>Số lượng
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            {...register('quantity', {
                                                required: true,
                                                min: {
                                                    value: 0,
                                                    message: 'Số lượng phải lớn hơn hoặc bằng 0',
                                                },
                                            })}
                                            className="mt-1 block w-full h-10 border border-gray-300 rounded-md p-2 text-sm"
                                        />
                                        {errors.quantity && <span className="text-red-500">{errors.quantity.message}</span>}
                                    </div>
                                </div>

                                {/* Quản lý ảnh */}
                                {/* Quản lý ảnh */}
                                <div className="mb-4 w-[85%] mx-auto">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh</label>
                                    <div className="flex flex-wrap gap-2">
                                        {/* Hiển thị ảnh hiện tại */}
                                        {currentImages.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={image}
                                                    alt={`Current ${index}`}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index, false)} // Gọi hàm xóa với isPreview là false
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}

                                        {/* Hiển thị ảnh preview mới */}
                                        {previewImages.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index}`}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index, true)} // Gọi hàm xóa với isPreview là true
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}

                                        {/* Nút chọn ảnh */}
                                        {currentImages.length + previewImages.length < 5 && (
                                            <label className="border-2 border-dashed w-20 h-20 flex items-center justify-center rounded cursor-pointer">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/jpeg,image/png,image/gif"
                                                    className="hidden"
                                                    onChange={handleImageChange} // Thêm sự kiện onChange
                                                />
                                                <span className="text-2xl text-gray-500">+</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showColorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[435px]">
                        <h2 className="font-bold text-xl text-center mb-5">Màu sắc</h2>
                        <div>
                            {colors.map((color) => (
                                <button
                                    key={color.id}
                                    onClick={() => {
                                        if (selectedColors.includes(color.ten)) {
                                            // Nếu màu đã được chọn, loại bỏ nó khỏi mảng
                                            setSelectedColors(selectedColors.filter((c) => c !== color.ten));
                                        } else {
                                            // Nếu màu chưa được chọn, thêm nó vào mảng
                                            setSelectedColors([...selectedColors, color.ten]);
                                        }
                                    }}
                                    className={`hover:bg-slate-700 text-white py-1 px-1 rounded-lg h-8 w-[65px] text-[11px] mr-3 mb-3 ${selectedColors.includes(color.ten) ? 'bg-white text-black border-2' : ''
                                        }`}
                                    style={{
                                        backgroundColor: selectedColors.includes(color.ten) ? 'white' : color.ten,
                                        color: selectedColors.includes(color.ten) ? 'black' : 'white',
                                        borderColor: selectedColors.includes(color.ten) ? color.ten : 'transparent',
                                    }}
                                >
                                    {color.ten}
                                </button>
                            ))}
                        </div>
                        <div className="mt-5 flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowColorModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleAddColorModal}
                                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showWeightModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[435px]">
                        <h2 className="font-bold text-xl text-center mb-5">Trọng lượng</h2>
                        <div>
                            {weights.map((weight) => (
                                <button
                                    key={weight.id}
                                    onClick={() => {
                                        if (selectedWeights.includes(weight.ten)) {
                                            // Nếu trọng lượng đã được chọn, loại bỏ nó khỏi mảng
                                            setSelectedWeights(selectedWeights.filter((w) => w !== weight.ten));
                                        } else {
                                            // Nếu trọng lượng chưa được chọn, thêm nó vào mảng
                                            setSelectedWeights([...selectedWeights, weight.ten]);
                                        }
                                    }}
                                    className={`bg-slate-950 hover:bg-slate-700 text-white py-1 px-1 rounded-lg h-8 w-[65px] text-[11px] mr-3 mb-3 ${selectedWeights.includes(weight.ten) ? 'bg-white text-black border-2' : ''
                                        }`}
                                    style={{
                                        backgroundColor: selectedWeights.includes(weight.ten) ? 'white' : 'black',
                                        color: selectedWeights.includes(weight.ten) ? 'black' : 'white',
                                        borderColor: selectedWeights.includes(weight.ten) ? 'black' : 'transparent',
                                    }}
                                >
                                    {weight.ten}
                                </button>
                            ))}
                        </div>
                        <div className="mt-5 flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowWeightModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleAddWeightModal}
                                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddColorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[435px]">
                        <h3 className="text-lg font-bold mb-4">Thêm màu sắc</h3>
                        <form onSubmit={handleSubmit(handleAddColor)}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tên màu sắc</label>
                                <input
                                    type="text"
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${errors.colorName ? 'border-red-500' : ''
                                        }`}
                                    {...register('colorName', {
                                        required: 'Tên màu sắc là bắt buộc',
                                        validate: (value) => {
                                            // Kiểm tra trùng tên
                                            const isDuplicate = colors.some(
                                                (color) => color.ten.toLowerCase() === value.toLowerCase(),
                                            );
                                            return !isDuplicate || 'Màu sắc đã tồn tại';
                                        },
                                    })}
                                />
                                {errors.colorName && <span className="text-red-500">{errors.colorName.message}</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Trạng thái</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="1"
                                            className="form-radio"
                                            {...register('status', { required: 'Trạng thái là bắt buộc' })}
                                        />
                                        <span className="ml-2">Active</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="0"
                                            className="form-radio"
                                            {...register('status', { required: 'Trạng thái là bắt buộc' })}
                                        />
                                        <span className="ml-2">Inactive</span>
                                    </label>
                                </div>
                                {errors.status && <span className="text-red-500">{errors.status.message}</span>}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddColorModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                                >
                                    Đóng
                                </button>
                                <button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAddWeightModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[435px]">
                        <h3 className="text-lg font-bold mb-4">Thêm trọng lượng</h3>
                        <form onSubmit={handleSubmit(handleAddWeight)}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tên trọng lượng</label>
                                <input
                                    type="text"
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${errors.weightName ? 'border-red-500' : ''
                                        }`}
                                    {...register('weightName', {
                                        required: 'Tên trọng lượng là bắt buộc',
                                        validate: (value) => {
                                            // Kiểm tra trùng tên
                                            const isDuplicate = weights.some(
                                                (weight) => weight.ten.toLowerCase() === value.toLowerCase(),
                                            );
                                            return !isDuplicate || 'Trọng lượng đã tồn tại';
                                        },
                                    })}
                                />
                                {errors.weightName && <span className="text-red-500">{errors.weightName.message}</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Trạng thái</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="1"
                                            className="form-radio"
                                            {...register('status', { required: 'Trạng thái là bắt buộc' })}
                                        />
                                        <span className="ml-2">Active</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="0"
                                            className="form-radio"
                                            {...register('status', { required: 'Trạng thái là bắt buộc' })}
                                        />
                                        <span className="ml-2">Inactive</span>
                                    </label>
                                </div>
                                {errors.status && <span className="text-red-500">{errors.status.message}</span>}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddWeightModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                                >
                                    Đóng
                                </button>
                                <button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showBrandModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Thêm thương hiệu</h3>
                        <form onSubmit={handleSubmit(handleAddBrand)}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tên thương hiệu</label>
                                <input
                                    type="text"
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${errors.brandName ? 'border-red-500' : ''
                                        }`}
                                    {...register('brandName', { required: true })}
                                />
                                {errors.brandName && <span className="text-red-500">Tên thương hiệu là bắt buộc.</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Trạng thái</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="1"
                                            className="form-radio"
                                            {...register('status', { required: true })}
                                        />
                                        <span className="ml-2">Active</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="0"
                                            className="form-radio"
                                            {...register('status', { required: true })}
                                        />
                                        <span className="ml-2">Inactive</span>
                                    </label>
                                </div>
                                {errors.status && <span className="text-red-500">Trạng thái là bắt buộc.</span>}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowBrandModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                                >
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showMaterialModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Thêm chất liệu</h3>
                        <form onSubmit={handleSubmit(handleAddMaterial)}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tên chất liệu</label>
                                <input
                                    type="text"
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${errors.materialName ? 'border-red-500' : ''
                                        }`}
                                    {...register('materialName', { required: true })}
                                />
                                {errors.materialName && (
                                    <span className="text-red-500">Tên chất liệu là bắt buộc.</span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Trạng thái</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="1"
                                            className="form-radio"
                                            {...register('status', { required: true })}
                                        />
                                        <span className="ml-2">Active</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="0"
                                            className="form-radio"
                                            {...register('status', { required: true })}
                                        />
                                        <span className="ml-2">Inactive</span>
                                    </label>
                                </div>
                                {errors.status && <span className="text-red-500">Trạng thái là bắt buộc.</span>}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowMaterialModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                                >
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showBalanceModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Thêm điểm cân bằng</h3>
                        <form onSubmit={handleSubmit(handleAddBalance)}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tên điểm cân bằng</label>
                                <input
                                    type="text"
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${errors.balanceName ? 'border-red-500' : ''
                                        }`}
                                    {...register('balanceName', { required: true })}
                                />
                                {errors.balanceName && (
                                    <span className="text-red-500">Tên điểm cân bằng là bắt buộc.</span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Trạng thái</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="1"
                                            className="form-radio"
                                            {...register('status', { required: true })}
                                        />
                                        <span className="ml-2">Active</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="0"
                                            className="form-radio"
                                            {...register('status', { required: true })}
                                        />
                                        <span className="ml-2">Inactive</span>
                                    </label>
                                </div>
                                {errors.status && <span className="text-red-500">Trạng thái là bắt buộc.</span>}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowBalanceModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                                >
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showStiffModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Thêm độ cứng</h3>
                        <form onSubmit={handleSubmit(handleAddStiff)}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tên độ cứng</label>
                                <input
                                    type="text"
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${errors.stiffName ? 'border-red-500' : ''
                                        }`}
                                    {...register('stiffName', { required: true })}
                                />
                                {errors.stiffName && <span className="text-red-500">Tên độ cứng là bắt buộc.</span>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Trạng thái</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="1"
                                            className="form-radio"
                                            {...register('status', { required: true })}
                                        />
                                        <span className="ml-2">Active</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="0"
                                            className="form-radio"
                                            {...register('status', { required: true })}
                                        />
                                        <span className="ml-2">Inactive</span>
                                    </label>
                                </div>
                                {errors.status && <span className="text-red-500">Trạng thái là bắt buộc.</span>}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowStiffModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                                >
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductVariants;
