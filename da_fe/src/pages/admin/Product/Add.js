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
    const [variants, setVariants] = useState([
        { id: 1, name: '', quantity: '', weight: '', price: '', selected: false },
    ]);

    const [imageList, setImageList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentVariantIndex, setCurrentVariantIndex] = useState(null);

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

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleAddVariant = () => {
        setVariants([
            ...variants,
            { id: variants.length + 1, name: '', quantity: '', weight: '', price: '', selected: false },
        ]);
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0]; // Lấy file đầu tiên từ input
        const newVariants = [...variants];
        newVariants[index].file = file; // Cập nhật file đã chọn vào variant tương ứng
        setVariants(newVariants); // Cập nhật state variants
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
            reset(); // Reset form values after adding
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
            reset(); // Reset form values after adding
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
            reset(); // Reset form values after adding
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
            reset(); // Reset form values after adding
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
            reset(); // Reset form values after adding
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
            reset(); // Reset form values after adding
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm Trọng lượng!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm Trọng lượng!', 'error');
        }
    };

    const handleAddBrandModal = () => {
        reset(); // Reset the form values and errors
        setShowBrandModal(true);
    };

    const handleAddMaterialModal = () => {
        reset(); // Reset the form values and errors
        setShowMaterialModal(true);
    };

    const handleAddBalanceModal = () => {
        reset(); // Reset the form values and errors
        setShowBalanceModal(true);
    };

    const handleAddStiffModal = () => {
        reset(); // Reset the form values and errors
        setShowStiffModal(true);
    };

    const handleColorModal = () => {
        reset(); // Reset the form values and errors
        setShowColorModal(true);
    };

    const handleWeightModal = () => {
        reset(); // Reset the form values and errors
        setShowWeightModal(true);
    };

    const handleAddColorModal = () => {
        reset(); // Reset the form values and errors
        setShowAddColorModal(true);
    };

    const handleAddWeightModal = () => {
        reset(); // Reset the form values and errors
        setShowAddWeightModal(true);
    };

    const handleImageModal = (index) => {
        setCurrentVariantIndex(index); // Lưu chỉ số biến thể hiện tại
        setShowImageModal(true);
        setSelectedImages(variants[index].images || []);
    };

    const handleAddImage = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => URL.createObjectURL(file));
        setImageList((prev) => [...prev, ...newImages]);
    };

    const handleSelectImage = (image) => {
        if (selectedImages.includes(image)) {
            setSelectedImages(selectedImages.filter((img) => img !== image));
        } else {
            setSelectedImages([...selectedImages, image]);
        }
    };

    const handleSaveImages = () => {
        if (currentVariantIndex !== null) {
            const newVariants = [...variants];
            newVariants[currentVariantIndex].images = selectedImages;
            setVariants(newVariants);
            setShowImageModal(false);
        }
    };

    const createVariants = () => {
        const newVariants = [];
        selectedColors.forEach((color) => {
            selectedWeights.forEach((weight) => {
                newVariants.push({
                    id: newVariants.length + 1,
                    name: `${productName} - ${color} - ${weight}`,
                    quantity: '',
                    weight: weight,
                    price: '',
                    selected: false,
                });
            });
        });
        setVariants(newVariants);
    };

    useEffect(() => {
        if (selectedColors.length > 0 && selectedWeights.length > 0) {
            createVariants();
        } else {
            setVariants([]); // Reset variants nếu không có màu sắc hoặc trọng lượng
        }
    }, [selectedColors, selectedWeights]);

    const handleAddProduct = async (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form

        // Tạo đối tượng sản phẩm chi tiết
        const newSanPhamCT = {
            sanPham: { id: 1 }, // Giả sử bạn đã có sản phẩm với ID = 1, bạn có thể thay đổi theo nhu cầu
            thuongHieu: { id: brand },
            mauSac: { id: material },
            chatLieu: { id: material }, // Nếu bạn muốn sử dụng biến chất liệu, hãy thay đổi thành biến đúng
            trongLuong: { id: material }, // Sử dụng biến đã định nghĩa
            diemCanBang: { id: balancePoint },
            doCung: { id: hardness },
            ma: `SPCT${variants.length + 1}`, // Tạo mã sản phẩm chi tiết
            soLuong: variants.reduce((total, variant) => total + parseInt(variant.quantity || 0, 10), 0), // Tổng số lượng
            donGia: calculateAveragePrice(variants), // Tính đơn giá trung bình
            moTa: description, // Mô tả sản phẩm
            trangThai: status === 'Active' ? 1 : 0, // Trạng thái sản phẩm chi tiết
        };

        console.log('newSanPhamCT:', newSanPhamCT); // Log đối tượng sản phẩm chi tiết

        try {
            const response = await axios.post('http://localhost:8080/api/san-pham-ct', newSanPhamCT);
            swal('Thành công!', 'Sản phẩm đã được thêm!', 'success');
            reset(); // Reset form values after adding
            setVariants([{ id: 1, name: '', quantity: '', weight: '', price: '', selected: false }]); // Reset variants
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm sản phẩm!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm sản phẩm!', 'error');
        }
    };

    // Hàm tính đơn giá trung bình
    const calculateAveragePrice = (variants) => {
        const totalQuantity = variants.reduce((total, variant) => total + parseInt(variant.quantity || 0, 10), 0);
        const totalPrice = variants.reduce(
            (total, variant) => total + (parseFloat(variant.price) || 0) * (parseInt(variant.quantity) || 0),
            0,
        );

        // Tránh chia cho 0
        return totalQuantity > 0 ? totalPrice / totalQuantity : 0;
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

                        {/* Render các button với màu đã chọn */}
                        {selectedColors.map((color, index) => (
                            <button
                                key={index}
                                className="border font-medium py-1 px-1 rounded ml-2 w-9 h-9"
                                style={{
                                    backgroundColor: color, // Màu nền là màu được chọn
                                    color: '#fff', // Chữ trắng để dễ đọc
                                    borderColor: color === 'white' ? '#000' : 'transparent', // Nếu là màu trắng, thêm viền đen
                                }}
                            ></button>
                        ))}

                        {/* Nút dấu + */}
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
                                    backgroundColor: 'black', // Màu nền là màu được chọn
                                    color: 'white', // Chữ trắng để dễ đọc
                                    borderColor: 'black', // Nếu là màu trắng, thêm viền đen
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

                <h3 className="text-lg font-semibold mb-2 mt-[120px]">Biến thể sản phẩm</h3>
                <table className="table-auto bg-white rounded-lg shadow-md w-[950px]">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-1 text-sm"></th>
                            <th className="p-1 text-sm">STT</th>
                            <th className="p-1 text-sm w-[250px]">Tên sản phẩm</th>
                            <th className="p-4 text-sm w-[100px]">Số lượng</th>
                            <th className="p-1 text-sm w-[100px]">Giá</th>
                            <th className="p-1 text-sm">Hành động</th>
                            <th className="p-1 text-sm w-[150px]">Ảnh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variants.map((variant, index) => (
                            <tr key={variant.id}>
                                <td className="p-1 text-sm text-center">
                                    <input
                                        type="checkbox"
                                        checked={variant.selected}
                                        onChange={() => {
                                            const newVariants = [...variants];
                                            newVariants[index].selected = !newVariants[index].selected;
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
                                        onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                                        className="border border-gray-300 rounded-md p-0.5 text-xs w-[60px]"
                                    />
                                </td>
                                <td className="p-1 text-sm text-center">
                                    <input
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                        className="border border-gray-300 rounded-md p-0.5 text-xs w-[80px]"
                                    />
                                </td>
                                <td className="p-1 text-sm text-center">
                                    <button className="text-red-600 hover:underline">Xóa</button>
                                </td>
                                <td className="p-1 text-sm text-center">
                                    {variant.images && variant.images.length > 0 ? (
                                        // Nếu đã có ảnh, hiển thị ảnh
                                        <div className="flex space-x-2 overflow-x-auto">
                                            {' '}
                                            {/* Sử dụng flex để sắp xếp ảnh theo chiều ngang */}
                                            {variant.images.map((img, imgIndex) => (
                                                <img
                                                    key={imgIndex}
                                                    src={img}
                                                    alt="variant"
                                                    className="w-20 h-20 object-cover" // Thay đổi kích thước ảnh ở đây
                                                />
                                            ))}
                                            {/* Nút "Chọn ảnh" sẽ được hiển thị bên cạnh ảnh cuối cùng */}
                                            <button
                                                onClick={() => handleImageModal(index)}
                                                type="button"
                                                className="flex flex-col items-center justify-center w-20 h-20 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium rounded"
                                            >
                                                <AddIcon />
                                                <span className="text-xs">Upload</span>
                                            </button>
                                        </div>
                                    ) : (
                                        // Nếu chưa có ảnh, hiển thị nút "Chọn ảnh"
                                        <button
                                            onClick={() => handleImageModal(index)}
                                            type="button"
                                            className="flex flex-col items-center justify-center w-20 h-20 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium rounded"
                                        >
                                            <AddIcon />
                                            <span className="text-xs">Upload</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="button" onClick={handleAddVariant} className="text-blue-600 hover:underline mt-4">
                    Thêm biến thể
                </button>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleAddProduct}
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
                                type="submit"
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
