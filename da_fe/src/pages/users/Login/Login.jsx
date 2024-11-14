import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/auth/signin', {
                email: email,
                password: password,
            });
            const token = response.data.jwt;

            // Lưu token vào localStorage hoặc state để sử dụng trong ứng dụng
            localStorage.setItem('token', token);
            console.log('Đăng nhập thành công!', response.data);
            navigate('/');
        } catch (error) {
            if (error.response) {
                // Xử lý lỗi từ server
                setErrorMessage('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
            } else {
                setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Welcome Back!</h2>

                {errorMessage && <div className="mb-4 text-red-600 text-center">{errorMessage}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-600">Remember Me</label>
                        </div>
                        <a href="https://example.com" className="text-sm text-blue-600 hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 focus:bg-blue-500 focus:outline-none"
                    >
                        Log In
                    </button>
                </form>

                <div className="my-6 flex items-center justify-center">
                    <span className="text-sm text-gray-500">or</span>
                </div>

                <div className="flex space-x-4 justify-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
                        Login with Facebook
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none">
                        Login with Google
                    </button>
                </div>

                <p className="mt-6 text-sm text-center text-gray-500">
                    Don't have an account?{' '}
                    <a href="https://example.com" className="text-blue-600 hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
