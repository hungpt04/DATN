// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = async (event) => {
//         event.preventDefault();

//         try {
//             const response = await axios.post('http://localhost:8080/auth/signin', {
//                 email: email,
//                 password: password,
//             });
//             const token = response.data.jwt;

//             // Lưu token vào localStorage hoặc state để sử dụng trong ứng dụng
//             localStorage.setItem('token', token);
//             console.log('Đăng nhập thành công!', response.data);
//             navigate('/');
//         } catch (error) {
//             if (error.response) {
//                 // Xử lý lỗi từ server
//                 setErrorMessage('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
//             } else {
//                 setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
//             }
//         }
//     };

//     return (
//         <div className="bg-gray-100 flex items-center justify-center min-h-screen">
//             <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//                 <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Welcome Back!</h2>

//                 {errorMessage && <div className="mb-4 text-red-600 text-center">{errorMessage}</div>}

//                 <form onSubmit={handleLogin}>
//                     <div className="mb-4">
//                         <label className="block text-sm font-semibold text-gray-600">Email</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                             className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-6">
//                         <label className="block text-sm font-semibold text-gray-600">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                             className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                         />
//                     </div>

//                     <div className="flex items-center justify-between mb-6">
//                         <div className="flex items-center">
//                             <input
//                                 id="remember-me"
//                                 type="checkbox"
//                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label className="ml-2 block text-sm text-gray-600">Remember Me</label>
//                         </div>
//                         <a href="https://example.com" className="text-sm text-blue-600 hover:underline">
//                             Forgot Password?
//                         </a>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 focus:bg-blue-500 focus:outline-none"
//                     >
//                         Log In
//                     </button>
//                 </form>

//                 <div className="my-6 flex items-center justify-center">
//                     <span className="text-sm text-gray-500">or</span>
//                 </div>

//                 <div className="flex space-x-4 justify-center">
//                     <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
//                         Login with Facebook
//                     </button>
//                     <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none">
//                         Login with Google
//                     </button>
//                 </div>

//                 <p className="mt-6 text-sm text-center text-gray-500">
//                     Don't have an account?{' '}
//                     <a href="https://example.com" className="text-blue-600 hover:underline">
//                         Sign Up
//                     </a>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Login;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, UserCircleIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { jwtDecode } from 'jwt-decode';
import swal from 'sweetalert';

const InputForm = ({ value, onChange, placeholder = '' }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex items-center border-b border-gray hover:border-black mt-1">
            <LockClosedIcon className="h-7 w-7" />
            <input
                type={showPassword ? 'text' : 'password'}
                className="flex-1 p-2 outline-none"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                {showPassword ? (
                    <EyeSlashIcon className="h-6 w-6 text-500" />
                ) : (
                    <EyeIcon className="h-6 w-6 text-500" />
                )}
            </button>
        </div>
    );
};

const LoginPanel = () => {
    const [user, setUser] = useState({
        email: "",
        matKhau: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user.email || !user.matKhau || !(user.email && user.matKhau)) {
            setError("*Bạn chưa nhập thông tin tài khoản")
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/signin', {
                email: user.email,
                matKhau: user.matKhau,
            });

            const token = response.data;

            const decodedToken = jwtDecode(token);
            console.log('Decoded Token:', decodedToken); // Kiểm tra cấu trúc token

            const vaiTro = decodedToken.vaiTro || decodedToken.authorities || decodedToken.role;
            const email = decodedToken.sub || decodedToken.email;

            if (!vaiTro) {
                swal("Lỗi!", "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau!", "error");
                //    setError('*Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau!');
            }

            // Lưu token vào localStorage hoặc state
            localStorage.setItem("token", token);
            localStorage.setItem("vaiTro", vaiTro);
            localStorage.setItem("email", email);

            // Hiển thị thông báo thành công
            swal("Thành công!", "Đăng nhập thành công!", "success");


                setTimeout(() => {
                    // navigate(0)
                    if (vaiTro.toLowerCase() === 'customer' ) {
                        navigate(0)
                    } else {
                        navigate('/admin')
                    }
                }, 2000);
            

            setError("");

        } catch (error) {
            if (error.response) {
                setError("*Tài khoản hoặc mật khẩu không chính xác");
            } else {
                // Hiển thị lỗi hệ thống
                swal("Lỗi!", "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau!", "error");
                // setError("*Lỗi hệ thống. Vui lòng thử lại sau!");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-5">
                <label className="block text-base font-medium text-gray-700">
                    Tài khoản
                </label>
                <div className="flex items-center border-b border-gray hover:border-black mt-1">
                    <UserCircleIcon className="h-7 w-7" />
                    <input type="text"
                        className="flex-1 p-2 outline-none"
                        placeholder="Nhập email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        onFocus={() => setError("")}
                    />
                </div>
            </div>
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <label className="block text-base font-medium text-gray-700">
                        Mật khẩu
                    </label>
                    <div>
                        <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>
                </div>
                <InputForm
                    value={user.matKhau}
                    onChange={(e) => setUser({ ...user, matKhau: e.target.value })}
                    placeholder="Nhập mật khẩu"
                    onFocus={() => setError("")}>
                </InputForm>
            </div>
            {error && <p className="text-sm mb-3" style={{ color: "red" }}>{error}</p>}
            <div className="items-center w-full my-3 justify-center">
                <button type="submit" className="w-full bg-black py-2 mb-3 text-white rounded-md">
                    ĐĂNG NHẬP
                </button>
            </div>
        </form>
    );
};

