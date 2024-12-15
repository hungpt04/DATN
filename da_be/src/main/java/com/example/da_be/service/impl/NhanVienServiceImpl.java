package com.example.da_be.service.impl;

import com.example.da_be.cloudinary.CloudinaryImage;
import com.example.da_be.email.Email;
import com.example.da_be.email.EmailSender;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.repository.NhanVienRepository;
import com.example.da_be.request.NhanVienRequest;
import com.example.da_be.request.NhanVienSearch;
import com.example.da_be.response.NhanVienResponse;
import com.example.da_be.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;

@Service
public class NhanVienServiceImpl implements NhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;
    @Autowired
    private CloudinaryImage cloudinaryImage;
    @Autowired
    private EmailSender emailSender;

    @Override
    public List<NhanVienResponse> getAllNhanVien() {
        return nhanVienRepository.getAllNhanVien();
    }

    @Override
    public Page<NhanVienResponse> searchNhanVien(NhanVienSearch nhanVienSearch, Pageable pageable) {
        return nhanVienRepository.getSearchNhanVienAndPhanTrang(nhanVienSearch, pageable);
    }

    @Override
    public NhanVienResponse getNhanVienById(Integer id) {
        return nhanVienRepository.getNhanVienById(id);
    }

    @Override
    @Transactional
    public TaiKhoan add(NhanVienRequest nhanVienRequest) throws ParseException {
        String setMaNV = "NV" + nhanVienRepository.findAll().size();
        TaiKhoan nv = TaiKhoan.builder()
                .ma(setMaNV)
                .hoTen(nhanVienRequest.getHoTen())
                .sdt(nhanVienRequest.getSdt())
                .email(nhanVienRequest.getEmail())
                .ngaySinh(nhanVienRequest.getNgaySinh())
                .gioiTinh(nhanVienRequest.getGioiTinh())
                .vaiTro(nhanVienRequest.getVaiTro())
                .cccd(nhanVienRequest.getCccd())
                .trangThai(nhanVienRequest.getTrangThai())
                .build();

        if(nhanVienRequest.getAvatar() != null) {
            nv.setAvatar(cloudinaryImage.uploadAvatar(nhanVienRequest.getAvatar()));
        }

        String matKhau = generatePassword();
        String[] toMail = {nhanVienRequest.getEmail()};
        Email email = new Email();
        email.setBody("<b style=\"text-align: center;\">" + matKhau + "</b>");
        email.setToEmail(toMail);
        email.setSubject("Tạo tài khoản thành công");
        email.setTitleEmail("Mật khẩu đăng nhập là:");
        emailSender.sendEmail(email);
        nv.setMatKhau(matKhau);
        return nhanVienRepository.save(nv);
    }

    @Override
    @Transactional
    public Boolean update(NhanVienRequest nhanVienRequest, Integer id) throws ParseException {
        Optional<TaiKhoan> optional = nhanVienRepository.findById(id);
        if (optional.isPresent()) {
            TaiKhoan nv = nhanVienRequest.tranStaff(optional.get());
            if(nhanVienRequest.getAvatar() != null) {
                nv.setAvatar(cloudinaryImage.uploadAvatar(nhanVienRequest.getAvatar()));
            }
            nhanVienRepository.save(nv);
            return true;
        }else {
            return false;
        }
    }

    @Override
    public TaiKhoan delete(Integer id) {
        TaiKhoan nv = nhanVienRepository.findById(id).orElse(null);
        assert nv != null;
        if (nv.getTrangThai() == 0) {
            nv.setTrangThai(1);
        } else {
            nv.setTrangThai(0);
        }
        return nhanVienRepository.save(nv);
    }

    private String generatePassword() {
        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        StringBuilder password = new StringBuilder();

        SecureRandom random = new SecureRandom();

        for (int i = 0; i < 12; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            char randomChar = CHARACTERS.charAt(randomIndex);
            password.append(randomChar);
        }

        return password.toString();
    }
}
