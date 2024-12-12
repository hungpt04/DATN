import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import swal from 'sweetalert';
import { useForm } from 'react-hook-form';

function AddProduct() {
    const [productName, setProductName] = useState('');

    const [brand, setBrand] = useState('');
    const [brands, setBrands] = useState([]);

    const [material, setMaterial] = useState('');
    const [materials, setMaterials] = useState([]);

    const [balancePoint, setBalancePoint] = useState('');
    const [balances, setBalances] = useState([]);

    const [hardness, setHardness] = useState('');
    const [stiffs, setStiffs] = useState([]);

    const [status, setStatus] = useState('');

    const [colors, setColors] = useState([]);
    const [weights, setWeights] = useState([]);
    const [description, setDescription] = useState('');
    const [variants, setVariants] = useState([]);

    const [imageList, setImageList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);

    const [variantImages, setVariantImages] = useState({});

    // Thêm state mới
    const [showVariantImageModal, setShowVariantImageModal] = useState(false);
    const [currentVariantForImage, setCurrentVariantForImage] = useState(null);

    // Hàm mở modal chọn ảnh cho biến thể
    const openVariantImageModal = (color) => {
        setCurrentVariantForImage(color);
        setShowVariantImageModal(true);
    };

    const handleSaveVariantImages = () => {
        if (currentVariantForImage && selectedImages.length > 0) {
            // Lưu file gốc thay vì URL
            setVariantImages((prev) => ({
                ...prev,
                [currentVariantForImage]: selectedImages[0],
            }));

            // Reset trạng thái
            setShowVariantImageModal(false);
            setSelectedImages([]);
            setCurrentVariantForImage(null);
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    //Modal
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [showStiffModal, setShowStiffModal] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);
    const [showAddColorModal, setShowAddColorModal] = useState(false);
    const [showWeightModal, setShowWeightModal] = useState(false);
    const [showAddWeightModal, setShowAddWeightModal] = useState(false);

    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedWeights, setSelectedWeights] = useState([]);

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

    useEffect(() => {
        loadBrands();
        loadMaterials();
        loadBalances();
        loadStiffs();
        loadColors();
        loadWeights();
    }, []);

    //Add
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
            reset();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm thương hiệu!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm thương hiệu!', 'error');
        }
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
            reset();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm chất liệu!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm chất liệu!', 'error');
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
            reset();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm Điểm cân bằng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm Điểm cân bằng!', 'error');
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
            reset();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm Độ cứng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm Độ cứng!', 'error');
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
            reset();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm Màu sắc!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm Màu sắc!', 'error');
        }
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
            reset();
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm Trọng lượng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm Trọng lượng!', 'error');
        }
    };

    const handleAddBrandModal = () => {
        reset();
        setShowBrandModal(true);
    };

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

    const handleColorModal = () => {
        reset();
        setShowColorModal(true);
    };

    const handleWeightModal = () => {
        reset();
        setShowWeightModal(true);
    };

    const handleAddColorModal = () => {
        reset();
        setShowAddColorModal(true);
    };

    const handleAddWeightModal = () => {
        reset();
        setShowAddWeightModal(true);
    };

    // const handleAddImage = (e) => {
    //     const files = Array.from(e.target.files);
    //     const newImages = files.map((file) => URL.createObjectURL(file));
    //     setImageList((prev) => [...prev, ...newImages]);
    // };

    const handleSelectImage = (image) => {
        if (selectedImages.includes(image)) {
            setSelectedImages(selectedImages.filter((img) => img !== image));
        } else {
            setSelectedImages([...selectedImages, image]);
        }
    };

    const handleAddImage = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => file); // Lưu trực tiếp file gốc
        setImageList((prev) => [...prev, ...newImages]);
    };

    const handleSaveImages = () => {
        setShowImageModal(false);
    };

    const createVariants = () => {
        const newVariants = [];
        selectedColors.forEach((color) => {
            selectedWeights.forEach((weight) => {
                newVariants.push({
                    id: newVariants.length + 1,
                    name: `${productName} - ${color} - ${weight}`,
                    quantity: 0,
                    price: '',
                    weight: weight,
                    color: color, // Thêm thông tin màu
                    colorId: colors.find((c) => c.ten === color)?.id,
                    weightId: weights.find((w) => w.ten === weight)?.id,
                });
            });
        });
        setVariants(newVariants);
    };

    useEffect(() => {
        if (selectedColors.length > 0 && selectedWeights.length > 0) {
            createVariants();
        } else {
            setVariants([]);
        }
    }, [selectedColors, selectedWeights]);

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const newProduct = {
            ten: productName,
            trangThai: 1,
        };

        try {
            const productResponse = await axios.post('http://localhost:8080/api/san-pham', newProduct);
            const newProductId = productResponse.data.id;

            // Nhóm variants theo màu
            const colorGroups = {};
            variants.forEach((variant) => {
                if (!colorGroups[variant.color]) {
                    colorGroups[variant.color] = [];
                }
                colorGroups[variant.color].push(variant);
            });

            // Duyệt qua từng nhóm màu
            for (const color in colorGroups) {
                const colorVariants = colorGroups[color];
                const colorImage = variantImages[color];

                console.log('co lo image:', colorImage);
                // Nếu có ảnh cho màu này
                if (colorImage) {
                    // Upload ảnh cho TẤT CẢ các variant của màu này
                    for (const variant of colorVariants) {
                        const newSanPhamCT = {
                            sanPham: { id: newProductId },
                            thuongHieu: { id: brand },
                            mauSac: { id: variant.colorId },
                            chatLieu: { id: material },
                            trongLuong: { id: variant.weightId },
                            diemCanBang: { id: balancePoint },
                            doCung: { id: hardness },
                            ma: `SPCT${variant.id}`,
                            soLuong: variant.quantity,
                            donGia: variant.price,
                            moTa: description,
                            trangThai: status === 'Active' ? 1 : 0,
                        };

                        const sanPhamCTResponse = await axios.post(
                            'http://localhost:8080/api/san-pham-ct',
                            newSanPhamCT,
                        );
                        const sanPhamCTId = sanPhamCTResponse.data.id;

                        // Upload ảnh cho mỗi sản phẩm chi tiết
                        const formData = new FormData();
                        formData.append('images', colorImage);
                        formData.append('idSanPhamCT', sanPhamCTId);

                        try {
                            await axios.post('http://localhost:8080/api/hinh-anh/upload-image', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            });
                        } catch (error) {
                            console.error(`Lỗi upload ảnh cho sản phẩm chi tiết ${sanPhamCTId}:`, error);
                        }
                    }
                }
            }

            swal('Thành công!', 'Sản phẩm đã được thêm!', 'success');
            reset();
            setVariants([]);
            setVariantImages({});
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm sản phẩm!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm sản phẩm!', 'error');
        }
    };

    return (
        <div className="p-4 max-w-full mx-auto bg-white rounded-lg shadow-md w-[1000px]">
            <h2 className="text-xl font-bold mb-4">Thêm sản phẩm</h2>
            <form>
                <div className="mb-2 flex justify-center">
                    <div className="w-[85%]">
                        <label className="block text-sm font-bold text-gray-700" htmlFor="productName">
                            Tên sản phẩm
                        </label>
                        <input
                            type="text"
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="mt-1 block h-10 w-full border border-gray-300 rounded-md p-1 text-sm"
                            required
                        />
                    </div>
                </div>
                <div className="mb-2 grid grid-cols-2 gap-4 w-[85%] mx-auto">
                    <div className="flex items-center">
                        <div className="flex-grow">
                            <label className="block text-sm font-bold text-gray-700" htmlFor="brand">
                                Thương hiệu
                            </label>
                            <div className="flex items-center">
                                <select
                                    id="brand"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
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
                                    className="ml-2 h-10 w-10 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium rounded flex items-center justify-center"
                                >
                                    <AddIcon />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex-grow">
                            <label className="block text-sm font-bold text-gray-700" htmlFor="material">
                                Chất liệu
                            </label>
                            <div className="flex items-center">
                                <select
                                    id="material"
                                    value={material}
                                    onChange={(e) => setMaterial(e.target.value)}
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
                                    className="ml-2 h-10 w-10 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium rounded flex items-center justify-center"
                                >
                                    <AddIcon />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex-grow">
                            <label className="block text-sm font-bold text-gray-700" htmlFor="balancePoint">
                                Điểm cân bằng
                            </label>
                            <div className="flex items-center">
                                <select
                                    id="balancePoint"
                                    value={balancePoint}
                                    onChange={(e) => setBalancePoint(e.target.value)}
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
                                    className="ml-2 h-10 w-10 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium rounded flex items-center justify-center"
                                >
                                    <AddIcon />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex-grow">
                            <label className="block text-sm font-bold text-gray-700" htmlFor="hardness">
                                Độ cứng
                            </label>
                            <div className="flex items-center">
                                <select
                                    id="hardness"
                                    value={hardness}
                                    onChange={(e) => setHardness(e.target.value)}
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
                                    className="ml-2 h-10 w-10 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium rounded flex items-center justify-center"
                                >
                                    <AddIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-2 w-[85%] mx-auto">
                    <label className="block text-sm font-bold text-gray-700" htmlFor="status">
                        Trạng thái
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 block w-full h-10 border border-gray-300 rounded-md p-2 text-sm"
                    >
                        <option value="">Chọn trạng thái</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        {/* Add status options here */}
                    </select>
                </div>
                <div className="mb-2 w-[85%] mx-auto">
                    <label className="block text-sm font-bold text-gray-700" htmlFor="description">
                        Mô tả
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-sm h-20"
                        required
                    />
                </div>
                <div className="mb-2 mt-[100px] ml-[74px]">
                    <div className="flex items-center">
                        <span className="block text-xl font-bold text-gray-700 mr-2">Màu sắc:</span>

                        {selectedColors.map((color, index) => (
                            <div key={index} className="flex items-center mr-4">
                                <button
                                    className="border font-medium py-1 px-1 rounded w-9 h-9"
                                    style={{
                                        backgroundColor: color,
                                        color: '#fff',
                                        borderColor: color === 'white' ? '#000' : 'transparent',
                                    }}
                                ></button>
                            </div>
                        ))}

                        <button
                            onClick={handleColorModal}
                            type="button"
                            className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium py-1 px-2 rounded ml-[60px]"
                        >
                            <AddIcon />
                        </button>
                    </div>
                </div>
                <div className="mb-2 mt-[40px] ml-[74px]">
                    <div className="flex items-center">
                        <span className="block text-xl font-bold text-gray-700 mr-2">Trọng lượng:</span>
                        {selectedWeights.map((weight, index) => (
                            <button
                                key={index}
                                className="border font-medium py-1 px-1 rounded ml-2 w-9 h-9"
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
                            className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium py-1 px-2 rounded ml-[20px]"
                        >
                            <AddIcon />
                        </button>
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 mt-[40px]">Biến thể sản phẩm</h3>
                {selectedColors.map((color) => (
                    <div key={color} className="mb-6">
                        <div className="flex items-center mb-2">
                            <span className="text-md font-semibold mr-2">Màu: {color}</span>
                        </div>
                        <table className="table-auto bg-white rounded-lg shadow-md w-[950px]">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="p-1 text-sm"></th>
                                    <th className="p-1 text-sm">STT</th>
                                    <th className="p-1 text-sm w-[250px]">Tên sản phẩm</th>
                                    <th className="p-4 text-sm w-[100px]">Số lượng</th>
                                    <th className="p-1 text-sm w-[100px]">Giá</th>
                                    <th className="p-1 text-sm w-[100px]">Ảnh</th>
                                    <th className="p-1 text-sm">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants
                                    .filter((variant) => variant.color === color)
                                    .map((variant, index) => (
                                        <tr key={variant.id}>
                                            <td className="p-1 text-sm text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={variant.selected}
                                                    onChange={() => {
                                                        const newVariants = [...variants];
                                                        const variantIndex = newVariants.findIndex(
                                                            (v) => v.id === variant.id,
                                                        );
                                                        newVariants[variantIndex].selected =
                                                            !newVariants[variantIndex].selected;
                                                        setVariants(newVariants);
                                                    }}
                                                />
                                            </td>
                                            <td className="p-1 text-sm text-center">{index + 1}</td>
                                            <td className="p-1 text-sm">{variant.name}</td>
                                            <td className="p-1 text-sm text-center">
                                                <input
                                                    type="number"
                                                    value={variant.quantity}
                                                    onChange={(e) => {
                                                        const newVariants = [...variants];
                                                        const variantIndex = newVariants.findIndex(
                                                            (v) => v.id === variant.id,
                                                        );
                                                        newVariants[variantIndex].quantity = e.target.value;
                                                        setVariants(newVariants);
                                                    }}
                                                    className="w-20 h-8 border border-gray-300 rounded-md p-1 text-sm"
                                                />
                                            </td>
                                            <td className="p-1 text-sm text-center">
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => {
                                                        const newVariants = [...variants];
                                                        const variantIndex = newVariants.findIndex(
                                                            (v) => v.id === variant.id,
                                                        );
                                                        newVariants[variantIndex].price = e.target.value;
                                                        setVariants(newVariants);
                                                    }}
                                                    className="w-20 h-8 border border-gray-300 rounded-md p-1 text-sm"
                                                />
                                            </td>
                                            <td className="p-1 text-sm text-center">
                                                {index === 0 && (
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            onClick={() => openVariantImageModal(color)}
                                                            type="button"
                                                            className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium py-1 px-2 rounded mr-2"
                                                        >
                                                            {variantImages[color] ? 'Đổi ảnh' : 'Thêm ảnh'}
                                                        </button>
                                                        {/* {variantImages[color] && (
                                                            <img
                                                                src={variantImages[color]}
                                                                alt={`Ảnh ${color}`}
                                                                className="w-16 h-16 object-cover rounded"
                                                            />
                                                        )} */}
                                                        {variantImages[variant.color] && (
                                                            <div className="flex items-center justify-center">
                                                                <img
                                                                    src={URL.createObjectURL(
                                                                        variantImages[variant.color],
                                                                    )}
                                                                    alt={`Ảnh ${variant.color}`}
                                                                    className="w-16 h-16 object-cover rounded"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-1 text-sm text-center">
                                                <button
                                                    className="text-red-600 hover:underline"
                                                    onClick={() => {
                                                        const newVariants = variants.filter((v) => v.id !== variant.id);
                                                        setVariants(newVariants);
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ))}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={async (e) => {
                            await handleAddProduct(e);
                            window.location.href = 'http://localhost:3000/admin/quan-ly-san-pham/san-pham-ct';
                        }}
                        className="bg-blue-600 text-white rounded-md px-4 py-2"
                    >
                        Thêm sản phẩm
                    </button>
                </div>
            </form>

            {showBrandModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Thêm thương hiệu</h3>
                        <form onSubmit={handleSubmit(handleAddBrand)}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tên thương hiệu</label>
                                <input
                                    type="text"
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${
                                        errors.brandName ? 'border-red-500' : ''
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
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${
                                        errors.materialName ? 'border-red-500' : ''
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
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${
                                        errors.balanceName ? 'border-red-500' : ''
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

            {showVariantImageModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
                        <h3 className="text-lg font-bold mb-4">Chọn ảnh cho biến thể</h3>
                        <input type="file" multiple onChange={handleAddImage} />
                        <div className="mt-4 grid grid-cols-4 gap-2">
                            {/* {imageList.map((image, index) => (
                                <div key={index} className="relative">
                                    <input
                                        type="checkbox"
                                        checked={selectedImages.includes(image)}
                                        onChange={() => {
                                            // Chỉ cho chọn 1 ảnh
                                            setSelectedImages(selectedImages.includes(image) ? [] : [image]);
                                        }}
                                        className="absolute top-1 left-1 z-10"
                                    />
                                    <img src={image} alt="preview" className="w-full h-32 object-cover rounded" />
                                </div>
                            ))} */}
                            {imageList.map((file, index) => (
                                <div key={index} className="relative">
                                    <input
                                        type="checkbox"
                                        checked={selectedImages.includes(file)}
                                        onChange={() => {
                                            // Chỉ cho chọn 1 ảnh
                                            setSelectedImages(selectedImages.includes(file) ? [] : [file]);
                                        }}
                                        className="absolute top-1 left-1 z-10"
                                    />
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="w-full h-32 object-cover rounded"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowVariantImageModal(false);
                                    setSelectedImages([]);
                                    setImageList([]);
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleSaveVariantImages}
                                type="button"
                                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                            >
                                Lưu ảnh
                            </button>
                        </div>
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
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${
                                        errors.stiffName ? 'border-red-500' : ''
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

            {showColorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[435px]">
                        <h2 className="font-bold text-xl text-center mb-5">Màu sắc</h2>
                        <div>
                            {colors.map((color) => (
                                <button
                                    onClick={() => {
                                        if (selectedColors.includes(color.ten)) {
                                            // Nếu màu đã được chọn, loại bỏ nó khỏi mảng
                                            setSelectedColors(selectedColors.filter((c) => c !== color.ten));
                                        } else {
                                            // Nếu màu chưa được chọn, thêm nó vào mảng
                                            setSelectedColors([...selectedColors, color.ten]);
                                        }
                                    }}
                                    className={`hover:bg-slate-700 text-white py-1 px-1 rounded-lg h-8 w-[65px] text-[11px] mr-3 mb-3 ${
                                        selectedColors.includes(color.ten) ? 'bg-white text-black border-2' : ''
                                    }`}
                                    style={{
                                        backgroundColor: selectedColors.includes(color.ten) ? 'white' : color.ten, // Nếu đã click thì đổi backgroundColor
                                        color: selectedColors.includes(color.ten) ? 'black' : 'white', // Nếu đã click thì đổi color
                                        borderColor: selectedColors.includes(color.ten) ? color.ten : 'transparent', // Đổi borderColor thành màu cũ
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

            {showAddColorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Thêm màu sắc</h3>
                        <form onSubmit={handleSubmit(handleAddColor)}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tên màu sắc</label>
                                <input
                                    type="text"
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${
                                        errors.colorName ? 'border-red-500' : ''
                                    }`}
                                    {...register('colorName', { required: true })}
                                />
                                {errors.colorName && <span className="text-red-500">Tên màu sắc là bắt buộc.</span>}
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
                                    onClick={() => setShowAddColorModal(false)}
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

            {showWeightModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[435px]">
                        <h2 className="font-bold text-xl text-center mb-5">Trọng lượng</h2>
                        <div>
                            {weights.map((weight) => (
                                <button
                                    onClick={() => {
                                        if (selectedWeights.includes(weight.ten)) {
                                            // Nếu màu đã được chọn, loại bỏ nó khỏi mảng
                                            setSelectedWeights(selectedWeights.filter((c) => c !== weight.ten));
                                        } else {
                                            // Nếu màu chưa được chọn, thêm nó vào mảng
                                            setSelectedWeights([...selectedWeights, weight.ten]);
                                        }
                                    }}
                                    className={`bg-slate-950 hover:bg-slate-700 text-white py-1 px-1 rounded-lg h-8 w-[65px] text-[11px] mr-3 mb-3 ${
                                        selectedWeights.includes(weight.ten) ? 'bg-white text-black border-2' : ''
                                    }`}
                                    style={{
                                        backgroundColor: selectedWeights.includes(weight.ten) ? 'white' : 'black', // Nếu đã click thì đổi backgroundWeight
                                        color: selectedWeights.includes(weight.ten) ? 'black' : 'white', // Nếu đã click thì đổi Weight
                                        borderColor: selectedWeights.includes(weight.ten) ? 'black' : 'transparent', // Đổi borderColor thành màu cũ
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
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddWeightModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Thêm trọng lượng</h3>
                        <form onSubmit={handleSubmit(handleAddWeight)}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tên trọng lượng</label>
                                <input
                                    type="text"
                                    className={`border border-gray-300 p-2 w-full rounded-lg ${
                                        errors.weightName ? 'border-red-500' : ''
                                    }`}
                                    {...register('weightName', { required: true })}
                                />
                                {errors.weightName && (
                                    <span className="text-red-500">Tên trọng lượng là bắt buộc.</span>
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
                                    onClick={() => setShowAddWeightModal(false)}
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

            {showImageModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
                        <h3 className="text-lg font-bold mb-4">Chọn ảnh</h3>
                        <input type="file" multiple onChange={handleAddImage} />
                        <div className="mt-4">
                            {imageList.map((image, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedImages.includes(image)}
                                        onChange={() => handleSelectImage(image)}
                                    />
                                    <img src={image} alt="preview" className="w-20 h-20 object-cover ml-2" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowImageModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleSaveImages} // Không cần truyền index nữa
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

export default AddProduct;
