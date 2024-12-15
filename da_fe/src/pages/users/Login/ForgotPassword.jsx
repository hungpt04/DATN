import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";
import "./ForgotPassword.css"
import axios from "axios";
import swal from "sweetalert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otp2, setOtp2] = useState("");
  const [matKhauMoi, setMatKhauMoi] = useState("");
  const [xacNhanMkMoi, setXacNhanMkMoi] = useState("");
  const [isRobot, setIsRobot] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    matKhauMoi: "",
    xacNhanMkMoi: "",
  });

  //  kiểm tra email
  const checkMail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/auth/check-mail?email=${email}`);
      console.log('Full response data:', response.data);

      // Log thông tin chi tiết để kiểm tra
      console.log('Response status:', response.status);
      console.log('Email from response:', response.data.email);

      // Kiểm tra nhiều điều kiện
      return !!(response.data &&
        response.data.id &&
        response.data.email === email);
    } catch (error) {
      // Xử lý chi tiết các loại lỗi
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log('Error data:', error.response.data);
        console.log('Error status:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error message:', error.message);
      }

      return false;
    }
  };

  // gửi OTP
  const sendOtp = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/auth/send-otp?email=${email}`);
      console.log('Full OTP response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);

      // Kiểm tra và xử lý response
      if (response.data) {
        return {
          success: true,
          data: response.data.toString()
        };
      } else {
        throw new Error("Gửi mã OTP không thành công");
      }
    } catch (error) {
      console.error('Full OTP send error:', error);
      throw new Error("Gửi mã OTP không thành công");
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setErrors({ ...errors, email: "*Bạn chưa nhập địa chỉ email" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ ...errors, email: "*Địa chỉ email không hợp lệ" });
      return;
    }

    try {
      const isEmailValid = await checkMail(email);
      console.log('Email validation result:', isEmailValid);

      if (!isEmailValid) {
        toast.error("Email không tồn tại trong hệ thống");
        return;
      }

      const sendma = await sendOtp(email);
      console.log('Send OTP result:', sendma);

      if (sendma.success) {
        setOtp2(sendma.data);
        toast.info("Mã OTP đã được gửi đến email của bạn");
      } else {
        toast.error("Không thể gửi mã OTP");
        return;
      }

      setErrors({ ...errors, email: "" });
      setStep(2);
    } catch (error) {
      console.error('Full error:', error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    let hasError = false;
    const newErrors = {};

    if (!otp) {
      newErrors.otp = "*Ban chưa nhập mã OTP"
      hasError = true;
    } else if (otp != otp2) {
      newErrors.otp = "*Mã OTP không chính xác"
      hasError = true
    } else {
      newErrors.otp = ""
    }

    if (!matKhauMoi) {
      newErrors.matKhauMoi = "*Bạn chưa nhập mật khẩu mới";
      hasError = true;
    } else if (matKhauMoi.length < 6) {
      newErrors.matKhauMoi = "*Mật khẩu phải có ít nhất 6 ký tự"
      hasError = true
    } else {
      newErrors.matKhauMoi = ""
    }

    if (!xacNhanMkMoi) {
      newErrors.xacNhanMkMoi = "*Bạn chưa xác nhận mật khẩu";
      hasError = true;
    } else if (matKhauMoi !== xacNhanMkMoi) {
      newErrors.xacNhanMkMoi = "*Mật khẩu và xác nhận mật khẩu không khớp";
      hasError = true;
    } else {
      newErrors.xacNhanMkMoi = ""
    }

    if (hasError) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    if (!isRobot) {
      toast.error("Xác minh bạn không phải robot");
      return;
    }

    if (isRobot && otp === otp2 && matKhauMoi === xacNhanMkMoi) {
      try {
        const response = await axios.post("http://localhost:8080/auth/forgot-password", {
          email,
          otp,
          matKhauMoi,
        })
        console.log("Cập nhật được rồi nè")
        swal("Thành công!", "Cập nhật mật khẩu thành công, đăng nhập ngay thôi!", "success")
        toast.success(response.data)
        setErrors("")
        // toast.success(response.data)
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } catch (error) {
        toast.error("Đặt lại mật khẩu không thành công: " + error.response.data)
      }
    } else {
      toast.error("Xác nhận không thành công")
    }
  };

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  const token = localStorage.getItem("token");
  return token ? (
    <Navigate to={"/home"} />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h1 className="mb-4 text-lg font-semibold text-center uppercase">Quên Mật Khẩu</h1>
        <form className="mt-4">
          {step === 1 && (
            <>
              <div className="mb-4 relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập email"
                  className={`mt-1 block w-full p-2 border rounded ${errors.email ? "border-red-500 outline-red-500" : "border-gray-300"}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                />
                {errors.email && <p className="text-sm" style={{color: "red"}}>{errors.email}</p>}
              </div>
              <button
                type="button"
                className="sub-otp w-full text-white py-2 rounded-sm focus:outline-none"
                onClick={handleSendOtp}>
                Gửi Mã OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Mã OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  className={`mt-1 block w-full p-2 border hover:border-gray-500 rounded-sm ${errors.otp ? "border-red-500 hover:border-red-600 outline-red-500" : "border-gray-500"}`}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (e.target.value) {
                      setErrors({ ...errors, otp: "" });
                    }
                  }}
                />
                {errors.otp && <p className="text-sm" style={{color: "red"}}>{errors.otp}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className={`mt-1 block w-full p-2 border hover:border-gray-500 rounded-sm ${errors.matKhauMoi ? "border-red-500 hover:border-red-600 outline-red-500" : "border-gray-500"}`}
                  value={matKhauMoi}
                  onChange={(e) => {
                    setMatKhauMoi(e.target.value);
                    if (e.target.value) {
                      setErrors({ ...errors, matKhauMoi: "" });
                    }
                  }}
                />
                {errors.matKhauMoi && <p className="text-sm" style={{color: "red"}}>{errors.matKhauMoi}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác Nhận Mật Khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`mt-1 block w-full p-2 border hover:border-gray-500 rounded-sm ${errors.xacNhanMkMoi ? "border-red-500 hover:border-red-600 outline-red-500" : "border-gray-500"}`}
                  value={xacNhanMkMoi}
                  onChange={(e) => {
                    setXacNhanMkMoi(e.target.value);
                    if (e.target.value) {
                      setErrors({ ...errors, xacNhanMkMoi: "" });
                    }
                  }}
                />
                {errors.xacNhanMkMoi && <p className="text-sm" style={{color: "red"}}>{errors.xacNhanMkMoi}</p>}
              </div>
              <ReCAPTCHA
                sitekey="6Lf3KwwpAAAAAJriNTbY4LqBvuI1aiRzTNb14cVd"
                onChange={() => setIsRobot(true)}
              />
              <button
                type="button"
                className="sub-otp w-full text-white py-2 mt-4 rounded-sm"
                onClick={handleResetPassword}>
                Đặt Lại Mật Khẩu
              </button>
            </>
          )}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;