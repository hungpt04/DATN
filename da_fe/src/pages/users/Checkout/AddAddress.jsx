// import React, { useState, useEffect } from 'react';
// import { Grid, TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
// import AddressCard from './AddressCard';
// import ProgressBar from './ProgressBar';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import swal from 'sweetalert';
// import { useForm } from 'react-hook-form';
// import { useAddress } from './AddressContext';

// const AddAddress = () => {
//     const [addressList, setAddressList] = useState([]);
//     const [provinces, setProvinces] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [wards, setWards] = useState([]);
//     const navigate = useNavigate();
//     const currentStep = 1;
//     const { selectedAddress, setSelectedAddress } = useAddress();

//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm();

//     // Lấy id người dùng
//     const [customerId, setCustomerId] = useState(null);

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             const fetchUserInfo = async () => {
//                 try {
//                     const response = await axios.get('http://localhost:8080/api/tai-khoan/my-info', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });

//                     // Lưu ID người dùng
//                     const userId = response.data.id; // Trong trường hợp này là 11
//                     console.log('User ID:', userId);
//                     setCustomerId(userId);
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                 }
//             };
//             fetchUserInfo();
//         }
//     }, []);

//     const loadAddress = async (customerId) => {
//         try {
//             if (!customerId) {
//                 console.error("Customer ID is null");
//                 return;
//             }
//             const response = await axios.get(`http://localhost:8080/api/dia-chi/tai-khoan/${customerId}`);
//             setAddressList(response.data);
//         } catch (error) {
//             console.error('Failed to fetch addresses', error);
//         }
//     };

//     const loadProvinces = async () => {
//         try {
//             const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
//                 headers: {
//                     Token: '04ae91c9-b3a5-11ef-b074-aece61c107bd',
//                 },
//             });
//             setProvinces(response.data.data); // Giả sử dữ liệu tỉnh nằm trong response.data.data
//         } catch (error) {
//             console.error('Failed to fetch provinces', error);
//         }
//     };

//     const loadDistricts = async (provinceCode) => {
//         try {
//             const response = await axios.get(
//                 `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`,
//                 {
//                     headers: {
//                         Token: '04ae91c9-b3a5-11ef-b074-aece61c107bd',
//                     },
//                 },
//             );
//             setDistricts(response.data.data); // Giả sử dữ liệu quận/huyện nằm trong response.data.data
//         } catch (error) {
//             console.error('Failed to fetch districts', error);
//         }
//     };

//     const loadWards = async (districtCode) => {
//         try {
//             const response = await axios.get(
//                 `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`,
//                 {
//                     headers: {
//                         Token: '04ae91c9-b3a5-11ef-b074-aece61c107bd',
//                     },
//                 },
//             );
//             setWards(response.data.data); // Giả sử dữ liệu xã/phường nằm trong response.data.data
//         } catch (error) {
//             console.error('Failed to fetch wards', error);
//         }
//     };

//     useEffect(() => {
//         if (customerId) {
//         loadAddress(customerId);
//         }
//         loadProvinces(); // Tải danh sách tỉnh/thành phố
//     }, [customerId]);

//     const handleAddressSelect = (address) => {
//         setSelectedAddress(address);
//     };

//     const handleAddAddress = async (values) => {
//         console.log('Form Values:', values);
//         console.log('Provinces:', provinces);
//         console.log('Districts:', districts);
//         console.log('Wards:', wards);

//         // Kiểm tra xem các giá trị có tồn tại không
//         const selectedProvince = provinces.find((province) => province.ProvinceID === parseInt(values.province));
//         const selectedDistrict = districts.find((district) => district.DistrictID === parseInt(values.district));
//         const selectedWard = wards.find((ward) => ward.WardCode === values.ward);

//         console.log('Selected Province:', selectedProvince);
//         console.log('Selected District:', selectedDistrict);
//         console.log('Selected Ward:', selectedWard);

//         if (!selectedProvince || !selectedDistrict || !selectedWard) {
//             swal('Lỗi!', 'Vui lòng chọn đầy đủ thông tin địa chỉ', 'error');
//             return;
//         }

//         const newAddress = {
//             ten: values.addressName,
//             taiKhoan: { id: customerId },
//             sdt: values.mobile,
//             idTinh: selectedProvince.ProvinceName,
//             idHuyen: selectedDistrict.DistrictName,
//             idXa: selectedWard.WardName,
//             diaChiCuThe: values.addressDetail,
//         };

//         console.log('New Address:', newAddress);

