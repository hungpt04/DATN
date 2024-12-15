package com.example.da_be.service;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<TaiKhoan> taiKhoanOpt = taiKhoanRepository.findByEmail(email);

        // Kiểm tra nếu tài khoản không tồn tại
        if (taiKhoanOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        // Lấy tài khoản từ Optional
        TaiKhoan taiKhoan = taiKhoanOpt.get();

        // Kiểm tra nếu mật khẩu chưa được thiết lập
        if (taiKhoan.getMatKhau() == null) {
            throw new UsernameNotFoundException("Password is not set for user: " + email);
        }

        // Trả về đối tượng CustomUserDetails
        return new CustomUserDetails(taiKhoan);
    }

}
