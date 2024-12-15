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
    oldPass: "",
    newPass: "",
    confirmPass: ""
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

    if (!formData.matKhau) {
      newErrors.oldPass = "*Bạn chưa nhập mật khẩu hiện tại";
      check++;
    } else {
      try {
        const checkPasswordResponse = await axios.get(
          "http://localhost:8080/auth/check-pass", 
          {
            params: { currentPassword: formData.matKhau },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
  
        // Kiểm tra kết quả trả về
        if (!checkPasswordResponse.data) {
          newErrors.oldPass = "*Mật khẩu hiện tại không đúng";
          check++;
        }
      } catch (error) {
        console.error("Lỗi kiểm tra mật khẩu:", error);
        
        // Xử lý chi tiết lỗi
        if (error.response) {
          newErrors.oldPass = error.response.data || "*Có lỗi xảy ra khi kiểm tra mật khẩu";
        } else {
          newErrors.oldPass = "*Có lỗi xảy ra khi kiểm tra mật khẩu";
        }
        check++;
      }
    }

    if (!formData.matKhauMoi) {
      newErrors.newPass = "*Bạn chưa nhập mật khẩu mới";
      check++;
    } else if (formData.matKhauMoi.length < 6) {
      newErrors.newPass = "*Mật khẩu mới phải chứa ít nhất 6 kí tự.";
      check++;
    } else {
      newErrors.newPass = ""
    }

    if (!formData.xacNhanMkMoi) {
      newErrors.confirmPass = "*Bạn chưa xác nhận lại mật khẩu mới";
      check++;
    } else {
      if (formData.matKhauMoi !== formData.xacNhanMkMoi) {
        newErrors.confirmPass = "*Mật khẩu mới và xác nhận mật khẩu mới không khớp";
        check++;
      } else {
        newErrors.confirmPass = ""
      }
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
                className={`w-full p-2 border border-gray-400 rounded hover:border-gray-700 ${errors.oldPass ? "border-red-500 hover:border-red-600 focus:outline-red-500" : ""}`}
                name="matKhau"
                value={formData.matKhau}
                onChange={(e) => {
                  handleInputChange(e)
                  setErrors({ ...errors, oldPass: "" })
                }}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => handleTogglePasswordVisibility("currentPassword")}
              >
                {showCurrentPassword ? "Ẩn" : "Hiện"}
              </button>
              {errors.oldPass && <p className="text-sm" style={{ color: "red" }}>{errors.oldPass}</p>}
            </div>
          </div>

          <div>
            <label className="block text-base font-medium mb-1">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className={`w-full p-2 border border-gray-400 rounded hover:border-gray-700 ${errors.newPass ? "border-red-500 hover:border-red-500 focus:outline-red-500" : ""}`}
                name="matKhauMoi"
                value={formData.matKhauMoi}
                onChange={(e) => {
                  handleInputChange(e)
                  setErrors({ ...errors, newPass: "" })
                }}
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
                className={`w-full p-2 border border-gray-400 rounded hover:border-gray-700 ${errors.confirmPass ? "border-red-500 hover:border-red-600 focus:outline-red-500" : ""}`}
                name="xacNhanMkMoi"
                value={formData.xacNhanMkMoi}
                onChange={(e) => {
                  handleInputChange(e)
                  setErrors({ ...errors, confirmPass: "" })
                }}
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