const RegisterPanel = () => {
    const [user, setUser] = useState({
        hoTen: '',
        email: '',
        matKhau: '',
        xacNhanMatKhau: '',
    });

    const [errors, setErrors] = useState({
        email: "",
        fullName: "",
        passWord: "",
        confirmPass: ""
    })

    const navigate = useNavigate()

    //  kiểm tra email
    const checkMail = async (email) => {
        try {
            const response = await axios.get(`http://localhost:8080/auth/check-mail?email=${email}`);

            // In ra toàn bộ response để debug
            console.log('Full response:', response);

            // Kiểm tra kỹ hơn trạng thái và dữ liệu trả về
            if (response.status === 200) {
                // Nếu email đã tồn tại, trả về true
                return true;
            }

            // Nếu email chưa tồn tại, trả về false
            return false;
        } catch (error) {
            // Nếu có lỗi 404 hoặc các mã lỗi khác, nghĩa là email chưa tồn tại
            if (error.response && error.response.status === 404) {
                return false;
            }

            // Log chi tiết lỗi để debug
            console.error('Error checking email:', error);

            // Trong trường hợp có lỗi khác, coi như email chưa tồn tại
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {}
        let check = 0

        if (!user.hoTen || !user.hoTen.trim()) {
            newErrors.fullName = "*Bạn chưa nhập họ tên"
            check++
        } else if (user.hoTen.length > 100) {
            newErrors.fullName = "*Họ tên không dài quá 100 ký tự"
            check++
        } else {
            newErrors.fullName = ""
        }

        if (!user.email || !user.email.trim()) {
            newErrors.email = "*Bạn chưa nhập địa chỉ email"
            check++
        } else if (!/\S+@\S+\.\S+/.test(user.email.trim())) {
            newErrors.email = "*Địa chỉ email không hợp lệ"
            check++
        } 
        // else {
        //     // Kiểm tra email đã tồn tại
        //     const isEmailExists = await checkMail(user.email);
        //     if (isEmailExists) {
        //         newErrors.email = "*Email đã tồn tại trong hệ thống"
        //         check++
        //     }
        // }

        if (!user.matKhau || !user.matKhau.trim()) {
            newErrors.passWord = "*Bạn chưa nhập mật khẩu"
            check++
        } else if (user.matKhau.trim().length <= 5) {
            newErrors.passWord = "*Mật khẩu phải chứa ít nhất 6 ký tự"
            check++
        } else {
            newErrors.passWord = ""
        }

        if (!user.xacNhanMatKhau || !user.xacNhanMatKhau.trim()) {
            newErrors.confirmPass = "*Bạn chưa nhập lại mật khẩu"
            check++
        } else if (user.xacNhanMatKhau.trim() !== user.matKhau.trim()) {
            newErrors.confirmPass = "*Mật khẩu nhập lại không khớp"
            check++
        } else {
            newErrors.confirmPass = ""
        }

        if (check > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/signup', {
                hoTen: user.hoTen,
                email: user.email,
                matKhau: user.matKhau,
                xacNhanMatKhau: user.xacNhanMatKhau,
            });

            swal("Thành công!", "Đăng ký tài khoản thành công. Đăng nhập ngay nào!", "success");
            setErrors({});
            // reset
            setUser({
                hoTen: "",
                email: "",
                matKhau: "",
                xacNhanMatKhau: "",
            });
            setTimeout(() => {
                navigate(0);
            }, 2000);
        } catch (err) {
            if (err.response) {
                swal("Thất bại!", "Đăng ký không thành công!", "error");
                // setErrors('Đăng ký không thành công!');
            } else {
                // swal("Lỗi!", "Đã xảy ra lỗi. Vui lòng thử lại sau!", "error");
                setErrors('Lỗi hệ thống. Vui lòng thử lại sau.');
            }
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-1">
                <label className="block text-base font-medium text-gray-700">Họ và tên</label>
                <div className="flex items-center border-b border-gray hover:border-black mt-1">
                    <UserCircleIcon className="h-7 w-7" />
                    <input
                        type="text"
                        className="flex-1 p-2 outline-none"
                        value={user.hoTen}
                        onChange={(e) => {
                            setUser({ ...user, hoTen: e.target.value })
                            setErrors({ ...errors, fullName: "" })
                        }}
                    />
                </div>
            </div>
            <div className="mb-3">{errors.fullName && (<p className="text-sm" style={{ color: "red" }}>{errors.fullName}</p>)}</div>
            <div className="mb-1">
                <label className="block text-base font-medium text-gray-700">Địa chỉ email</label>
                <div className="flex items-center border-b border-gray hover:border-black mt-1">
                    <EnvelopeIcon className="h-7 w-7" />
                    <input
                        type="text"
                        className="flex-1 p-2 outline-none"
                        value={user.email}
                        onChange={(e) => {
                            setUser({ ...user, email: e.target.value })
                            setErrors({ ...errors, email: "" })
                        }}
                    />
                </div>
            </div>
            <div className="mb-3">{errors.email && (<p className="text-sm" style={{ color: "red" }}>{errors.email}</p>)}</div>
            <div className="mb-1">
                <div className="flex justify-between items-center">
                    <label className="block text-base font-medium text-gray-700">Mật khẩu</label>
                </div>
                <InputForm
                    value={user.matKhau}
                    onChange={(e) => {
                        setUser({ ...user, matKhau: e.target.value })
                        setErrors({ ...errors, passWord: "" })
                    }}
                ></InputForm>
            </div>
            <div className="mb-3">{errors.passWord && <p className="text-sm" style={{ color: "red" }}>{errors.passWord}</p>}</div>
            <div className="mb-1">
                <div className="flex justify-between items-center">
                    <label className="block text-base font-medium text-gray-700">Xác nhận mật khẩu</label>
                </div>
                <InputForm
                    value={user.xacNhanMatKhau}
                    onChange={(e) => {
                        setUser({ ...user, xacNhanMatKhau: e.target.value })
                        setErrors({ ...errors, confirmPass: "" })
                    }}
                ></InputForm>
            </div>
            <div className="mb-5">{errors.confirmPass && <p className="text-sm" style={{ color: "red" }}>{errors.confirmPass}</p>}</div>
            <div className="w-full my-2 justify-center">
                <button type="submit" className="w-full bg-black py-2 mb-3 text-white rounded-md">
                    ĐĂNG KÝ
                </button>
            </div>
        </form>
    );
};

