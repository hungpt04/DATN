import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

function AddUser() {
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    // Form data states
    const [formData, setFormData] = useState({
        hoTen: '',
        sdt: '',
        email: '',
        matKhau: '123456', // Default password
        gioiTinh: 0, // Default gender to 0 (Nam)
        vaiTro: 'User',
        avatar: '',
        ngaySinh: '',
        cccd: '',
        trangThai: 1,
    });

    const [diaChiData, setDiaChiData] = useState({
        diaChiCuThe: '',
        idTinh: '',
        idHuyen: '',
        idXa: '',
    });

    useEffect(() => {
        // Fetch provinces when component mounts
        fetch('https://provinces.open-api.vn/api/p/')
            .then((response) => response.json())
            .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        // Fetch districts when province changes
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((response) => response.json())
                .then((data) => setDistricts(data.districts));
            setDiaChiData((prev) => ({ ...prev, idTinh: selectedProvince }));
        }
    }, [selectedProvince]);

    useEffect(() => {
        // Fetch wards when district changes
        if (selectedDistrict) {
            fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then((response) => response.json())
                .then((data) => setWards(data.wards));
            setDiaChiData((prev) => ({ ...prev, idHuyen: selectedDistrict }));
        }
    }, [selectedDistrict]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGenderChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            gioiTinh: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            // Convert to base64
            const reader2 = new FileReader();
            reader2.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    avatar: reader2.result,
                }));
            };
            reader2.readAsDataURL(file);
        }
    };

const handleAddUser = async (e) => {
    e.preventDefault();
    try {
        // Tạo tài khoản trước
        const taiKhoanResponse = await fetch('http://localhost:8080/api/tai-khoan/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!taiKhoanResponse.ok) {
            throw new Error('Failed to create user account');
        }

        const taiKhoan = await taiKhoanResponse.json();

        // Sau đó tạo địa chỉ với ID tài khoản vừa tạo
        const diaChiPayload = {
            taiKhoan: { id: taiKhoan.id },
            ten: formData.hoTen,
            sdt: formData.sdt,
            idTinh: diaChiData.idTinh,
            idHuyen: diaChiData.idHuyen,
            idXa: selectedWard,
            diaChiCuThe: diaChiData.diaChiCuThe,
        };

        const diaChiResponse = await fetch('http://localhost:8080/api/dia-chi/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(diaChiPayload),
        });

        if (!diaChiResponse.ok) {
            throw new Error('Failed to create address');
        }

        // Hiển thị thông báo thành công và điều hướng về trang khác
        swal({
            title: "Thành công!",
            text: "Thêm nhân viên thành công!",
            icon: "success",
            buttons: false,
            timer: 2000, // Tự động đóng sau 2 giây
        }).then(() => {
            navigate('/admin/tai-khoan/nhan-vien'); // Điều hướng về trang quản lý nhân viên
        });

    } catch (error) {
        console.error('Error:', error);

        // Hiển thị thông báo lỗi
        swal({
            title: "Lỗi!",
            text: "Có lỗi xảy ra khi thêm nhân viên!",
            icon: "error",
            button: "OK",
        });
    }
};


    // const handleAddUser = async (e) => {
    //     e.preventDefault();

    //     try {
    //         // First, create the user account
    //         const taiKhoanResponse = await fetch('http://localhost:8080/api/tai-khoan/add', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(formData),
    //         });

    //         if (!taiKhoanResponse.ok) {
    //             throw new Error('Failed to create user account');
    //         }

    //         const taiKhoan = await taiKhoanResponse.json();

    //         // Then create the address using the new user's ID
    //         const diaChiPayload = {
    //             taiKhoan: { id: taiKhoan.id },
    //             ten: formData.hoTen,
    //             sdt: formData.sdt,
    //             idTinh: diaChiData.idTinh,
    //             idHuyen: diaChiData.idHuyen,
    //             idXa: selectedWard,
    //             diaChiCuThe: diaChiData.diaChiCuThe,
    //         };

    //         const diaChiResponse = await fetch('http://localhost:8080/api/dia-chi/add', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(diaChiPayload),
    //         });

    //         if (!diaChiResponse.ok) {
    //             throw new Error('Failed to create address');
    //         }

    //         alert('Thêm nhân viên thành công!');
    //         // Reset form or redirect as needed
    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert('Có lỗi xảy ra khi thêm nhân viên!');
    //     }
    // };

    return (
        <div className="p-8 flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-5xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">Thông tin nhân viên</h2>
                <div className="flex flex-wrap">
                    {/* Ảnh đại diện */}
                    <div className="w-full md:w-1/3 flex flex-col items-center mb-8 md:mb-0">
                        <label className="cursor-pointer">
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            <div className="w-32 h-32 border-4 border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 overflow-hidden">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    'Chọn ảnh'
                                )}
                            </div>
                        </label>
                    </div>

                    {/* Form thông tin */}
                    <div className="w-full md:w-2/3 md:pl-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Họ và tên */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Họ Và Tên
                                </label>
                                <input
                                    type="text"
                                    name="hoTen"
                                    placeholder="Nhập họ và tên"
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Số CCCD */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Số CCCD
                                </label>
                                <input
                                    type="text"
                                    name="cccd"
                                    placeholder="Nhập số CCCD"
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Giới tính
                                </label>
                                <div className="mt-2 flex items-center gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="mr-2"
                                            onChange={() => handleGenderChange(0)}
                                        />{' '}
                                        Nam
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="mr-2"
                                            onChange={() => handleGenderChange(1)}
                                        />{' '}
                                        Nữ
                                    </label>
                                </div>
                            </div>

                            {/* Ngày sinh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    name="ngaySinh"
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Nhập email"
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Tỉnh/Thành phố */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Tỉnh/Thành phố
                                </label>
                                <select
                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.map((province) => (
                                        <option key={province.code} value={province.code}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quận/Huyện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Quận/Huyện
                                </label>
                                <select
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    disabled={!selectedProvince}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.code} value={district.code}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Xã/Phường/Thị trấn */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Xã/Phường/Thị trấn
                                </label>
                                <select
                                    onChange={(e) => setSelectedWard(e.target.value)}
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    disabled={!selectedDistrict}
                                >
                                    <option value="">Chọn xã/phường</option>
                                    {wards.map((ward) => (
                                        <option key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Số Điện Thoại
                                </label>
                                <input
                                    type="text"
                                    name="sdt"
                                    placeholder="Nhập số điện thoại"
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Địa chỉ cụ thể */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Địa chỉ cụ thể
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập địa chỉ cụ thể"
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={(e) =>
                                        setDiaChiData((prev) => ({ ...prev, diaChiCuThe: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        {/* Nút Thêm Nhân Viên */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleAddUser}
                                className="bg-[#2f19ae] text-white px-8 py-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                            >
                                Thêm Nhân Viên
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddUser;