//         try {
//             const response = await axios.post('http://localhost:8080/api/dia-chi', newAddress);
//             console.log('Response:', response);

//             swal('Thành công!', 'Địa chỉ đã được lưu!', 'success');
//             loadAddress(customerId); // Tải lại danh sách địa chỉ
//             reset();
//         } catch (error) {
//             console.error('Có lỗi xảy ra khi lưu địa chỉ!', error.response?.data || error.message);

//             // Log chi tiết lỗi
//             if (error.response) {
//                 // Lỗi từ phía server
//                 console.error('Server Error Data:', error.response.data);
//                 console.error('Server Error Status:', error.response.status);
//                 console.error('Server Error Headers:', error.response.headers);
//             } else if (error.request) {
//                 // Lỗi không nhận được response
//                 console.error('Request Error:', error.request);
//             } else {
//                 // Lỗi khác
//                 console.error('Error Message:', error.message);
//             }

//             swal('Thất bại!', 'Có lỗi xảy ra khi lưu địa chỉ!', 'error');
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen">
//             <div className="rounded-lg p-4 max-w-[1200px] w-full">
//                 <ProgressBar currentStep={currentStep} />
//                 <Grid container spacing={4}>
//                     <Grid item xs={12} lg={5}>
//                         <Box className="border rounded-md shadow-md h-[30.5rem] overflow-y-scroll">
//                             <Typography variant="h6" className="p-5 py-7">
//                                 Danh Sách Địa Chỉ
//                             </Typography>
//                             {addressList.map((item, index) => (
//                                 <div
//                                     key={index}
//                                     onClick={() => handleAddressSelect(item)}
//                                     className="p-5 border-b cursor-pointer"
//                                 >
//                                     <AddressCard address={item} />
//                                     {selectedAddress?.sdt === item.sdt && (
//                                         <Button
//                                             onClick={() => navigate('/gio-hang/checkout/order-summary')}
//                                             sx={{ mt: 2, backgroundColor: '#2f19ae', color: 'white' }}
//                                             size="large"
//                                             variant="contained"
//                                         >
//                                             Giao đến đây
//                                         </Button>
//                                     )}
//                                 </div>
//                             ))}
//                         </Box>
//                     </Grid>
//                     <Grid item xs={12} lg={7}>
//                         <div className="border rounded-md shadow-md p-5">
//                             <form onSubmit={handleSubmit(handleAddAddress)}>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                                     <div className="col-span-2">
//                                         <label className="block text-sm font-medium">Họ và tên</label>
//                                         <input
//                                             type="text"
//                                             {...register('addressName', { required: true })}
//                                             className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
//                                         />
//                                         {errors.addressName && (
//                                             <p className="text-red-500 text-sm">Họ và tên là bắt buộc</p>
//                                         )}
//                                     </div>
//                                     <div className="col-span-2">
//                                         <label className="block text-sm font-medium">Địa chỉ</label>
//                                         <input
//                                             type="text"
//                                             {...register('addressDetail', { required: true })}
//                                             className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
//                                         />
//                                         {errors.addressDetail && (
//                                             <p className="text-red-500 text-sm">Địa chỉ là bắt buộc</p>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium">Tỉnh/Thành phố</label>
//                                         <select
//                                             {...register('province', { required: true })}
//                                             className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
//                                             onChange={(e) => loadDistricts(e.target.value)}
//                                         >
//                                             <option value="">Chọn tỉnh/thành phố</option>
//                                             {provinces.map((province) => (
//                                                 <option key={province.ProvinceID} value={province.ProvinceID}>
//                                                     {province.ProvinceName}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {errors.province && (
//                                             <p className="text-red-500 text-sm">Tỉnh/thành phố là bắt buộc</p>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium">Quận/Huyện</label>
//                                         <select
//                                             {...register('district', { required: true })}
//                                             className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
//                                             onChange={(e) => loadWards(e.target.value)}
//                                         >
//                                             <option value="">Chọn quận/huyện</option>
//                                             {districts.map((district) => (
//                                                 <option key={district.DistrictID} value={district.DistrictID}>
//                                                     {district.DistrictName}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {errors.district && (
//                                             <p className="text-red-500 text-sm">Quận/huyện là bắt buộc</p>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium">Xã/Phường</label>
//                                         <select
//                                             {...register('ward', { required: true })}
//                                             className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
//                                         >
//                                             <option value="">Chọn xã/phường</option>
//                                             {wards.map((ward) => (
//                                                 <option key={ward.WardCode} value={ward.WardCode}>
//                                                     {ward.WardName}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {errors.ward && <p className="text-red-500 text-sm">Xã/phường là bắt buộc</p>}
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium">Số điện thoại</label>
//                                         <input
//                                             type="text"
//                                             {...register('mobile', { required: true })}
//                                             className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
//                                         />
//                                         {errors.mobile && (
//                                             <p className="text-red-500 text-sm">Số điện thoại là bắt buộc</p>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="mt-6">
//                                     <button
//                                         type="submit"
//                                         className="w-full bg-[#2f19ae] text-white px-4 py-3 rounded hover:bg-blue-700 transition"
//                                     >
//                                         Thêm Địa Chỉ
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </Grid>
//                 </Grid>
//             </div>
//         </div>
//     );
// };

