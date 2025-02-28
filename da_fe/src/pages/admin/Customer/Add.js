import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddCustomer() {
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        hoTen: '',
        sdt: '',
        email: '',
        gioiTinh: 0,
        vaiTro: 'Customer',
        avatar: null,
        ngaySinh: '',
        trangThai: 1,
    });

    const [diaChiData, setDiaChiData] = useState({
        ten: '',
        sdt: '',
        diaChiCuThe: '',
        idTinh: '',
        idHuyen: '',
        idXa: '',
        loai: 1,
        idTaiKhoan: '',
    });

    const validateData = async (data) => {
        const errors = {};
        // Lấy ngày hiện tại
        const currentDate = new Date();
        const minBirthYear = 1900;
        let check = 0;

        // validate họ tên
        if (!data.hoTen.trim()) {
            errors.hoTen = '*Bạn chưa nhập họ tên';
            check++;
        } else if (data.hoTen.trim().length > 100) {
            errors.hoTen = '*Họ tên không dài quá 100 ký tự';
            check++;
        } else {
            errors.hoTen = '';
        }

        // validate email
        if (!data.email.trim()) {
            errors.email = '*Bạn chưa nhập địa chỉ email';
            check++;
        } else if (!/\S+@\S+\.\S+/.test(data.email.trim())) {
            errors.email = '*Địa chỉ email không hợp lệ';
            check++;
        } else {
            // Kiểm tra email đã tồn tại
            // const emailExists = await checkMail(data.email);
            // if (emailExists) {
            //     errors.email = "*Email đã tồn tại trong hệ thống";
            //     check++;
            // }
        }

        // validate số điện thoại
        if (!data.sdt.trim()) {
            errors.sdt = '*Bạn chưa nhập số điện thoại';
            check++;
        } else {
            const phoneNumberRegex = /^(0[1-9][0-9]{8})$/;
            if (!phoneNumberRegex.test(data.sdt.trim())) {
                errors.sdt = '*Số điện thoại không hợp lệ';
                check++;
            } else {
                errors.sdt = '';
            }
        }

        // validate ngày sinh
        if (!data.ngaySinh) {
            errors.ngaySinh = '*Bạn chưa nhập ngày sinh';
            check++;
        } else {
            const ngaySinh = new Date(data.ngaySinh);
            if (isNaN(ngaySinh.getTime())) {
                errors.ngaySinh = '*Ngày sinh không hợp lệ';
                check++;
            } else if (ngaySinh.getFullYear() < minBirthYear) {
                errors.ngaySinh = '*Năm sinh không hợp lệ';
                check++;
            } else if (ngaySinh > currentDate) {
                errors.ngaySinh = '*Ngày sinh không hợp lệ';
                check++;
            }
        }

        // validate ngày sinh
        if (data.gioiTinh === null) {
            errors.gioiTinh = '*Bạn chưa chọn giới tính';
            check++;
        } else {
            errors.gioiTinh = '';
        }

        return { errors, check };
    };

    const validateAddress = (address) => {
        const errors = {};
        let check = 0;

        if (!address.idTinh) {
            errors.idTinh = '*Bạn chưa chọn tỉnh/ thành phố';
            check++;
        }

        if (!address.idHuyen) {
            errors.idHuyen = '*Bạn chưa chọn quận/ huyện';
            check++;
        }

        if (!address.idXa) {
            errors.idXa = '*Bạn chưa chọn xã/ phường';
            check++;
        }

        if (!address.diaChiCuThe.trim()) {
            errors.diaChiCuThe = '*Bạn chưa nhập địa chỉ cụ thể';
            check++;
        } else if (address.diaChiCuThe.length > 255) {
            errors.diaChiCuThe = '*Địa chỉ cụ thể không dài quá 255 ký tự';
        }

        return { errors, check };
    };

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
            setFormData({ ...formData, avatar: file });
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        // Validate thông tin cá nhân
        const { errors: personalErrors, check: personalCheck } = await validateData(formData);

        // Validate địa chỉ
        const { errors: addressErrors, check: addressCheck } = validateAddress({
            ...diaChiData,
            idTinh: selectedProvince,
            idHuyen: selectedDistrict,
            idXa: selectedWard,
        });

        // Kết hợp lỗi từ cả hai hàm kiểm tra
        const combinedErrors = { ...personalErrors, ...addressErrors };
        const totalCheck = personalCheck + addressCheck;

        if (totalCheck > 0) {
            setErrors(combinedErrors);
            console.log('Combined errors:', combinedErrors);
            return;
        }

        setErrors({});

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

        // Thêm avatar nếu có
        if (formData.avatar) {
            formDataToSend.append('avatar', formData.avatar);
        }

        try {
            const taiKhoanResponse = await fetch('http://localhost:8080/api/khach-hang/add', {
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
                loai: 1,
                diaChiCuThe: diaChiData.diaChiCuThe,
            };

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
                title: 'Thành công!',
                text: 'Thêm khách hàng thành công!',
                icon: 'success',
                buttons: false,
                timer: 2000,
            }).then(() => {
                navigate('/admin/tai-khoan/khach-hang');
            });
        } catch (error) {
            console.error('Error:', error);

            swal({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi thêm khách hàng!',
                icon: 'error',
                button: 'OK',
            });
        }
    };

    const handleNavigateToSale = () => {
        navigate('/admin/tai-khoan/khach-hang');
    };

    return (
        <div>
            <div className="font-bold text-sm">
                <span className="cursor-pointer" onClick={handleNavigateToSale}>
                    Khách hàng
                </span>
                <span className="text-gray-400 ml-2">/ Tạo khách hàng</span>
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg">
                <div className="flex">
                    <div className="w-1/4 pr-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-5">Thông tin khách hàng</h2>
                        <hr />
                        {/* Ảnh đại diện */}
                        <div className="flex justify-center items-center mt-4">
                            <label className="cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 overflow-hidden">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        'Chọn ảnh'
                                    )}
                                </div>
                            </label>
                        </div>
                        {/* Họ và tên */}
                        <div className="col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Họ Và Tên</label>
                            <input
                                type="text"
                                name="hoTen"
                                placeholder="Nhập họ và tên"
                                className={`w-full p-3 border-2 border-gray-300 rounded outline-blue-500 ${
                                    errors.hoTen ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setErrors({ ...errors, hoTen: '' });
                                }}
                            />
                            {errors.hoTen && (
                                <p className="text-sm" style={{ color: 'red' }}>
                                    {errors.hoTen}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked
                                        className={`mr-2 ${
                                            errors.gioiTinh ? 'border-red-500 hover:border-red-600' : ''
                                        }`}
                                        onChange={() => {
                                            handleGenderChange(0);
                                            setErrors({ ...errors, gioiTinh: '' });
                                        }}
                                    />{' '}
                                    Nam
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        className={`mr-2 ${
                                            errors.gioiTinh ? 'border-red-500 hover:border-red-600' : ''
                                        }`}
                                        onChange={() => {
                                            handleGenderChange(1);
                                            setErrors({ ...errors, gioiTinh: '' });
                                        }}
                                    />{' '}
                                    Nữ
                                </label>
                            </div>
                            {errors.gioiTinh && (
                                <p className="text-sm" style={{ color: 'red' }}>
                                    {errors.gioiTinh}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="w-3/4 pl-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-5">Thông tin chi tiết</h2>
                        <hr />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Nhập email"
                                    className={`w-full p-3 border-2 border-gray-300 rounded outline-blue-500 ${
                                        errors.email ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                    }`}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setErrors({ ...errors, email: '' });
                                    }}
                                />
                                {errors.email && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
                                <input
                                    type="text"
                                    name="sdt"
                                    placeholder="Nhập số điện thoại"
                                    className={`w-full p-3 border-2 border-gray-300 rounded outline-blue-500 ${
                                        errors.sdt ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                    }`}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setErrors({ ...errors, sdt: '' });
                                    }}
                                />
                                {errors.sdt && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.sdt}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                                <select
                                    onChange={(e) => {
                                        setSelectedProvince(e.target.value);
                                        setErrors({ ...errors, idTinh: '' });
                                    }}
                                    className={`w-full p-3 border-2 border-gray-300 rounded outline-blue-500 ${
                                        errors.idTinh ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                    }`}
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.map((province) => (
                                        <option key={province.code} value={province.code}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.idTinh && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.idTinh}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
                                <select
                                    onChange={(e) => {
                                        setSelectedDistrict(e.target.value);
                                        setErrors({ ...errors, idHuyen: '' });
                                    }}
                                    className={`w-full p-3 border-2 border-gray-300 rounded outline-blue-500 ${
                                        errors.idHuyen ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                    }`}
                                    disabled={!selectedProvince}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.code} value={district.code}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.idHuyen && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.idHuyen}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Xã/Phường/Thị trấn</label>
                                <select
                                    onChange={(e) => {
                                        setSelectedWard(e.target.value);
                                        setErrors({ ...errors, idXa: '' });
                                    }}
                                    className={`w-full p-3 border-2 border-gray-300 rounded outline-blue-500 ${
                                        errors.idXa ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                    }`}
                                    disabled={!selectedDistrict}
                                >
                                    <option value="">Chọn xã/phường</option>
                                    {wards.map((ward) => (
                                        <option key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.idXa && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.idXa}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="ngaySinh"
                                    className={`w-full p-3 border-2 border-gray-300 rounded outline-blue-500 ${
                                        errors.ngaySinh ? 'border-red-600 hover:border-red-600 outline-red-500' : ''
                                    }`}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setErrors({ ...errors, ngaySinh: '' });
                                    }}
                                />
                                {errors.ngaySinh && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.ngaySinh}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ cụ thể</label>
                                <input
                                    type="text"
                                    placeholder="Nhập địa chỉ cụ thể"
                                    className={`w-full p-3 border-2 border-gray-300 rounded outline-blue-500 ${
                                        errors.diaChiCuThe ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                    }`}
                                    onChange={(e) => {
                                        setDiaChiData((prev) => ({ ...prev, diaChiCuThe: e.target.value }));
                                        setErrors({ ...errors, diaChiCuThe: '' });
                                    }}
                                />
                                {errors.diaChiCuThe && (
                                    <p className="text-sm" style={{ color: 'red' }}>
                                        {errors.diaChiCuThe}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút Thêm Nhân Viên */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleAddUser}
                        className="hover:bg-gray-300 border border-gray-300 font-medium py-2 px-4 rounded-sm"
                    >
                        Thêm khách hàng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCustomer;
