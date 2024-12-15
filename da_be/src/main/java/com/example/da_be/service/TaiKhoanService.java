package com.example.da_be.service;

import com.example.da_be.config.JwtTokenProvider;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.exception.ResourceNotFoundException;
import com.example.da_be.repository.TaiKhoanRepository;

import com.google.gson.JsonParseException;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.da_be.request.ChangeRequest;
import com.google.gson.JsonParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaiKhoanService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<TaiKhoan> getAllTaiKhoan() {
        return taiKhoanRepository.findAll();
    }

    public TaiKhoan getTaiKhoanById(int id) {
        Optional<TaiKhoan> taiKhoan = taiKhoanRepository.findById(id);
        return taiKhoan.orElse(null);
    }

    public TaiKhoan saveOrUpdateTaiKhoan(TaiKhoan taiKhoan) {
        return taiKhoanRepository.save(taiKhoan);
    }

    public TaiKhoan deleteTaiKhoanById(int id) {
        TaiKhoan taiKhoan = taiKhoanRepository.findById(id).orElse(null);
        assert taiKhoan != null;
        if (taiKhoan.getTrangThai() == 0) {
            taiKhoan.setTrangThai(1);
        } else {
            taiKhoan.setTrangThai(0);
        }
        return taiKhoanRepository.save(taiKhoan);
    }

    public Boolean changePassword(String email, ChangeRequest request) {
        // Tìm tài khoản theo email
        Optional<TaiKhoan> taiKhoanOpt = taiKhoanRepository.findByEmail(email);

        if (taiKhoanOpt.isEmpty()) {
            System.out.println("Không tìm thấy tài khoản");
            return false;
        }

        TaiKhoan taiKhoan = taiKhoanOpt.get();

        // Kiểm tra mật khẩu cũ có khớp không
        if (!passwordEncoder.matches(request.getMatKhau(), taiKhoan.getMatKhau())) {
            System.out.println("Mật khẩu cũ không chính xác");
            return false;
        }

        // Kiểm tra mật khẩu mới
        String matKhauMoi = request.getMatKhauMoi();
        if (matKhauMoi == null || matKhauMoi.trim().isEmpty()) {
            System.out.println("Mật khẩu mới không được để trống");
            return false;
        }

        // Cập nhật mật khẩu
        taiKhoan.setMatKhau(passwordEncoder.encode(matKhauMoi));
        taiKhoanRepository.save(taiKhoan);

        System.out.println("Thay đổi mật khẩu thành công");
        return true;
    }


//    private String generatePassword() {
//        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//
//        StringBuilder password = new StringBuilder();
//
//        SecureRandom random = new SecureRandom();
//
//        for (int i = 0; i < 12; i++) {
//            int randomIndex = random.nextInt(CHARACTERS.length());
//            char randomChar = CHARACTERS.charAt(randomIndex);
//            password.append(randomChar);
//        }
//
//        return password.toString();
//    }

//    public Page<TaiKhoan> searchNhanVien(NhanVienSearch search, Pageable pageable) {
//        return taiKhoanRepository.getSearchNhanVienAndPhanTrang(search, pageable);
//    }

//    public Page<TaiKhoan> searchKhachHang(KhachHangSearch search, Pageable pageable) {
//        return taiKhoanRepository.getSearchKhacHangAndPhanTrang(search, pageable);
//    }

    public Optional<TaiKhoan> getMyInfo(String token) {
        try {
            String email = jwtTokenProvider.getEmailFromJwtToken(token);
            Optional<TaiKhoan> taiKhoan = taiKhoanRepository.findByEmail(email);

            // Kiểm tra xem tài khoản có tồn tại không
            if (taiKhoan == null) {
                throw new ResourceNotFoundException("Tài khoản không tồn tại với email: " + email);
            }

            return taiKhoan;
        } catch (JsonParseException e) {
            throw new RuntimeException("Token không hợp lệ: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

}
