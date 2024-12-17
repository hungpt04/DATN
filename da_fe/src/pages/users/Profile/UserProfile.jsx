import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { User } from 'react-feather'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Đảm bảo import đúng

export default function UserProfile() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [khachHang, setKhachHang] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    ngaySinh: "",
    gioiTinh: 0,
    avatar: "",
  });

  const [errorsKH, setErrorsKH] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateBirth: "",
    gender: "",
  })

  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/tai-khoan/my-info", {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          });
          setKhachHang(response.data);
          setPreviewImage(response.data.avatar)
          // console.log('h', response.data)
          // console.log('id:', response.data.id)
        } catch (error) {
          console.error("Error fetching user data:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Có lỗi xảy ra khi tải dữ liệu!",
          });
        }

      };

      fetchUserInfo();
    }
  }, [navigate]);

  const handleInputChange = (event) => {
    setKhachHang({ ...khachHang, [event.target.name]: event.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKhachHang({ ...khachHang, avatar: file })
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file);
    }
  };

  // const isPhoneNumberDuplicate = (sdt, currentId) => {
  //   return customers.some(
  //     (customer) => customer.sdt === sdt && customer.id !== currentId,
  //   )
  // }

  const handleUpdateCustomer = async (event) => {
    event.preventDefault();
    const newErrors = {}
    // Lấy ngày hiện tại
    const currentDate = new Date()
    const minBirthYear = 1900
    let check = 0

    const cleanedFullName = khachHang.hoTen.trim()

    if (!cleanedFullName) {
      newErrors.fullName = "*Bạn chưa nhập họ tên"
      check++
    } else if (cleanedFullName.length > 100) {
      newErrors.fullName = "*Họ tên không dài quá 100 ký tự"
      check++
    } else {
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
      if (specialCharsRegex.test(cleanedFullName)) {
        newErrors.fullName = "*Họ tên không chứa ký tự đặc biệt"
        check++
      } else {
        newErrors.fullName = ""
      }
    }

    if (!khachHang.sdt.trim()) {
      newErrors.phoneNumber = "*Bạn chưa nhập số điện thoại"
      check++
    } else {
      const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
      if (!phoneNumberRegex.test(khachHang.sdt.trim())) {
        newErrors.phoneNumber = "*Số điện thoại không hợp lệ"
        check++
      }
      else {
        newErrors.phoneNumber = ""
      }
    }

    if (!khachHang.ngaySinh) {
      newErrors.dateBirth = "*Bạn chưa nhập ngày sinh";
      check++;
    } else {
      const ngaySinh = new Date(khachHang.ngaySinh); // Chuyển đổi ngày sinh thành đối tượng Date
      if (isNaN(ngaySinh.getTime())) { // Kiểm tra xem ngày có hợp lệ không
        newErrors.dateBirth = "*Ngày sinh không hợp lệ";
        check++;
      } else if (ngaySinh.getFullYear() < minBirthYear) { // Kiểm tra năm sinh
        newErrors.dateBirth = "*Năm sinh không hợp lệ";
        check++;
      } else if (ngaySinh > currentDate) { // Kiểm tra xem ngày sinh có lớn hơn ngày hiện tại không
        newErrors.dateBirth = "*Ngày sinh không được lớn hơn ngày hiện tại";
        check++;
      } else {
        newErrors.dateBirth = "";
      }
    }

    if (khachHang.gioiTinh === null) {
      newErrors.gender = "*Bạn chưa chọn giới tính"
      check++
    } else {
      newErrors.gender = ""
    }

    if (check > 0) {
      setErrorsKH(newErrors)
      return
    }

    try {

      const formDataToSend = new FormData()

      formDataToSend.append('hoTen', khachHang.hoTen)
      formDataToSend.append('email', khachHang.email)
      formDataToSend.append('sdt', khachHang.sdt)
      formDataToSend.append('ngaySinh', khachHang.ngaySinh)
      formDataToSend.append('gioiTinh', khachHang.gioiTinh)

      if (khachHang.avatar) {
        formDataToSend.append('avatar', khachHang.avatar);
      }

      // Cập nhật thông tin người dùng
      const userResponse = await axios.put(`http://localhost:8080/api/tai-khoan/updateTaiKhoan/${khachHang.id}`, formDataToSend, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
        },
        // body: formDataToSend
      });

      if (userResponse.status !== 200) throw new Error("Cập nhật tài khoản không thành công");

      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Cập nhật tài khoản thành công!',
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Có lỗi xảy ra khi cập nhật tài khoản!',
      });
    }
  };

  return (
    <div className="mx-2 my-2">
      <p className="text-2xl font-semibold mb-2">Hồ sơ của tôi</p>
      <p className="text-gray-500 mb-2">Quản lý thông tin hồ sơ tài khoản</p>
      <hr className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
            <input
              type="text"
              name="hoTen"
              className={`w-full px-4 py-2 border rounded outline-blue-500 hover:border-gray-700 ${errorsKH.fullName ? "focus:outline-red-500 border-red-500 hover:border-red-600" : ""}`}
              value={khachHang.hoTen}
              onChange={(event) => {
                handleInputChange(event)
                setErrorsKH({ ...errorsKH, fullName: "" }); // Reset lỗi khi người dùng nhấn vào ô input
              }}
            />
            {errorsKH.fullName && <p className="text-sm " style={{ color: "red" }}>{errorsKH.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded cursor-not-allowed text-zinc-500"
              value={khachHang.email}
              disabled
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input
              type="text"
              name="sdt"
              className={`w-full px-4 py-2 border rounded outline-blue-500 hover:border-gray-700 ${errorsKH.phoneNumber ? "focus:outline-red-500 border-red-500 hover:border-red-600" : ""}`}
              value={khachHang.sdt}
              onChange={(event) => {
                handleInputChange(event)
                setErrorsKH({ ...errorsKH, phoneNumber: "" });

              }}
            />
            {errorsKH.phoneNumber && <p className="text-sm" style={{ color: "red" }}>{errorsKH.phoneNumber}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
            <input
              type="date"
              name="ngaySinh"
              className={`w-full px-4 py-2 border rounded outline-blue-500 hover:border-gray-700 ${errorsKH.dateBirth ? "focus:outline-red-500 border-red-500 hover:border-red-600" : ""}`}
              value={khachHang.ngaySinh}
              onChange={(event) => {
                handleInputChange(event)
                setErrorsKH({ ...errorsKH, dateBirth: "" })

              }}
            />
            {errorsKH.dateBirth && <p className="text-sm" style={{ color: "red" }}>{errorsKH.dateBirth}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Giới tính</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gioiTinh"
                  value={0}
                  checked={khachHang.gioiTinh === 0}
                  onChange={(e) => {
                    setKhachHang({ ...khachHang, gioiTinh: parseInt(e.target.value) });
                    setErrorsKH({ ...errorsKH, gender: "" });
                  }}
                />
                <span>Nam</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gioiTinh"
                  value={1}
                  checked={khachHang.gioiTinh === 1}
                  onChange={(e) => {
                    setKhachHang({ ...khachHang, gioiTinh: parseInt(e.target.value) });
                    setErrorsKH({ ...errorsKH, gender: "" }); // Reset lỗi khi người dùng chọn giới tính
                  }}
                />
                <span>Nữ</span>
              </label>
            </div>
            {errorsKH.gender && <p className="text-sm" style={{ color: "red" }}>{errorsKH.gender}</p>}
          </div>

          <button
            onClick={handleUpdateCustomer}
            className="px-7 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Lưu
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mt-2 gap-3">
          {/* <div
            className="w-40 h-40 border-solid border-2 rounded-full overflow-hidden flex justify-center items-center cursor-pointer"
            onClick={() => document.getElementById("select-avatar").click()}>
            {khachHang.avatar ? (
              <img src={khachHang.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User  className="text-gray-400 w-full h-full"></User >
            )}
          </div> */}
          <div className="flex justify-center items-center mt-4">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 overflow-hidden">
                {previewImage ? (
                  <img src={previewImage || khachHang.avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  'Chọn ảnh'
                )}
              </div>
            </label>
          </div>
          <input
            hidden
            id="select-avatar"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button
            onClick={() => document.getElementById("select-avatar").click()}
            className="px-4 py-2 border text-gray-600 rounded hover:bg-gray-100 transition">
            Chọn ảnh
          </button>
          <p className="text-gray-500 text-sm">Dung lượng file tối đa 1 MB</p>
          <p className="text-gray-500 text-sm">Định dạng: .JPEG, .PNG</p>
        </div>
      </div>
    </div>
  );
}