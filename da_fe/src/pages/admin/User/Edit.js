import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from "axios";

function EditUser() {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState('');
    const { id } = useParams();

    const [formData, setFormData] = useState({
        hoTen: '',
        sdt: '',
        email: '',
        gioiTinh: 0,
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

    const getDiaChilenForm = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/dia-chi/tai-khoan/${id}`);
            const data = response.data[0];

            if (!data) throw new Error('Không tìm thấy thông tin địa chỉ');

            // Cập nhật giá trị tỉnh, huyện, xã
            setSelectedProvince(data.idTinh || '');
            setSelectedDistrict(data.idHuyen || '');
            setSelectedWard(data.idXa || '');

            // Gọi API phụ để cập nhật danh sách huyện và xã
            if (data.idTinh) await fetchDistricts(data.idTinh);
            if (data.idHuyen) await fetchWards(data.idHuyen);

            // Cập nhật thông tin địa chỉ chi tiết
            setDiaChiData({
                diaChiCuThe: data.diaChiCuThe || '',
                idTinh: data.idTinh || '',
                idHuyen: data.idHuyen || '',
                idXa: data.idXa || '',
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi tải thông tin địa chỉ! ' + error.message,
            });
        }
    };

    useEffect(() => {
        if (id) {
            getDiaChilenForm(id);
        }
    }, [id]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [userResponse, addressResponse] = await Promise.all([
                    fetch(`http://localhost:8080/api/tai-khoan/${id}`),
                    fetch(`http://localhost:8080/api/dia-chi/tai-khoan/${id}`)
                ]);

                const userData = await userResponse.json();
                const addressData = await addressResponse.json();

                // Cập nhật thông tin người dùng
                setFormData(userData);

                // Cập nhật địa chỉ
                if (addressData && addressData.length > 0) {
                    const address = addressData[0];
                    setDiaChiData({
                        diaChiCuThe: address.diaChiCuThe || '',
                        idTinh: address.idTinh || '',
                        idHuyen: address.idHuyen || '',
                        idXa: address.idXa || '',
                    });

                    // Thiết lập các dropdown địa chỉ
                    setSelectedProvince(address.idTinh || '');

                    // Fetch districts nếu có tỉnh
                    if (address.idTinh) {
                        const districtResponse = await fetch(`https://provinces.open-api.vn/api/p/${address.idTinh}?depth=2`);
                        const districtData = await districtResponse.json();
                        setDistricts(districtData.districts || []);
                        setSelectedDistrict(address.idHuyen || '');

                        // Fetch wards nếu có huyện
                        if (address.idHuyen) {
                            const wardResponse = await fetch(`https://provinces.open-api.vn/api/d/${address.idHuyen}?depth=2`);
                            const wardData = await wardResponse.json();
                            setWards(wardData.wards || []);
                            setSelectedWard(address.idXa || '');
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi tải dữ liệu! ' + error.message,
                });
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                const data = await response.json();
                setProvinces(data || []);
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi tải danh sách tỉnh/thành!',
                });
            }
        };
        fetchProvinces();
    }, []);

