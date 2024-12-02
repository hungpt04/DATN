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

    const loadAddress = async (taiKhoanId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/dia-chi/tai-khoan/${taiKhoanId}`);
            setAddressList(response.data);
        } catch (error) {
            console.error('Failed to fetch addresses', error);
        }
    };

    const loadProvinces = async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/p/');
            setProvinces(response.data);
        } catch (error) {
            console.error('Failed to fetch provinces', error);
        }
    };

    const loadDistricts = async (provinceCode) => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            setDistricts(response.data.districts);
        } catch (error) {
            console.error('Failed to fetch districts', error);
        }
    };

    const loadWards = async (districtCode) => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            setWards(response.data.wards);
        } catch (error) {
            console.error('Failed to fetch wards', error);
        }
    };

    useEffect(() => {
        loadAddress(1); // Tải địa chỉ cho tài khoản 1
        loadProvinces(); // Tải danh sách tỉnh/thành phố
    }, []);

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    const handleAddAddress = async (values) => {
        // Kiểm tra xem các giá trị có tồn tại không
        const selectedProvince = provinces.find((province) => province.code === parseInt(values.province));
        const selectedDistrict = districts.find((district) => district.code === parseInt(values.district));
        const selectedWard = wards.find((ward) => ward.code === parseInt(values.ward));

        if (!selectedProvince || !selectedDistrict || !selectedWard) {
            swal('Lỗi!', 'Vui lòng chọn đầy đủ thông tin địa chỉ', 'error');
            return;
        }

        const newAddress = {
            ten: values.addressName,
            taiKhoan: { id: 1 },
            sdt: values.mobile,
            idTinh: selectedProvince.name,
            idHuyen: selectedDistrict.name,
            idXa: selectedWard.name,
            diaChiCuThe: values.addressDetail,
        };

        try {
            await axios.post('http://localhost:8080/api/dia-chi', newAddress);
            swal('Thành công!', 'Địa chỉ đã được lưu!', 'success');
            loadAddress(1); // Tải lại danh sách địa chỉ
            reset();
        } catch (error) {
            console.error('Có lỗi xảy ra khi lưu địa chỉ!', error.response?.data || error.message);
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
                            {addressList.map((item, index) => (
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
                            ))}
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
                                                <option key={province.code} value={province.code}>
                                                    {province.name}
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
                                                <option key={district.code} value={district.code}>
                                                    {district.name}
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
                                                <option key={ward.code} value={ward.code}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.ward && <p className="text-red-500 text-sm">Xã/phường là bắt buộc</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Số điện thoại</label>
                                        <input
                                            type="text"
                                            {...register('mobile', { required: true })}
                                            className="w-full mt-1 px-4 py-2 border rounded focus:ring-blue-600 focus:border-blue-600"
                                        />
                                        {errors.mobile && (
                                            <p className="text-red-500 text-sm">Số điện thoại là bắt buộc</p>
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
