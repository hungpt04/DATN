import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import swal from "sweetalert";

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
    const [diaChi, setDiaChi] = useState([])
    const [isAddingDiaChi, setIsAddingDiaChi] = useState(false);
    const [initPage, setInitPage] = useState(1)

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
            fetchDistricts(selectedProvince);
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
            const data = await response.json();
            console.log('Districts data:', data.districts); // Kiểm tra dữ liệu huyện
            setDistricts(data.districts || []);
            setSelectedDistrict('');
            setSelectedWard('');
        } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            if (!districtId) {
                console.warn('District ID is empty');
                setWards([]);
                setSelectedWard('');
                return;
            }
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Wards data:', data.wards); // Kiểm tra dữ liệu xã
            if (!data || !data.wards) {
                console.warn('No wards data found', data);
                setWards([]);
                setSelectedWard('');
                return;
            }
            console.log('Wards data:', data.wards);
            const validWards = data.wards.filter(ward => ward && ward.code && ward.name);
            setWards(validWards);
            console.log('Selected ward before update:', selectedWard);

            // Kiểm tra xem ward hiện tại có trong danh sách không
            const currentWardExists = validWards.some(ward => ward.code === selectedWard);
            if (!currentWardExists) {
                setSelectedWard('');
            }
        } catch (error) {
            console.error('Error fetching wards:', error);
            setWards([]);
            setSelectedWard('');
        }
    };

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

    const loadData = (id) => {
        axios.get(`http://localhost:8080/api/khach-hang/getKhachHangById/${id}`)
            .then((respone) => {
                setFormData(respone.data);
                setPreviewImage(respone.data.avatar)

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    // const loadDiaChi = (initPage, id) => {
    //     axios.get(`http://localhost:8080/api/dia-chi/getAllDiaChi`, {
    //         params: { idTaiKhoan: id, currentPage: initPage },
    //     })
    //         .then((response) => {
    //             console.log('h', response.data);
    //             const addresses = response.data.content.map((item) => {
    //                 return {
    //                     id: item.id,
    //                     ten: item.ten,
    //                     sdt: item.sdt,
    //                     idTinh: item.idTinh,
    //                     idHuyen: item.idHuyen,
    //                     idXa: item.idXa,
    //                     diaChiCuThe: item.diaChiCuThe,
    //                     loai: item.loai
    //                 }
    //             });
    //             setDiaChi(addresses);
    //             console.log(addresses)
    //             console.log('Selected District:', selectedDistrict);
    //             console.log('Selected Ward:', selectedWard);
    //             console.log('Districts:', districts);
    //             console.log('Wards:', wards);
    //             addresses.forEach((address) => {
    //                 console.log(`Fetching districts for province ID: ${address.idTinh}`);
    //                 fetchDistricts(address.idTinh);
    //                 console.log(`Fetching wards for district ID: ${address.idHuyen}`);
    //                 fetchWards(address.idHuyen);
    //             });
    //         })
    //         .catch((error) => {
    //             console.error("Lỗi khi gọi API:", error);
    //         });
    // };

    const loadDiaChi = (initPage, id) => {
        axios.get(`http://localhost:8080/api/dia-chi/getAllDiaChi`, {
            params: { idTaiKhoan: id, currentPage: initPage },
        })
            .then((response) => {
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
    
                addresses.forEach((address, index) => {
                    if (address.idTinh) fetchDistricts(address.idTinh, index);
                    if (address.idHuyen) fetchWards(address.idHuyen, index);
                });
            })
            .catch((error) => {
                console.error("Error loading addresses:", error);
            });
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
        }
        const updatedDiaChiList = [newDiaChi, ...diaChi]
        setDiaChi(updatedDiaChiList)
        setIsAddingDiaChi(true)
    }

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

    const handleUpdateCustomer = (e) => {

        const title = 'Xác nhận sửa khách hàng?'
        const text = 'Bạn có chắc chắn muốn cập nhật thông tin khách hàng này?'

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
            icon: "warning",
            buttons: {
                cancel: "Hủy",
                confirm: "Xác nhận",
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                axios.put(`http://localhost:8080/api/khach-hang/update/${id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then(() => {
                        swal("Thành công!", "Sửa khách hàng thành công!", "success");
                        navigate('/admin/tai-khoan/khach-hang')
                    })
                    .catch((error) => {
                        console.error("Lỗi cập nhật:", error);
                        swal("Thất bại!", "Sửa khách hàng thất bại!", "error");
                    });
            }
        });
    }

    const deleteDiaChi = (idDC) => {
        const title = 'Xác nhận xóa địa chỉ?'
        const text = ''

        swal({
            title: title,
            text: text,
            icon: "warning",
            buttons: {
                cancel: "Hủy",
                confirm: "Xác nhận",
            },
        }).then((willConfirm) => {
            if (willConfirm) {
                axios.delete(`http://localhost:8080/api/dia-chi/delete/${idDC}`)
                    .then(() => {
                        loadDiaChi(initPage - 1, id);
                        swal("Thành công!", "Xóa địa chỉ thành công!", "success");
                    })
                    .catch((error) => {
                        console.error("Lỗi cập nhật:", error);
                        swal("Thất bại!", "Xóa địa chỉ thất bại!", "error");
                    });
            }
        });
    }

    const onUpdateDiaChi = (diaChiaa) => {
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
            icon: "warning",
            buttons: {
                cancel: "Hủy",
                confirm: "Xác nhận",
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
                            ? "Cập nhật địa chỉ thành công!"
                            : "Thêm địa chỉ thành công!";
                        swal("Thành công!", successMessage, "success");
                    })
                    .catch(() => {
                        const errorMessage = diaChiaa.id
                            ? "Cập nhật địa chỉ thất bại!"
                            : "Thêm địa chỉ thất bại!";
                        swal("Thất bại!", errorMessage, "error");
                    });
            }
        });
    };

    const handleUpdateLoai = (idDC) => {
        axios.put(`http://localhost:8080/api/dia-chi/status?idTaiKhoan=${id}&idDiaChi=${idDC}`)
            .then(() => {
                loadDiaChi(initPage - 1, id);
                swal("Thành công!", "Xét địa chỉ mặc định thành công!", "success");
            })
            .catch(() => {
                swal("Thất bại!", "Có lỗi xảy ra khi xét địa chỉ mặc định.", "error");
            });
    };

    return (
        <div>
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

                        <div className="mt-8 flex">
                            <button
                                onClick={() => handleUpdateCustomer(id, formData)}
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
                                                    onChange={(e) => {
                                                        const updatedDiaChi = [...diaChi];
                                                        updatedDiaChi[index].idTinh = e.target.value; // Cập nhật idTinh
                                                        setDiaChi(updatedDiaChi);
                                                        setSelectedProvince(e.target.value);     // Tải danh sách huyện mới
                                                        fetchDistricts(e.target.value); // Tải quận/huyện mới cho địa chỉ này
                                                    }}
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
                                                    onChange={(e) => {
                                                        const updatedDiaChi = [...diaChi];
                                                        updatedDiaChi[index].idHuyen = e.target.value; // Cập nhật idHuyen
                                                        setDiaChi(updatedDiaChi);
                                                        setSelectedDistrict(e.target.value);     // Tải danh sách xã mới
                                                        fetchWards(e.target.value)
                                                    }}
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
                                                    onChange={(e) => {
                                                        const updatedDiaChi = [...diaChi];
                                                        updatedDiaChi[index].idXa = e.target.value; // Cập nhật idXa
                                                        setDiaChi(updatedDiaChi);
                                                        setSelectedWard(e.target.value)
                                                    }}

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
                                                onClick={() => handleUpdateLoai(item.id)}
                                                className="mr-2 text-3xl text-yellow-500 hover:text-yellow-600"
                                                disabled={item.loai === 0}
                                            >
                                                {item.loai === 0 ? "★" : "☆"}
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

                                                <button
                                                    onClick={() => deleteDiaChi(item.id)}
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
                        <div>
                            {!isAddingDiaChi && (
                                <button
                                    onClick={createDiaChi}
                                    className="px-4 py-1 bg-white text-amber-400 border border-amber-400 font-medium rounded-md shadow-sm hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 transition-all duration-200"
                                >
                                    Thêm địa chỉ
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default EditCustomer;
