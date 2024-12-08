import React, { useState } from "react";
// import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Gửi OTP tới:", email);
  };

  return (
    <div className="flex justify-center items-center h-80 p-10 bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-5">Quên Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="mail-input w-full hover:border-black"
              placeholder=" "
              autoFocus
              required
            />
            <label htmlFor="email" className="mail-text">
              Email *
            </label>
          </div>
          <button type="submit" className="sub-otp w-full text-white py-2 rounded-md focus:outline-none">
            XÁC NHẬN
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;