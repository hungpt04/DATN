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
    const [description, setDescription] = useState('');
    const [variants, setVariants] = useState([
        { id: 1, name: '', quantity: '', weight: '', price: '', selected: false },
    ]);

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
                        <button
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
                        <button
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
                            <th className="p-1 text-sm w-[250px]">Tên sản phẩm</th>{' '}
                            {/* Tăng chiều rộng cho cột Tên sản phẩm */}
                            <th className="p-4 text-sm w-[100px]">Số lượng</th> {/* Giảm chiều rộng cho cột Số lượng */}
                            <th className="p-1 text-sm w-[100px]">Trọng lượng</th>{' '}
                            {/* Giảm chiều rộng cho cột Trọng lượng */}
                            <th className="p-1 text-sm w-[100px]">Giá</th>
                            <th className="p-1 text-sm">Hành động</th>
                            <th className="p-1 text-sm w-[150px]">Ảnh</th> {/* Điều chỉnh chiều rộng cho cột Ảnh */}
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
                                <td className="p-1 text-sm">
                                    <input
                                        type="text"
                                        value={variant.name}
                                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                        className="border border-gray-300 rounded-md p-0.5 text-xs w-full"
                                    />
                                </td>
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
                                        type="text"
                                        value={variant.weight}
                                        onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
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
                                    <button
                                        onClick={() => document.getElementById(`fileInput${index}`).click()}
                                        className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs"
                                    >
                                        Chọn ảnh
                                    </button>
                                    <input
                                        type="file"
                                        id={`fileInput${index}`}
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, index)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="button" onClick={handleAddVariant} className="text-blue-600 hover:underline mt-4">
                    Thêm biến thể
                </button>

                <div className="mt-6">
                    <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2">
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
                                    Hủy
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
                                    Hủy
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
                                    Hủy
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
                                    Hủy
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

export default AddProduct;