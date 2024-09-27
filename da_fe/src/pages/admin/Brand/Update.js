import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";

function Update() {
  const { id } = useParams(); // Lấy ID thương hiệu từ URL
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  const [loading, setLoading] = useState(true); // Track loading state


  // Fetch existing brand details
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/thuonghieu/${id}`);
        const brand = response.data;
        // Điền giá trị vào form khi dữ liệu được tải thành công
        setValue("brandName", brand.ten);
        setValue("status", brand.trangThai.toString()); // Chuyển số thành chuỗi cho radio button
        setLoading(false); // Kết thúc trạng thái tải
      } catch (error) {
        console.error("Error fetching the brand data", error);
        swal("Lỗi!", "Không thể tải dữ liệu thương hiệu!", "error");
        setLoading(false); // Thậm chí khi lỗi xảy ra, vẫn kết thúc trạng thái tải
      }
    };

    fetchBrand();
  }, [id, setValue]);

  const handleUpdate = async (values) => {
    const updatedBrand = {
      ten: values.brandName,
      trangThai: values.status === "1" ? 1 : 0, // Chuyển chuỗi thành số nguyên
    };

    try {
      await axios.put(`http://localhost:8080/api/thuonghieu/${id}`, updatedBrand);
      swal("Thành công!", "Thương hiệu đã được cập nhật!", "success");
      navigate("/admin/quan-ly-san-pham/thuong-hieu");
    } catch (error) {
      console.error('There was an error updating the brand!', error);
      swal("Thất bại!", "Có lỗi xảy ra khi cập nhật thương hiệu!", "error");
    }
  };

  if (loading) {
    // Hiển thị trạng thái loading khi dữ liệu đang được tải
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <h4 className="text-center text-5xl font-bold text-gray-800 mb-10">Sửa thương hiệu</h4>

      <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
        {/* Hiển thị thông báo lỗi nếu có */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            <strong>Warning!</strong> Please fill out all fields correctly.
          </div>
        )}

        {/* Input tên thương hiệu */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Tên thương hiệu:</label>
          <input
            type="text"
            className={`border border-gray-300 rounded-lg w-full p-2 ${errors.brandName ? "border-red-500" : ""}`}
            {...register("brandName", { required: true })}
          />
          {errors.brandName && <span className="text-red-500">Tên thương hiệu là bắt buộc.</span>}
        </div>

        {/* Radio buttons cho trạng thái */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Trạng thái:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                className="mr-2 form-check-input"
                type="radio"
                value="1" // Trạng thái Active
                {...register("status", { required: true })}
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                className="mr-2 form-check-input"
                type="radio"
                value="0" // Trạng thái Inactive
                {...register("status", { required: true })}
              />
              Inactive
            </label>
          </div>
          {errors.status && <span className="text-red-500">Vui lòng chọn trạng thái.</span>}
        </div>

        {/* Nút submit */}
        <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-md text-xl transition duration-300">
          Sửa thương hiệu
        </button>
      </form>
    </div>
  );
}

export default Update;
