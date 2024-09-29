import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function Add() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handlePost = async (values) => {
        const newBrand = {
            ten: values.brandName,
            trangThai: values.status === '1' ? 1 : 0, // Convert string to integer
        };

        try {
            await axios.post('http://localhost:8080/api/thuonghieu', newBrand);
            swal('Thành công!', 'Thương hiệu đã được thêm!', 'success');
            navigate('/admin/quan-ly-san-pham/thuong-hieu');
        } catch (error) {
            console.error('There was an error creating the brand!', error);
            swal('Thất bại!', 'Có lỗi xảy ra khi thêm thương hiệu!', 'error');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
            <h4 className="text-center text-5xl font-bold text-gray-800 mb-10">Thêm thương hiệu</h4>

            <form onSubmit={handleSubmit(handlePost)} className="space-y-4">
                {/* Display errors if any field is invalid */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                        <strong>Warning!</strong> Please fill out all fields correctly.
                    </div>
                )}

                {/* Brand Name Input */}
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Tên thương hiệu:</label>
                    <input
                        type="text"
                        className={`border border-gray-300 rounded-lg w-full p-2 ${
                            errors.brandName ? 'border-red-500' : ''
                        }`}
                        {...register('brandName', { required: true })}
                    />
                    {errors.brandName && <span className="text-red-500">Tên thương hiệu là bắt buộc.</span>}
                </div>

                {/* Status Radio Buttons */}
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Trạng thái:</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input
                                className="mr-2 form-check-input"
                                type="radio"
                                value="1" // Active
                                {...register('status', { required: true })}
                            />
                            Active
                        </label>
                        <label className="flex items-center">
                            <input
                                className="mr-2 form-check-input"
                                type="radio"
                                value="0" // Inactive
                                {...register('status', { required: true })}
                            />
                            Inactive
                        </label>
                    </div>
                    {errors.status && <span className="text-red-500">Vui lòng chọn trạng thái.</span>}
                </div>

                {/* Submit Button */}
                <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-md text-xl transition duration-300">
                    Thêm thương hiệu
                </button>
            </form>
        </div>
    );
}

export default Add;
