package com.example.da_be.service;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.repository.TaiKhoanRepository;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.request.NhanVienSearch;
import com.example.da_be.request.TaiKhoanRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.SecureRandom;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;

@Service
public class TaiKhoanService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

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

//    public TaiKhoan add(TaiKhoanRequest taiKhoanRequest) throws ParseException, IOException {
//        String setMa = "NV" + taiKhoanRepository.findAll().size();
//        TaiKhoan taiKhoan = TaiKhoan.builder()
//                .ma(setMa)
//                .hoTen(taiKhoanRequest.getHoTen())
//                .sdt(taiKhoanRequest.getSdt())
//                .email(taiKhoanRequest.getEmail())
//                .gioiTinh(taiKhoanRequest.getGioiTinh())
//                .vaiTro(taiKhoanRequest.getVaiTro())
//                .ngaySinh(taiKhoanRequest.getNgaySinh())
//                .cccd(taiKhoanRequest.getCccd())
//                .trangThai(taiKhoanRequest.getTrangThai())
//                .build();
//
//        // Xử lý avatar
//        if (taiKhoanRequest.getAvatar() != null && !taiKhoanRequest.getAvatar().isEmpty()) {
//            String avatarPath = saveAvatar(taiKhoanRequest.getAvatar());
//            taiKhoan.setAvatar(avatarPath);
//        }
//        String password = generatePassword();
//        taiKhoan.setMatKhau(password);
//        return taiKhoanRepository.save(taiKhoan);
//    }

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

    public Page<TaiKhoan> searchNhanVien(NhanVienSearch search, Pageable pageable) {
        return taiKhoanRepository.getSearchNhanVienAndPhanTrang(search, pageable);
    }

    public Page<TaiKhoan> searchKhachHang(KhachHangSearch search, Pageable pageable) {
        return taiKhoanRepository.getSearchKhacHangAndPhanTrang(search, pageable);
    }
}