// export default AddAddress;


import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import AddressCard from './AddressCard';
import ProgressBar from './ProgressBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { useForm } from 'react-hook-form';
import { useAddress } from './AddressContext';

const AddAddress = () => {
    const [addressList, setAddressList] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const navigate = useNavigate();
    const currentStep = 1;
    const { selectedAddress, setSelectedAddress } = useAddress();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Lấy id người dùng
    const [customerId, setCustomerId] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/tai-khoan/my-info', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    // Lưu ID người dùng
                    const userId = response.data.id; // Trong trường hợp này là 11
                    console.log('User ID:', userId);
                    setCustomerId(userId);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserInfo();
        }
    }, []);

    const loadAddress = async (customerId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/dia-chi/tai-khoan/${customerId}`);
            setAddressList(response.data);
        } catch (error) {
            console.error('Failed to fetch addresses', error);
        }
    };

    const loadProvinces = async () => {
        try {
            const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                headers: {
                    Token: '04ae91c9-b3a5-11ef-b074-aece61c107bd',
                },
            });
            setProvinces(response.data.data); // Giả sử dữ liệu tỉnh nằm trong response.data.data
        } catch (error) {
            console.error('Failed to fetch provinces', error);
        }
    };

    const loadDistricts = async (provinceCode) => {
        try {
            const response = await axios.get(
                `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`,
                {
                    headers: {
                        Token: '04ae91c9-b3a5-11ef-b074-aece61c107bd',
                    },
                },
            );
            setDistricts(response.data.data); // Giả sử dữ liệu quận/huyện nằm trong response.data.data
        } catch (error) {
            console.error('Failed to fetch districts', error);
        }
    };

    const loadWards = async (districtCode) => {
        try {
            const response = await axios.get(
                `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`,
                {
                    headers: {
                        Token: '04ae91c9-b3a5-11ef-b074-aece61c107bd',
                    },
                },
            );
            setWards(response.data.data); // Giả sử dữ liệu xã/phường nằm trong response.data.data
        } catch (error) {
            console.error('Failed to fetch wards', error);
        }
    };

    useEffect(() => {
        loadAddress(customerId); // Tải địa chỉ cho tài khoản 1
        loadProvinces(); // Tải danh sách tỉnh/thành phố
    }, [customerId]);

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    const handleAddAddress = async (values) => {
        console.log('Form Values:', values);
        console.log('Provinces:', provinces);
        console.log('Districts:', districts);
        console.log('Wards:', wards);

        // Kiểm tra xem các giá trị có tồn tại không
        const selectedProvince = provinces.find((province) => province.ProvinceID === parseInt(values.province));
        const selectedDistrict = districts.find((district) => district.DistrictID === parseInt(values.district));
        const selectedWard = wards.find((ward) => ward.WardCode === values.ward);

        console.log('Selected Province:', selectedProvince);
        console.log('Selected District:', selectedDistrict);
        console.log('Selected Ward:', selectedWard);

        if (!selectedProvince || !selectedDistrict || !selectedWard) {
            swal('Lỗi!', 'Vui lòng chọn đầy đủ thông tin địa chỉ', 'error');
            return;
        }

        const newAddress = {
            ten: values.addressName,
            taiKhoan: { id: customerId },
            sdt: values.mobile,
            idTinh: selectedProvince.ProvinceName,
            idHuyen: selectedDistrict.DistrictName,
            idXa: selectedWard.WardName,
            diaChiCuThe: values.addressDetail,
        };

        console.log('New Address:', newAddress);

        try {
            const response = await axios.post('http://localhost:8080/api/dia-chi', newAddress);
            console.log('Response:', response);

            swal('Thành công!', 'Địa chỉ đã được lưu!', 'success');
            loadAddress(customerId); // Tải lại danh sách địa chỉ
            reset();
        } catch (error) {
            console.error('Có lỗi xảy ra khi lưu địa chỉ!', error.response?.data || error.message);

            // Log chi tiết lỗi
            if (error.response) {
                // Lỗi từ phía server
                console.error('Server Error Data:', error.response.data);
                console.error('Server Error Status:', error.response.status);
                console.error('Server Error Headers:', error.response.headers);
            } else if (error.request) {
                // Lỗi không nhận được response
                console.error('Request Error:', error.request);
            } else {
                // Lỗi khác
                console.error('Error Message:', error.message);
            }

            swal('Thất bại!', 'Có lỗi xảy ra khi lưu địa chỉ!', 'error');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="rounded-lg p-4 max-w-[1200px] w-full">
                <ProgressBar currentStep={currentStep} />
                <Grid container spacing={4}>
                    <Grid item xs={12} lg={5}>
                        <Box className="border rounded-md shadow-md h-[30.5rem] overflow-y-scroll">
                            <Typography variant="h6" className="p-5 py-7">
                                Danh Sách Địa Chỉ
                            </Typography>
                            {addressList.length === 0 ? ( // Kiểm tra nếu danh sách địa chỉ rỗng
                                <div className="p-5 text-center">
                                    <Typography variant="body1" className="text-gray-500">
                                        Chưa có địa chỉ
                                    </Typography>
                                </div>
                            ) : (
                                addressList.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleAddressSelect(item)}
                                        className="p-5 border-b cursor-pointer"
                                    >
                                        <AddressCard address={item} />
                                        {selectedAddress?.sdt === item.sdt && (
                                            <Button
                                                onClick={() => navigate('/gio-hang/checkout/order-summary')}
                                                sx={{ mt: 2, backgroundColor: '#2f19ae', color: 'white' }}
                                                size="large"
                                                variant="contained"
                                            >
                                                Giao đến đây
                                            </Button>
                                        )}
                                    </div>
                                ))
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={7}>
                        <div className="border rounded-md shadow-md p-5">
                            <form onSubmit={handleSubmit(handleAddAddress)}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium">Họ và tên</label>
                                        <input
                                            type="text"
                                            {...register('addressName', { required: true })}
                                            className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
                                        />
                                        {errors.addressName && (
                                            <p className="text-red-500 text-sm">Họ và tên là bắt buộc</p>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium">Địa chỉ</label>
                                        <input
                                            type="text"
                                            {...register('addressDetail', { required: true })}
                                            className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
                                        />
                                        {errors.addressDetail && (
                                            <p className="text-red-500 text-sm">Địa chỉ là bắt buộc</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Tỉnh/Thành phố</label>
                                        <select
                                            {...register('province', { required: true })}
                                            className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
                                            onChange={(e) => loadDistricts(e.target.value)}
                                        >
                                            <option value="">Chọn tỉnh/thành phố</option>
                                            {provinces.map((province) => (
                                                <option key={province.ProvinceID} value={province.ProvinceID}>
                                                    {province.ProvinceName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.province && (
                                            <p className="text-red-500 text-sm">Tỉnh/thành phố là bắt buộc</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Quận/Huyện</label>
                                        <select
                                            {...register('district', { required: true })}
                                            className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
                                            onChange={(e) => loadWards(e.target.value)}
                                        >
                                            <option value="">Chọn quận/huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.DistrictID} value={district.DistrictID}>
                                                    {district.DistrictName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.district && (
                                            <p className="text-red-500 text-sm">Quận/huyện là bắt buộc</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Xã/Phường</label>
                                        <select
                                            {...register('ward', { required: true })}
                                            className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
                                        >
                                            <option value="">Chọn xã/phường</option>
                                            {wards.map((ward) => (
                                                <option key={ward.WardCode} value={ward.WardCode}>
                                                    {ward.WardName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.ward && <p className="text-red-500 text-sm">Xã/phường là bắt buộc</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Số điện thoại</label>
                                        <input
                                            type="text"
                                            {...register('mobile', {
                                                required: true, pattern: {
                                                    value: /^(0[1-9]{1}[0-9]{8})$/, // Example regex for Vietnamese phone numbers
                                                    message: 'Số điện thoại không đúng định dạng'
                                                }
                                            })}
                                            className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
                                        />
                                        {errors.mobile && (
                                            <p className="text-red-500 text-sm">{errors.mobile.message || 'Số điện thoại là bắt buộc'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full bg-[#2f19ae] text-white px-4 py-3 rounded hover:bg-blue-700 transition"
                                    >
                                        Thêm Địa Chỉ
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default AddAddress;
