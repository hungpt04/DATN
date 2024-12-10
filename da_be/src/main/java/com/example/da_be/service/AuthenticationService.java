package com.example.da_be.service;

import com.example.da_be.config.JwtTokenProvider;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.repository.TaiKhoanRepository;
import com.example.da_be.request.SignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    TaiKhoanService taiKhoanService;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public TaiKhoan registerUser (SignupRequest signupRequest) {
        // Kiểm tra xem email đã tồn tại chưa
        TaiKhoan existingTaiKhoan = taiKhoanRepository.findByEmail(signupRequest.getEmail());
        if (null!=existingTaiKhoan) {
            throw new RuntimeException("Email đã tồn tại!"); // Ném ra lỗi nếu email đã có trong hệ thống
        }

        // Tạo tài khoản mới
        TaiKhoan taiKhoan = new TaiKhoan();
        taiKhoan.setHoTen(signupRequest.getHoTen());
        taiKhoan.setEmail(signupRequest.getEmail());

        // Mã hóa mật khẩu trước khi lưu
        taiKhoan.setMatKhau(passwordEncoder.encode(signupRequest.getMatKhau()));

//         Thiết lập vai trò mặc định là "Customer"
        taiKhoan.setVaiTro("Customer");
        taiKhoan.setTrangThai(1); // Hoặc trạng thái mặc định nào đó
        return taiKhoanRepository.save(taiKhoan);
    }

    public TaiKhoan findTaiKhoanByEmail(String email) {
        return taiKhoanRepository.findByEmail(email);
    }


//    public boolean checkMail(String email) {
//        return taiKhoanRepository.checkMail(email).isPresent();
//    }
}
