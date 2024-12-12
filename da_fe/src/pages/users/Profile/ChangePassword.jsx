import React, { useState } from "react";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import swal from "sweetalert";
import axios from "axios";

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    matKhau: "",
    matKhauMoi: "",
    xacNhanMkMoi: ""
  })

  const [errors, setErrors] = useState({
    matKhau: "",
    matKhauMoi: "",
    xacNhanMkMoi: ""
  });

  const navigate = useNavigate();
  // const token = localStorage.getItem("token");

  const handleTogglePasswordVisibility = (field) => {
    switch (field) {
      case "currentPassword":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmNewPassword":
        setShowConfirmNewPassword(!showConfirmNewPassword);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    })
  }

  const handleChangePassword = async (e) => {
    const newErrors = {};
    let check = 0;

    if (formData.matKhau === null) {
      newErrors.matKhau = "*Vui lòng nhập mật khẩu cũ";
      check++;
    }

    if (formData.matKhauMoi === null) {
      newErrors.matKhauMoi = "*Vui lòng nhập mật khẩu mới";
      check++;
    } else if (formData.matKhauMoi.length < 5) {
      newErrors.matKhauMoi = "*Mật khẩu mới phải chứa ít nhất 6 kí tự.";
      check++;
    }

    if (formData.xacNhanMkMoi === null) {
      newErrors.xacNhanMkMoi = "*Vui lòng xác nhận lại mật khẩu mới";
      check++;
    }

    if (formData.matKhauMoi !== formData.xacNhanMkMoi) {
      newErrors.xacNhanMkMoi = "*Mật khẩu mới và xác nhận mật khẩu mới không khớp";
      check++;
    }

    if (check > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/tai-khoan/change-password", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (response.status !== 200) throw new Error("Đổi mật khẩu không thành công");

      swal("Thành công!", "Cập nhật mật khẩu thành công", "success")

      setErrors("");

      setTimeout(() => {
        navigate("/profile/user")
      }, 2000)

    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: error.message || "Có lỗi xảy ra khi cập nhật mật khẩu!",
      });
    }

  };

  return (
    <div className="mx-2 my-2">
      <h2 className="text-2xl font-semibold mb-4">Đổi mật khẩu</h2>
      <p className="mb-4">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
      <hr className="mb-4" />
      <div className="max-w-md mx-auto p-3">
        <form className="space-y-5">
          <div>
            <label className="block text-base font-medium mb-1">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className={"w-full p-2 border border-gray-400 rounded hover:border-gray-700"}
                name="matKhau"
                value={formData.matKhau}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => handleTogglePasswordVisibility("currentPassword")}
              >
                {showCurrentPassword ? "Ẩn" : "Hiện"}
              </button>
              {errors.passOld && <p className="text-sm" style={{ color: "red" }}>{errors.passOld}</p>}
            </div>
          </div>

          <div>
            <label className="block text-base font-medium mb-1">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className={"w-full p-2 border border-gray-400 rounded hover:border-gray-700"}
                name="matKhauMoi"
                value={formData.matKhauMoi}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => handleTogglePasswordVisibility("newPassword")}
              >
                {showNewPassword ? "Ẩn" : "Hiện"}
              </button>
              {errors.newPass && <p className="text-sm" style={{ color: "red" }}>{errors.newPass}</p>}
            </div>
          </div>

          <div>
            <label className="block text-base font-medium mb-1">
              Nhập lại mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                className={"w-full p-2 border border-gray-400 rounded hover:border-gray-700"}
                name="xacNhanMkMoi"
                value={formData.xacNhanMkMoi}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => handleTogglePasswordVisibility("confirmNewPassword")}
              >
                {showConfirmNewPassword ? "Ẩn" : "Hiện"}
              </button>
              {errors.confirmPass && <p className="text-sm mb-2" style={{ color: "red" }}>{errors.confirmPass}</p>}
            </div>
          </div>

          <button
            type="button"
            className="bg-blue-500 text-white px-7 py-2 rounded hover:bg-blue-600"
            onClick={handleChangePassword}
          >
            Đổi Mật Khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;