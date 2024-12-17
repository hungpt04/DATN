import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

function EditCustomer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const [previewImage, setPreviewImage] = useState(null);
    const [diaChi, setDiaChi] = useState([]);
    const [isAddingDiaChi, setIsAddingDiaChi] = useState(false);
    const [initPage, setInitPage] = useState(1);

    const handleNavigateToSale = () => {
        navigate('/admin/tai-khoan/khach-hang');
    };

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

    const [formErrors, setFormErrors] = useState({});
    const [addressErrors, setAddressErrors] = useState({});

    const validateData = (data) => {
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
            errors.email = '';
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

                errors.ngaySinh = '*Ngày sinh không được lớn hơn ngày hiện tại';

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

        if (!address.ten.trim()) {
            errors.ten = '*Bạn chưa nhập họ tên';
            check++;
        } else if (address.ten.length > 100) {
            errors.ten = '*Họ tên không dài quá 100 ký tự';
            check++;
        } else {
            const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (specialCharsRegex.test(address.ten)) {
                errors.ten = '*Họ tên không chứa ký tự đặc biệt';
                check++;
            } else {
                errors.ten = '';
            }
        }

        if (!address.sdt.trim()) {
            errors.sdt = '*Bạn chưa nhập số điện thoại';
            check++;
        } else {
            const phoneNumberRegex = /^(0[1-9][0-9]{8})$/;
            if (!phoneNumberRegex.test(address.sdt.trim())) {
                errors.sdt = '*Số điện thoại không hợp lệ';
                check++;
            } else {
                errors.sdt = '';
            }
        }

        if (!selectedProvince) {
            errors.idTinh = '*Bạn chưa chọn tỉnh/ thành phố';
            check++;
        }

        if (!selectedDistrict) {
            errors.idHuyen = '*Bạn chưa chọn quận/ huyện';
            check++;
        }

        if (!selectedWard) {
            errors.idXa = '*Bạn chưa chọn xã/ phường';
            check++;
        }

        if (!address.diaChiCuThe.trim()) {
            errors.diaChiCuThe = '*Bạn chưa nhập địa chỉ cụ thể';
            check++;
        } else if (address.diaChiCuThe.length > 255) {
            errors.diaChiCuThe = '*Địa chỉ cụ thể không dài quá 255 ký tự';
        } else {
            errors.diaChiCuThe = '';
        }

        return { errors, check };
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                const data = await response.json();
                setProvinces(data || []);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetchDistricts(selectedProvince).then((districts) => {
                setDistricts(districts);

                if (districts.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Thông báo',
                        text: 'Không tìm thấy quận/huyện cho tỉnh này',
                    });
                }
            });
        } else {
            setDistricts([]);
            setSelectedDistrict('');
            setSelectedWard('');
        }
    }, [selectedProvince]);

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
            if (!response.ok) {
                throw new Error('Không tìm thấy quận/huyện');
            }
            const data = await response.json();
            console.log('Districts data: ', data.districts);

            const validDistricts = data.districts
                ? data.districts.filter((district) => district && district.code && district.name)
                : [];
            return validDistricts;
        } catch (error) {
            console.error('Error fetching districts:', error);
            return [];
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);
            if (!response.ok) {
                throw new Error('Không thể tải xã/phường');
            }
            const data = await response.json();

            const validWards = data.wards ? data.wards.filter((ward) => ward && ward.code && ward.name) : [];

            return validWards;
        } catch (error) {
            console.error('Error fetching wards:', error);
            return [];
        }
    };

    useEffect(() => {
        if (selectedDistrict) {
            fetchWards(selectedDistrict).then((wards) => {
                setWards(wards);
                if (wards.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Thông báo',
                        text: 'Không tìm thấy xã/phường cho quận/huyện này',
                    });
                }
            });
        } else {
            setWards([]);
            setSelectedWard('');
        }
    }, [selectedDistrict]);

    const loadData = (id) => {
        axios
            .get(`http://localhost:8080/api/khach-hang/getKhachHangById/${id}`)
            .then((respone) => {
                setFormData(respone.data);
                setPreviewImage(respone.data.avatar);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const loadDiaChi = async (initPage, id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/dia-chi/getAllDiaChi`, {
                params: { idTaiKhoan: id, currentPage: initPage },
            });
            const addresses = response.data.content.map((item) => ({
                id: item.id,
                ten: item.ten,
                sdt: item.sdt,
                idTinh: item.idTinh,
                idHuyen: item.idHuyen,
                idXa: item.idXa,
                diaChiCuThe: item.diaChiCuThe,
                loai: item.loai,
                districts: [],
                wards: [],
            }));
            console.log('Loaded addresses:', addresses);
            setDiaChi(addresses);

            for (const address of addresses) {
                if (address.idTinh) {
                    const districts = await fetchDistricts(address.idTinh);
                    address.districts = districts;
                }
                if (address.idHuyen) {
                    const wards = await fetchWards(address.idHuyen);
                    address.wards = wards;
                }
            }
            setDiaChi([...addresses]);
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    };

    useEffect(() => {
        loadData(id);
        loadDiaChi(initPage - 1, id);
    }, [id, initPage]);

    const createDiaChi = () => {
        const newDiaChi = {
            ten: '',
            sdt: '',
            email: '',
            idTinh: '',
            idHuyen: '',
            idXa: '',
            diaChiCuThe: '',
            loai: '',
            idTaiKhoan: id,
            districts: [],
            wards: [],
        };
        const updatedDiaChiList = [newDiaChi, ...diaChi];
        setDiaChi(updatedDiaChiList);
        setIsAddingDiaChi(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const handleUpdateCustomer = (e) => {
        // e.preventDefault();

        const { errors, check } = validateData(formData);

        setFormErrors(errors);
        if (check > 0) {
            return;
        }

        const title = 'Xác nhận sửa khách hàng?';
        const text = 'Bạn có chắc chắn muốn cập nhật thông tin khách hàng này?';

        const formDataToSend = new FormData();

        formDataToSend.append('hoTen', formData.hoTen);
        formDataToSend.append('sdt', formData.sdt);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('gioiTinh', formData.gioiTinh);
        formDataToSend.append('vaiTro', formData.vaiTro);
        formDataToSend.append('ngaySinh', formData.ngaySinh);
        formDataToSend.append('trangThai', formData.trangThai);

        if (formData.avatar) {
            formDataToSend.append('avatar', formData.avatar);
        }

        swal({
            title: title,
            text: text,
            icon: 'warning',
            buttons: {
                cancel: 'Hủy',
                confirm: 'Xác nhận',
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                axios
                    .put(`http://localhost:8080/api/khach-hang/update/${id}`, formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then(() => {
                        swal('Thành công!', 'Sửa khách hàng thành công!', 'success');
                        navigate('/admin/tai-khoan/khach-hang');
                    })
                    .catch((error) => {
                        console.error('Lỗi cập nhật:', error);
                        swal('Thất bại!', 'Sửa khách hàng thất bại!', 'error');
                    });
            }
        });
    };

    const deleteDiaChi = (idDC) => {
        const title = 'Xác nhận xóa địa chỉ?';
        const text = '';

        swal({
            title: title,
            text: text,
            icon: 'warning',
            buttons: {
                cancel: 'Hủy',
                confirm: 'Xác nhận',
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                axios
                    .delete(`http://localhost:8080/api/dia-chi/delete/${idDC}`)
                    .then(() => {
                        loadDiaChi(initPage - 1, id);
                        swal('Thành công!', 'Xóa địa chỉ thành công!', 'success');
                    })
                    .catch((error) => {
                        console.error('Lỗi cập nhật:', error);
                        swal('Thất bại!', 'Xóa địa chỉ thất bại!', 'error');
                    });
            }
        });
    };

    const onUpdateDiaChi = (diaChiaa) => {
        const { errors, check } = validateAddress(diaChiaa);
        setAddressErrors(errors);

        if (check > 0) {
            return;
        }

        const title = diaChiaa.id ? 'Xác nhận Cập nhật địa chỉ?' : 'Xác nhận Thêm mới địa chỉ?';
        const text = diaChiaa.id
            ? 'Bạn có chắc chắn muốn cập nhật địa chỉ này không?'
            : 'Bạn có chắc chắn muốn thêm mới địa chỉ này không?';

        const updatedDiaChi = {
            ten: diaChiaa.ten,
            sdt: diaChiaa.sdt,
            idTinh: diaChiaa.idTinh,
            idHuyen: diaChiaa.idHuyen,
            idXa: diaChiaa.idXa,
            diaChiCuThe: diaChiaa.diaChiCuThe,
            loai: diaChiaa.loai === null ? 0 : diaChiaa.loai,
            idTaiKhoan: id,
        };

        swal({
            title: title,
            text: text,
            icon: 'warning',
            buttons: {
                cancel: 'Hủy',
                confirm: 'Xác nhận',
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                const apiUrl = diaChiaa.id
                    ? `http://localhost:8080/api/dia-chi/updatee/${diaChiaa.id}`
                    : `http://localhost:8080/api/dia-chi/create`; // Sử dụng POST khi thêm mới, PUT khi cập nhật.

                const apiMethod = diaChiaa.id ? axios.put : axios.post; // Dùng PUT cho cập nhật và POST cho thêm mới.

                apiMethod(apiUrl, updatedDiaChi, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(() => {
                        loadDiaChi(initPage - 1, id);
                        const successMessage = diaChiaa.id
                            ? 'Cập nhật địa chỉ thành công!'
                            : 'Thêm địa chỉ thành công!';
                        swal('Thành công!', successMessage, 'success');
                    })
                    .catch(() => {
                        const errorMessage = diaChiaa.id ? 'Cập nhật địa chỉ thất bại!' : 'Thêm địa chỉ thất bại!';
                        swal('Thất bại!', errorMessage, 'error');
                    });
            }
        });
    };

    const handleUpdateLoai = (idDC) => {
        axios
            .put(`http://localhost:8080/api/dia-chi/status?idTaiKhoan=${id}&idDiaChi=${idDC}`)
            .then(() => {
                loadDiaChi(initPage - 1, id);
                swal('Thành công!', 'Xét địa chỉ mặc định thành công!', 'success');
            })
            .catch(() => {
                swal('Thất bại!', 'Có lỗi xảy ra khi xét địa chỉ mặc định.', 'error');
            });
    };

    return (
        <div>
            <div className="font-bold text-sm">
                <span className="cursor-pointer" onClick={handleNavigateToSale}>
                    Khách hàng
                </span>
                <span className="text-gray-400 ml-2">/ Chỉnh sửa khách hàng</span>
            </div>
            <div className="bg-white p-4 rounded-md shadow-lg">
                <div className="flex">
                    <div className="w-1/4 pr-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-8">Thông tin khách hàng</h2>
                        <hr />
                        {/* Ảnh đại diện */}
                        <div className="flex justify-center items-center mt-4">
                            <label className="cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 overflow-hidden">
                                    {previewImage ? (
                                        <img
                                            src={previewImage || formData.avatar}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
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
                                value={formData.hoTen}
                                placeholder="Nhập họ và tên"
                                className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                    formErrors.hoTen ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setFormErrors({ ...formErrors, hoTen: '' });
                                }}
                            />
                        </div>
                        {formErrors.hoTen && (
                            <p className="text-sm" style={{ color: 'red' }}>
                                {formErrors.hoTen}
                            </p>
                        )}
                        <div className="col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="Nhập email"
                                className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                    formErrors.email ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setFormErrors({ ...formErrors, email: '' });
                                }}
                            />
                        </div>
                        {formErrors.email && (
                            <p className="text-sm" style={{ color: 'red' }}>
                                {formErrors.email}
                            </p>
                        )}
                        <div className="col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
                            <input
                                type="text"
                                name="sdt"
                                value={formData.sdt}
                                placeholder="Nhập số điện thoại"
                                className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                    formErrors.sdt ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setFormErrors({ ...formErrors, sdt: '' });
                                }}
                            />
                        </div>
                        {formErrors.sdt && (
                            <p className="text-sm" style={{ color: 'red' }}>
                                {formErrors.sdt}
                            </p>
                        )}
                        <div className="col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                            <input
                                type="date"
                                name="ngaySinh"
                                value={formData.ngaySinh}
                                className={`w-full p-3 border-2 border-gray-400 rounded outline-blue-500 ${
                                    formErrors.ngaySinh ? 'border-red-500 hover:border-red-600 outline-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setFormErrors({ ...formErrors, ngaySinh: '' });
                                }}
                            />
                        </div>
                        {formErrors.ngaySinh && (
                            <p className="text-sm" style={{ color: 'red' }}>
                                {formErrors.ngaySinh}
                            </p>
                        )}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gioiTinh"
                                        value={0}
                                        checked={formData.gioiTinh === 0}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                gioiTinh: parseInt(e.target.value),
                                            });
                                            setAddressErrors({ ...formErrors, gioiTinh: '' });
                                        }}
                                        className="mr-2 outline-blue-500"
                                    />
                                    Nam
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gioiTinh"
                                        value={1}
                                        checked={formData.gioiTinh === 1}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                gioiTinh: parseInt(e.target.value),
                                            });
                                            setAddressErrors({ ...formErrors, gioiTinh: '' });
                                        }}
                                        className="mr-2"
                                    />
                                    Nữ
                                </label>
                            </div>
                        </div>
                        {formErrors.gioiTinh && (
                            <p className="text-sm" style={{ color: 'red' }}>
                                {formErrors.gioiTinh}
                            </p>
                        )}

                        <div className="mt-5 flex">
                            <button
                                onClick={() => handleUpdateCustomer(id, formData)}
                                className="bg-[#2f19ae] text-white px-8 py-3 rounded-sm shadow-md hover:bg-blue-700 transition duration-300"
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
                                <div key={index} className="mb-4 mt-6 border border-gray-300 rounded-sm shadow-md">
                                    <div className="p-4 rounded-t-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold">Địa chỉ {index + 1}</span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="col-span-1">
                                                <label className="block text-sm font-medium text-gray-700">Tên</label>
                                                <input
                                                    type="text"
                                                    className={`w-full p-2 border border-gray-300 rounded text-sm outline-blue-500 ${
                                                        addressErrors.ten
                                                            ? 'border-red-500 hover:border-red-600 outline-red-500'
                                                            : ''
                                                    }`}
                                                    name="name"
                                                    value={item.ten}
                                                    onChange={(e) => {
                                                        const updatedDiaChi = [...diaChi];
                                                        updatedDiaChi[index].ten = e.target.value;
                                                        setDiaChi(updatedDiaChi);
                                                    }}
                                                />
                                            </div>
                                            {addressErrors.ten && (
                                                <p className="text-sm" style={{ color: 'red' }}>
                                                    {addressErrors.ten}
                                                </p>
                                            )}
                                            <div className="col-span-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Số điện thoại
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`w-full p-2 border border-gray-300 rounded text-sm outline-blue-500 ${
                                                        addressErrors.sdt
                                                            ? 'border-red-500 hover:border-red-600 outline-red-500'
                                                            : ''
                                                    }`}
                                                    name="phoneNumber"
                                                    value={item.sdt}
                                                    onChange={(e) => {
                                                        const updatedDiaChi = [...diaChi];
                                                        updatedDiaChi[index].sdt = e.target.value;
                                                        setDiaChi(updatedDiaChi);
                                                    }}
                                                />
                                            </div>
                                            {addressErrors.sdt && (
                                                <p className="text-sm" style={{ color: 'red' }}>
                                                    {addressErrors.sdt}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Tỉnh/thành phố
                                                </label>
                                                <select
                                                    className={`w-full p-2 border border-gray-300 rounded text-sm outline-blue-500 ${
                                                        addressErrors.idTinh
                                                            ? 'border-red-500 hover:border-red-600 outline-red-500'
                                                            : ''
                                                    }`}
                                                    value={item.idTinh}
                                                    onChange={async (e) => {
                                                        const updatedDiaChi = [...diaChi];
                                                        updatedDiaChi[index].idTinh = e.target.value; // Cập nhật idTinh
                                                        updatedDiaChi[index].idHuyen = '';
                                                        updatedDiaChi[index].idXa = '';

                                                        // setSelectedProvince(e.target.value); // Tải danh sách huyện mới
                                                        const districts = await fetchDistricts(e.target.value);
                                                        updatedDiaChi[index].districts = districts;
                                                        updatedDiaChi[index].wards = [];
                                                        setDiaChi(updatedDiaChi);
                                                        setDiaChi(updatedDiaChi);
                                                        setAddressErrors({ ...addressErrors, idTinh: '' });
                                                        //fetchDistricts(e.target.value); // Tải quận/huyện mới cho địa chỉ này
                                                    }}
                                                >
                                                    <option value="">Chọn tỉnh/thành phố</option>
                                                    {provinces.map((province) => (
                                                        <option key={province.code} value={province.code}>
                                                            {province.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {addressErrors.idTinh && (
                                                    <p className="text-sm" style={{ color: 'red' }}>
                                                        {addressErrors.idTinh}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Quận/huyện
                                                </label>
                                                <select
                                                    className={`w-full p-2 border border-gray-300 rounded text-sm outline-blue-500 ${
                                                        addressErrors.idHuyen
                                                            ? 'border-red-500 hover:border-red-600 outline-red-500'
                                                            : ''
                                                    }`}
                                                    value={item.idHuyen}
                                                    onChange={async (e) => {
                                                        const updatedDiaChi = [...diaChi];
                                                        updatedDiaChi[index].idHuyen = e.target.value; // Cập nhật idHuyen
                                                        updatedDiaChi[index].idXa = '';

                                                        const wards = await fetchWards(e.target.value);
                                                        updatedDiaChi[index].wards = wards;
                                                        setDiaChi(updatedDiaChi);
                                                        setAddressErrors({ ...addressErrors, idHuyen: '' });
                                                        //setSelectedDistrict(e.target.value); // Tải danh sách xã mới
                                                        //fetchWards(e.target.value);
                                                    }}
                                                >
                                                    <option value="">Chọn quận/huyện</option>
                                                    {item.districts &&
                                                        item.districts.map((district) => (
                                                            <option key={district.code} value={district.code}>
                                                                {district.name}
                                                            </option>
                                                        ))}
                                                </select>
                                                {addressErrors.idHuyen && (
                                                    <p className="text-sm" style={{ color: 'red' }}>
                                                        {addressErrors.idHuyen}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Xã/phường/thị trấn
                                                </label>
                                                <select
                                                    className={`w-full p-2 border border-gray-300 rounded text-sm outline-blue-500 ${
                                                        addressErrors.idXa
                                                            ? 'border-red-500 hover:border-red-600 outline-red-500'
                                                            : ''
                                                    }`}
                                                    value={item.idXa}
                                                    onChange={(e) => {
                                                        const updatedDiaChi = [...diaChi];
                                                        updatedDiaChi[index].idXa = e.target.value; // Cập nhật idXa

                                                        setDiaChi(updatedDiaChi);
                                                        setAddressErrors({ ...addressErrors, idXa: '' });
                                                        // setSelectedWard(e.target.value);
                                                    }}
                                                >
                                                    <option value="">Chọn xã/phường</option>
                                                    {item.wards &&
                                                        item.wards.map((ward) => (
                                                            <option key={ward.code} value={ward.code}>
                                                                {ward.name}
                                                            </option>
                                                        ))}
                                                </select>
                                                {addressErrors.idXa && (
                                                    <p className="text-sm" style={{ color: 'red' }}>
                                                        {addressErrors.idXa}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Địa chỉ cụ thể
                                            </label>
                                            <input
                                                type="text"
                                                className={`w-full p-2 border border-gray-300 rounded text-sm outline-blue-500 ${
                                                    addressErrors.diaChiCuThe
                                                        ? 'border-red-500 hover:border-red-600 outline-red-500'
                                                        : ''
                                                }`}
                                                name="specificAddress"
                                                value={item.diaChiCuThe}
                                                onChange={(e) => {
                                                    const updatedDiaChi = [...diaChi];
                                                    updatedDiaChi[index].diaChiCuThe = e.target.value;
                                                    setDiaChi(updatedDiaChi);
                                                    setAddressErrors({ ...addressErrors, diaChiCuThe: '' });
                                                }}
                                            />
                                        </div>
                                        {addressErrors.diaChiCuThe && (
                                            <p className="text-sm" style={{ color: 'red' }}>
                                                {addressErrors.diaChiCuThe}
                                            </p>
                                        )}
                                        <div className="mt-4 flex justify-between w-full">
                                            <button
                                                onClick={() => handleUpdateLoai(item.id)}
                                                className="mr-2 text-3xl text-yellow-500 hover:text-yellow-600"
                                                disabled={item.loai === 0}
                                            >
                                                {item.loai === 0 ? '★' : '☆'}
                                            </button>

                                            <div className="flex justify-end">
                                                {item.loai === null ? (
                                                    <button
                                                        onClick={() => onUpdateDiaChi(item)}
                                                        className="ml-4 text-green-500 hover:text-green-600"
                                                    >
                                                        <AddIcon />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onUpdateDiaChi(item)}
                                                        className="ml-4 text-blue-500 hover:text-blue-600"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                )}

                                                {item.loai !== 1 ? (
                                                    <button
                                                        onClick={() => deleteDiaChi(item.id)}
                                                        className="ml-4 text-red-500 hover:text-red-600"
                                                        // disabled={item.type === 0}
                                                    >
                                                        <DeleteIcon />
                                                    </button>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div>
                            {!isAddingDiaChi && (
                                <button
                                    onClick={createDiaChi}
                                    className="px-4 py-1 bg-white text-amber-400 border border-amber-400 font-medium rounded-sm shadow-sm hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 transition-all duration-200"
                                >
                                    Thêm địa chỉ
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditCustomer;