export default function Login() {
    const token = localStorage.getItem('token');
    // const vaiTro = localStorage.getItem('vaiTro');
    const [isLogin, setIsLogin] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const vaiTro = localStorage.getItem('vaiTro');
        setIsAuthenticated(!!token && !!vaiTro);
        // setIsAuthenticated(!!token);
    }, []);

    const switchToLogin = () => setIsLogin(true);
    const switchToRegister = () => setIsLogin(false);

    if (isAuthenticated) {
        return <Navigate to="/" replace={true} />;
    }
    return token ? (
        <Navigate to="/" />
    ) : (
        <div className="flex justify-center items-center bg-gray-100" style={{ padding: '40px' }}>
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-prose">
                <div className="text-center mb-6">
                    <div className="mb-2 text-2xl font-semibold uppercase">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</div>
                    <div className="mb-4">
                        {isLogin ? (
                            <p className="text-base font-normal text-gray-700">
                                Bạn chưa có tài khoản?{' '}
                                <button className="text-blue-600 hover:text-blue-700" onClick={switchToRegister}>
                                    Đăng ký ngay
                                </button>
                            </p>
                        ) : (
                            <p className="text-base font-normal text-gray-700">
                                Đã có tài khoản, đăng nhập{' '}
                                <button className="text-blue-600 hover:text-blue-700" onClick={switchToLogin}>
                                    tại đây
                                </button>
                            </p>
                        )}
                    </div>
                </div>
                {isLogin ? <LoginPanel /> : <RegisterPanel />}
            </div>
        </div>
    );
}
