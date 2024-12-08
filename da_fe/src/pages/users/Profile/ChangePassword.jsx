import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [errors, setErrors] = useState({
    passOld: '',
    newPass: '',
    confirmPass: '',
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Giả sử bạn lưu token trong localStorage

  const handleTogglePasswordVisibility = (field) => {
    switch (field) {
      case 'currentPassword':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'newPassword':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirmNewPassword':
        setShowConfirmNewPassword(!showConfirmNewPassword);
        break;
      default:
        break;
    }
  };

  const handleChangePassword = () => {
    const newErrors = {};
    let check = 0;

    if (!currentPassword) {
      newErrors.passOld = '*Vui lòng nhập mật khẩu cũ';
      check++;
    }

    if (!newPassword) {
      newErrors.newPass = '*Vui lòng nhập mật khẩu mới';
      check++;
    } else if (newPassword.length < 5) {
      newErrors.newPass = '*Mật khẩu mới phải chứa ít nhất 6 kí tự.';
      check++;
    }

    if (!confirmNewPassword) {
      newErrors.confirmPass = '*Vui lòng xác nhận lại mật khẩu mới';
      check++;
    }

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmPass = '*Mật khẩu mới và xác nhận mật khẩu mới không khớp';
      check++;
    }

    if (check > 0) {
      setErrors(newErrors);
      return;
    }

    // Giả lập thành công đổi mật khẩu
    swal("Thành công!", "Cập nhật mật khẩu thành công", "success")

    setErrors("");

    setTimeout(() => {
      navigate("/profile/user")
    }, 2000)
    
  };

  return (
    <div className="mx-2 my-2">
      <h2 className="text-2xl font-semibold mb-4">Đổi mật khẩu</h2>
      <p className="mb-4">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
      <hr className="mb-4" />
      <div className='max-w-md mx-auto p-3'>
        <form className="space-y-5">
          <div>
            <label className="block text-base font-medium mb-1">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                className={"w-full p-2 border border-gray-400 rounded hover:border-gray-700"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setErrors({ ...errors, passOld: '' });
                }}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => handleTogglePasswordVisibility('currentPassword')}
              >
                {showCurrentPassword ? 'Ẩn' : 'Hiện'}
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
                type={showNewPassword ? 'text' : 'password'}
                className={"w-full p-2 border border-gray-400 rounded hover:border-gray-700"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors({ ...errors, newPass: '' });
                }}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => handleTogglePasswordVisibility('newPassword')}
              >
                {showNewPassword ? 'Ẩn' : 'Hiện'}
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
                type={showConfirmNewPassword ? 'text' : 'password'}
                className={"w-full p-2 border border-gray-400 rounded hover:border-gray-700"}
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  setErrors({ ...errors, confirmPass: '' });
                }}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => handleTogglePasswordVisibility('confirmNewPassword')}
              >
                {showConfirmNewPassword ? 'Ẩn' : 'Hiện'}
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