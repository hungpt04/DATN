import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function EditCustomer() {
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [diaChi, setDiaChi] = useState([])
    const { id } = useParams();

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
        idTaiKhoan: id,
    });

    const loadDiaChi = (id) => {
        axios
            .get(`http://localhost:8080/api/dia-chi/getAllDiaChi`, {
                params: { idTaiKhoan: id },
            })
            .then((response) => {
                setDiaChi(response.data.content);
            })
            .catch((error) => {
                console.error("Lỗi khi gọi API:", error);
            });
    };

    useEffect(() => {
        if (id) {
            loadDiaChi(id);
        }
    }, [id]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [userResponse, addressResponse] = await Promise.all([fetch(`http://localhost:8080/api/tai-khoan/${id}`), fetch(`http://localhost:8080/api/dia-chi/tai-khoan/${id}`)]);

                const userData = await userResponse.json();
                const addressData = await addressResponse.json();

                // Cập nhật thông tin người dùng
                setFormData(userData);

                console.log(formData.avatar)

                // Thêm đoạn code này để hiển thị ảnh
                if (userData.avatar) {
                    setPreviewImage(userData.avatar);
                }

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
                    icon: 'error', title: 'Lỗi!', text: 'Có lỗi xảy ra khi tải dữ liệu! ' + error.message,
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
                    icon: 'error', title: 'Lỗi!', text: 'Có lỗi xảy ra khi tải danh sách tỉnh/thành!',
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
            const validWards = data.wards.filter(ward => ward && ward.code && ward.name);

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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

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

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        try {
            // Lấy ID địa chỉ trước tiên
            const getAddressIdResponse = await fetch(`http://localhost:8080/api/dia-chi/get-id-dia-chi-by-id-tai-khoan/${id}`);

            if (!getAddressIdResponse.ok) {
                throw new Error('Không thể lấy ID địa chỉ');
            }

            const addressId = await getAddressIdResponse.json(); // Lấy ID địa chỉ

            // Tạo FormData         
            const formDataToSend = new FormData();

            // Thêm các trường thông tin
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

            // Update user account
            const userResponse = await fetch(`http://localhost:8080/api/tai-khoan/updateTaiKhoan/${id}`, {
                method: 'PUT', body: formDataToSend
            });

            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                throw new Error(`Failed to update user account: ${errorText}`);
            }

            // Update address
            const diaChiPayload = {
                id: addressId, // Sử dụng ID địa chỉ đã lấy được
                taiKhoan: {
                    id: id  // This should be the user/customer account ID
                },
                ten: formData.hoTen,
                sdt: formData.sdt,
                idTinh: diaChiData.idTinh,
                idHuyen: diaChiData.idHuyen,
                idXa: selectedWard,
                diaChiCuThe: diaChiData.diaChiCuThe,
            };

            console.log('DiaChi Payload:', diaChiPayload); // Log payload để kiểm tra

            const addressResponse = await fetch(`http://localhost:8080/api/dia-chi/update/${addressId}`, {
                method: 'PUT', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(diaChiPayload),
            });

            if (!addressResponse.ok) {
                const errorText = await addressResponse.text();
                throw new Error(`Failed to update address: ${errorText}`);
            }

            // Kiểm tra response
            const responseData = await addressResponse.json();
            console.log('Address Update Response:', responseData);

            Swal.fire({
                icon: 'success', title: 'Thành công!', text: 'Cập nhật khách hàng thành công!',
            }).then(() => {
                navigate('/admin/tai-khoan/khach-hang');
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error', title: 'Lỗi!', text: error.message || 'Có lỗi xảy ra khi cập nhật khách hàng!',
            });
        }
    };

    const handleNavigateToSale = () => {
        navigate('/admin/tai-khoan/khach-hang');
    };

    return (<div>
        <div className="font-bold text-sm">
            <span
                className="cursor-pointer"
                onClick={handleNavigateToSale}
            >
                Khách hàng
            </span>
            <span className="text-gray-400 ml-2">/ Chỉnh sửa khách hàng</span>
        </div>
        <div className="bg-white p-4 rounded-md shadow-lg">
            <div className='flex'>
                <div className="w-1/4 pr-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-8">Thông tin khách hàng</h2>
                    <hr />
                    {/* Ảnh đại diện */}
                    <div className="flex justify-center items-center mt-4">
                        <label className="cursor-pointer">
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            <div
                                className="w-32 h-32 border-4 border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 overflow-hidden">
                                {previewImage ? (<img src={previewImage || formData.avatar} alt="Preview"
                                    className="w-full h-full object-cover" />) : ('Chọn ảnh')}
                            </div>
                        </label>
                    </div>
                    {/* Họ và tên */}
                    <div className="col-span-2 mt-4">
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

                    <div className="col-span-2 mt-4">
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

                    <div className="col-span-2 mt-4">
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

                    <div className="col-span-2 mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            <span className="text-red-500">*</span> Ngày sinh
                        </label>
                        <input
                            type="date"
                            name="ngaySinh"
                            value={formData.ngaySinh}
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
                                    name="gioiTinh"
                                    value={0}
                                    checked={formData.gioiTinh === 0}
                                    onChange={(e) => setFormData({
                                        ...formData, gioiTinh: parseInt(e.target.value)
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
                                        ...formData, gioiTinh: parseInt(e.target.value)
                                    })}
                                    className="mr-2"
                                />
                                Nữ
                            </label>
                        </div>
                    </div>

                    {/* Nút Cập Nhật */}
                    <div className="mt-8 flex">
                        <button
                            onClick={handleUpdateCustomer}
                            className="bg-[#2f19ae] text-white px-8 py-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>

                <div className="w-3/4 pl-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-8">Danh sách địa chỉ</h2>
                    <hr />
                    {diaChi.map((item, index) => {
                        return (
                            <div key={index} className="mb-4 mt-6 border border-gray-300 rounded-lg shadow-md">
                                <div className="p-4 rounded-t-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold">Địa chỉ {index + 1}</span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                <span className="text-red-500">*</span>Tên
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                name="name"
                                                value={item.ten}
                                                onChange={(e) => {
                                                    const updatedDiaChi = [...diaChi]
                                                    updatedDiaChi[index].ten = e.target.value
                                                    setDiaChi(updatedDiaChi)
                                                }}
                                            />

                                        </div>

                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                <span className="text-red-500">*</span>Số điện thoại
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                name="phoneNumber"
                                                value={item.sdt}
                                                onChange={(e) => {
                                                    const updatedDiaChi = [...diaChi]
                                                    updatedDiaChi[index].sdt = e.target.value
                                                    setDiaChi(updatedDiaChi)
                                                }}
                                            />

                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                <span className="text-red-500">*</span>Tỉnh/thành phố
                                            </label>
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                value={item.idTinh}
                                            // onChange={(e) => handleTinhChange(e.target.value, index)}
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
                                                <span className="text-red-500">*</span>Quận/huyện
                                            </label>
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                value={item.idHuyen}
                                            // onChange={(e) => handleHuyenChange(e.target.value, index)}
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
                                                <span className="text-red-500">*</span>Xã/phường/thị trấn
                                            </label>
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                value={item.idXa}
                                            // onChange={(e) => handleXaChange(e.target.value, index)}
                                            
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

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            <span className="text-red-500">*</span>Địa chỉ cụ thể
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                            name="specificAddress"
                                            value={item.diaChiCuThe}
                                            onChange={(e) => {
                                                const updatedDiaChi = [...diaChi]
                                                updatedDiaChi[index].diaChiCuThe = e.target.value
                                                setDiaChi(updatedDiaChi)
                                            }}
                                        />

                                    </div>

                                    <div className="mt-4 flex justify-between w-full">
                                        <button
                                            // onClick={() => handleUpdateType(item.id)}
                                            className="mr-2 text-3xl text-yellow-500 hover:text-yellow-600"
                                            disabled={item.loai === 0}
                                        >
                                            {item.loai === 0 ? "★" : "☆"}
                                        </button>

                                        <div className="flex justify-end">
                                            {item.loai === null ? (
                                                <button
                                                    // onClick={() => onUpdateDiaChi(item)}
                                                    className="ml-4 text-green-500 hover:text-green-600"
                                                >
                                                    <AddIcon />
                                                </button>
                                            ) : (
                                                <button
                                                    // onClick={() => onUpdateDiaChi(item)}
                                                    className="ml-4 text-blue-500 hover:text-blue-600"
                                                >
                                                    <EditIcon />
                                                </button>
                                            )}

                                            <button
                                                // onClick={() => deleteDiaChi(item.id)}
                                                className="ml-4 text-red-500 hover:text-red-600"
                                                disabled={item.type === 0}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>);
}

export default EditCustomer;
