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

    const [formData, setFormData] = useState({
        ma: '',
        hoTen: '',
        sdt: '',
        email: '',
        gioiTinh: 0,
        vaiTro: 'User',
        avatar: null,
        ngaySinh: '',
        cccd: '',
        trangThai: 1,
    });

    const [diaChiData, setDiaChiData] = useState({
        ten: '',
        sdt: '',
        diaChiCuThe: '',
        idTinh: '',
        idHuyen: '',
        idXa: '',
        loai: '',
        idTaiKhoan: ''
    });

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then((response) => response.json())
            .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((response) => response.json())
                .then((data) => setDistricts(data.districts));
            setDiaChiData((prev) => ({ ...prev, idTinh: selectedProvince }));
        }
    }, [selectedProvince]);

    useEffect(() => {
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
            setFormData({ ...formData, avatar: file })
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewImage(reader.result)
            }
            reader.readAsDataURL(file);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        formDataToSend.append('hoTen', formData.hoTen);
        formDataToSend.append('sdt', formData.sdt);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('matKhau', formData.matKhau);
        formDataToSend.append('gioiTinh', formData.gioiTinh);
        formDataToSend.append('vaiTro', formData.vaiTro);
        formDataToSend.append('ngaySinh', formData.ngaySinh);
        formDataToSend.append('cccd', formData.cccd);
        formDataToSend.append('trangThai', formData.trangThai);

        if (formData.avatar) {
            formDataToSend.append('avatar', formData.avatar);
        }

        try {
            const taiKhoanResponse = await fetch('http://localhost:8080/api/nhan-vien/add', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!taiKhoanResponse.ok) {
                throw new Error('Failed to create user account');
            }

            const taiKhoanData = await taiKhoanResponse.json();
            const idTaiKhoan = taiKhoanData.id;

            const obj = {
                ten: diaChiData.ten,
                sdt: taiKhoanData.sdt,
                idTinh: diaChiData.idTinh,
                idHuyen: diaChiData.idHuyen,
                idXa: selectedWard,
                idTaiKhoan: idTaiKhoan,
                loai: 0,
                diaChiCuThe: diaChiData.diaChiCuThe,
            }

            const diaChiResponse = await fetch('http://localhost:8080/api/dia-chi/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            });

            if (!diaChiResponse.ok) {
                throw new Error('Failed to create address');
            }

            swal({
                title: "Thành công!",
                text: "Thêm nhân viên thành công!",
                icon: "success",
                buttons: false,
                timer: 2000,
            }).then(() => {
                navigate('/admin/tai-khoan/nhan-vien');
            });

        } catch (error) {
            console.error('Error:', error);
            swal({
                title: "Lỗi!",
                text: "Có lỗi xảy ra khi thêm nhân viên!",
                icon: "error",
                button: "OK",
            });
        };
    }

    const handleNavigateToSale = () => {
        navigate('/admin/tai-khoan/nhan-vien');
    };

    return (
        <div>
            <div className="font-bold text-sm">
                <span
                    className="cursor-pointer"
                    onClick={handleNavigateToSale}
                >
                    Nhân viên
                </span>
                <span className="text-gray-400 ml-2">/ Tạo nhân viên</span>
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg">
                <div className='flex'>
                    <div className="w-1/4 pr-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-8">Thông tin nhân viên</h2>
                        <hr />
                        {/* Ảnh đại diện */}
                        <div className="flex justify-center items-center mt-4">
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
                    </div>

                    <div className="w-3/4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-8">Thông tin chi tiết</h2>
                        <hr />

                        {/* Số CCCD và Giới tính */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
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
                        </div>
                        {/* Ngày sinh và Email */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
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
                        </div>
                        {/* Tỉnh/Thành phố, Quận/Huyện, Xã/Phường */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
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
                        </div>
                        {/* Số điện thoại và Địa chỉ cụ thể */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
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
                            <div>
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
                    </div>
                </div>
                {/* Nút Thêm Nhân Viên */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleAddUser}
                        className="hover:bg-gray-400 border border-gray-300 font-medium py-2 px-4 rounded"
                    >
                        Thêm Nhân Viên
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddUser;