// Hàm để lấy danh sách huyện
    const fetchDistricts = async (provinceId) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
            const data = await response.json();
            setDistricts(data.districts || []);
            setSelectedDistrict(''); // Reset huyện khi tỉnh thay đổi
            setSelectedWard('');    // Reset xã khi tỉnh thay đổi
        } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
        }
    };

    useEffect(() => {
        if (selectedProvince) {
            fetchDistricts(selectedProvince);
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);


    const fetchWards = async (districtId) => {
        try {
            // Kiểm tra districtId hợp lệ
            if (!districtId) {
                console.warn('District ID is empty');
                setWards([]);
                return;
            }

            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);

            // Kiểm tra response
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Kiểm tra dữ liệu trả về
            if (!data || !data.wards) {
                console.warn('No wards data found', data);
                setWards([]);
                return;
            }

            // Đảm bảo dữ liệu ward hợp lệ
            const validWards = data.wards.filter(ward =>
                ward && ward.code && ward.name
            );

            setWards(validWards);

            // Reset ward nếu không có ward nào
            if (validWards.length === 0) {
                setSelectedWard('');
            }
        } catch (error) {
            console.error('Error fetching wards:', error);
            setWards([]);
            setSelectedWard('');
        }
    };

// Useeffect để fetch wards
    useEffect(() => {
        const safelyFetchWards = async () => {
            if (selectedDistrict) {
                try {
                    await fetchWards(selectedDistrict);
                } catch (error) {
                    console.error('Error in useEffect fetchWards:', error);
                }
            } else {
                setWards([]);
                setSelectedWard('');
            }
        };

        safelyFetchWards();
    }, [selectedDistrict]);


    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

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

    // const handleUpdateUser = async (e) => {
    //     e.preventDefault();
    //     setError('');
    //
    //     try {
    //         // Update user account
    //         const userResponse = await fetch(`http://localhost:8080/api/tai-khoan/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(formData),
    //         });
    //
    //         if (!userResponse.ok) {
    //             const errorText = await userResponse.text();
    //             throw new Error(`Failed to update user account: ${errorText}`);
    //         }
    //
    //         // Update address
    //         const diaChiPayload = {
    //             taiKhoan: { id: id },
    //             ten: formData.hoTen,
    //             sdt: formData.sdt,
    //             idTinh: diaChiData.idTinh,
    //             idHuyen: diaChiData.idHuyen,
    //             idXa: selectedWard,
    //             diaChiCuThe: diaChiData.diaChiCuThe,
    //         };
    //
    //         const addressResponse = await fetch(`http://localhost:8080/api/dia-chi/tai-khoan/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(diaChiPayload),
    //         });
    //
    //         if (!addressResponse.ok) {
    //             const errorText = await addressResponse.text();
    //             throw new Error(`Failed to update address: ${errorText}`);
    //         }
    //
    //         // Chỉ hiển thị thông báo thành công nếu cả hai request đều thành công
    //         await Promise.all([userResponse, addressResponse]);
    //
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Thành công!',
    //             text: 'Cập nhật nhân viên thành công!',
    //         });
    //     } catch (error) {
    //         console.error('Error:', error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Lỗi!',
    //             text: 'Có lỗi xảy ra khi cập nhật nhân viên! Vui lòng kiểm tra lại thông tin.',
    //         });
    //     }
    // };

    // const handleUpdateUser = async (e) => {
    //     e.preventDefault();
    //     setError('');
    //
    //     try {
    //         // Update user account
    //         const userResponse = await fetch(`http://localhost:8080/api/tai-khoan/update/${id}`, {
    //             method: 'PUT',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(formData),
    //         });
    //
    //         if (!userResponse.ok) {
    //             const errorText = await userResponse.text();
    //             throw new Error(`Failed to update user account: ${errorText}`);
    //         }
    //
    //         // Update address
    //         const diaChiPayload = {
    //             taiKhoan: { id: id },
    //             ten: formData.hoTen,
    //             sdt: formData.sdt,
    //             idTinh: diaChiData.idTinh,
    //             idHuyen: diaChiData.idHuyen,
    //             idXa: selectedWard,
    //             diaChiCuThe: diaChiData.diaChiCuThe,
    //         };
    //
    //         const addressResponse = await fetch(`http://localhost:8080/api/dia-chi/update/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(diaChiPayload),
    //         });
    //
    //         if (!addressResponse.ok) {
    //             const errorText = await addressResponse.text();
    //             throw new Error(`Failed to update address: ${errorText}`);
    //         }
    //
    //         // Chỉ hiển thị thông báo thành công nếu cả hai request đều thành công
    //         await Promise.all([userResponse, addressResponse]);
    //
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Thành công!',
    //             text: 'Cập nhật nhân viên thành công!',
    //         });
    //     } catch (error) {
    //         console.error('Error:', error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Lỗi!',
    //             text: 'Có lỗi xảy ra khi cập nhật nhân viên! Vui lòng kiểm tra lại thông tin.',
    //         });
    //     }
    // };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Update user account
            const userResponse = await fetch(`http://localhost:8080/api/tai-khoan/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                throw new Error(`Failed to update user account: ${errorText}`);
            }

            // Update address
            const diaChiPayload = {
                taiKhoan: {
                    id: id  // Đảm bảo truyền đúng ID tài khoản
                },
                ten: formData.hoTen,
                sdt: formData.sdt,
                idTinh: diaChiData.idTinh,
                idHuyen: diaChiData.idHuyen,
                idXa: selectedWard,
                diaChiCuThe: diaChiData.diaChiCuThe,
            };

            console.log('DiaChi Payload:', diaChiPayload); // Log payload để kiểm tra

            const addressResponse = await fetch(`http://localhost:8080/api/dia-chi/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(diaChiPayload),
            });

            if (!addressResponse.ok) {
                const errorText = await addressResponse.text();
                throw new Error(`Failed to update address: ${errorText}`);
            }

            // Kiểm tra response
            const responseData = await addressResponse.json();
            console.log('Address Update Response:', responseData);

            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Cập nhật nhân viên thành công!',
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error.message || 'Có lỗi xảy ra khi cập nhật nhân viên!',
            });
        }
    };

    return (
        <div className="p-8 flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-5xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">Chỉnh sửa thông tin nhân viên</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
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
                                    value={formData.hoTen}
                                    placeholder="Nhập họ và tên"
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
                                    value={formData.email}
                                    placeholder="Nhập email"
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Giới tính
                                </label>
                                <div className="flex gap-4 p-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gioiTinh"
                                            value={0}
                                            checked={formData.gioiTinh === 0}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                gioiTinh: parseInt(e.target.value)
                                            })}
                                            className="mr-2"
                                        />
                                        Nam
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gioiTinh"
                                            value={1}
                                            checked={formData.gioiTinh === 1}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                gioiTinh: parseInt(e.target.value)
                                            })}
                                            className="mr-2"
                                        />
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
                                    value={formData.ngaySinh}
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={(e) => setFormData({...formData, ngaySinh: e.target.value})}
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
                                    value={formData.cccd}
                                    placeholder="Nhập số CCCD"
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Số Điện Thoại
                                </label>
                                <input
                                    type="text"
                                    name="sdt"
                                    value={formData.sdt}
                                    placeholder="Nhập số điện thoại"
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
                                    value={selectedProvince}
                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                >
                                    <option value="">Chọn tỉnh/thành</option>
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
                                    value={selectedDistrict}
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

                            {/* Xã/Phường */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Xã/Phường
                                </label>
                                <select
                                    value={selectedWard}
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

                            {/* Địa chỉ cụ thể */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-500">*</span> Địa chỉ cụ thể
                                </label>
                                <input
                                    type="text"
                                    value={diaChiData.diaChiCuThe}
                                    placeholder="Nhập địa chỉ cụ thể"
                                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={(e) =>
                                        setDiaChiData((prev) => ({ ...prev, diaChiCuThe: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        {/* Nút Cập nhật */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleUpdateUser}
                                className="bg-[#2f19ae] text-white px-8 py-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditUser;
