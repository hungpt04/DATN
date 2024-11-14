import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Box, Typography } from '@mui/material';
import AddressCard from './AddressCard';
import ProgressBar from './ProgressBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { useForm } from 'react-hook-form';
import { useAddress } from './AddressContext';

const AddAddress = () => {
    const [addressList, setAddressList] = useState([]);
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

    useEffect(() => {
        loadAddress(1); // Tải địa chỉ cho tài khoản 1
    }, []);

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    const handleAddAddress = async (values) => {
        const newAddress = {
            ten: values.AddressName,
            taiKhoan: { id: 1 },
            sdt: values.Mobile,
            idTinh: values.Tinh,
            idHuyen: values.Huyen,
            idXa: values.Xa,
            diaChiCuThe: values.DiaChi,
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
                        <Box className="border rounded-md shadow-md p-5">
                            <form onSubmit={handleSubmit(handleAddAddress)}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            type="text"
                                            label="Họ và tên"
                                            className={`border border-gray-300 p-2 w-full rounded-lg ${
                                                errors.AddressName ? 'border-red-500' : ''
                                            }`}
                                            {...register('AddressName', { required: true })}
                                        />
                                        {errors.AddressName && <span className="text-red-500">Tên là bắt buộc.</span>}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            type="text"
                                            label="Địa chỉ"
                                            className={`border border-gray-300 p-2 w-full rounded-lg ${
                                                errors.DiaChi ? 'border-red-500' : ''
                                            }`}
                                            {...register('DiaChi', { required: true })}
                                        />
                                        {errors.DiaChi && <span className="text-red-500">Địa chỉ là bắt buộc.</span>}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="text"
                                            label="Tỉnh/Thành phố"
                                            className={`border border-gray-300 p-2 w-full rounded-lg ${
                                                errors.Tinh ? 'border-red-500' : ''
                                            }`}
                                            {...register('Tinh', { required: true })}
                                        />
                                        {errors.Tinh && <span className="text-red-500">Tỉnh thành là bắt buộc.</span>}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="text"
                                            label="Quận/Huyện"
                                            className={`border border-gray-300 p-2 w-full rounded-lg ${
                                                errors.Huyen ? 'border-red-500' : ''
                                            }`}
                                            {...register('Huyen', { required: true })}
                                        />
                                        {errors.Huyen && <span className="text-red-500">Huyện là bắt buộc.</span>}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="text"
                                            label="Xã/Phường"
                                            className={`border border-gray-300 p-2 w-full rounded-lg ${
                                                errors.Xa ? 'border-red-500' : ''
                                            }`}
                                            {...register('Xa', { required: true })}
                                        />
                                        {errors.Xa && <span className="text-red-500">Xã là bắt buộc.</span>}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="text"
                                            label="Số điện thoại"
                                            className={`border border-gray-300 p-2 w-full rounded-lg ${
                                                errors.Mobile ? 'border-red-500' : ''
                                            }`}
                                            {...register('Mobile', { required: true })}
                                        />
                                        {errors.Mobile && (
                                            <span className="text-red-500">Số điện thoại là bắt buộc.</span>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            sx={{ padding: '.9rem 1.5rem', backgroundColor: '#2f19ae', color: 'white' }}
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                        >
                                            Thêm Địa Chỉ
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default AddAddress;
