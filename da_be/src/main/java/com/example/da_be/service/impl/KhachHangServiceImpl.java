package com.example.da_be.service.impl;

import com.example.da_be.cloudinary.CloudinaryImage;
import com.example.da_be.email.Email;
import com.example.da_be.email.EmailSender;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.repository.KhachHangRepository;
import com.example.da_be.request.KhachHangRequest;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.response.KhachHangResponse;
import com.example.da_be.service.KhachHangService;
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
public class KhachHangServiceImpl implements KhachHangService {
    @Autowired
    private KhachHangRepository khachHangRepository;
    @Autowired
    private CloudinaryImage cloudinaryImage;
    @Autowired
    private EmailSender emailSender;

    @Override
    public Page<KhachHangResponse> getSearchKhachHang(KhachHangSearch search, Pageable pageable) {
        return khachHangRepository.getSearchKhacHangAndPhanTrang(search, pageable);
    }

    @Override
    @Transactional
    public TaiKhoan add(KhachHangRequest khachHangRequest) throws ParseException {
        String setMaKH = "KH" + khachHangRepository.findAll().size();
        TaiKhoan kh = new TaiKhoan();
        kh.setMa(setMaKH);
        kh.setHoTen(khachHangRequest.getHoTen());
        kh.setSdt(khachHangRequest.getSdt());
        kh.setEmail(khachHangRequest.getEmail());
        kh.setNgaySinh(khachHangRequest.getNgaySinh());
        kh.setGioiTinh(khachHangRequest.getGioiTinh());
        kh.setVaiTro(khachHangRequest.getVaiTro());
        kh.setTrangThai(khachHangRequest.getTrangThai());

        if (khachHangRequest.getAvatar() != null) {
            kh.setAvatar(cloudinaryImage.uploadAvatar(khachHangRequest.getAvatar()));
        }
        String password = generatePassword();
        String[] toMail = {khachHangRequest.getEmail()};
        Email email = new Email();
        email.setBody("<b style=\"text-align: center;\">" + password + "</b>");
        email.setToEmail(toMail);
        email.setSubject("Tạo tài khoản thành công");
        email.setTitleEmail("Mật khẩu đăng nhập là:");
        emailSender.sendEmail(email);
        kh.setMatKhau(password);

        return khachHangRepository.save(kh);
    }

    @Override
    public Boolean update(Integer id, KhachHangRequest khachHangRequest) throws ParseException {
        Optional<TaiKhoan> optionalCustomer = khachHangRepository.findById(id);
        if (optionalCustomer.isPresent()) {
            TaiKhoan customer = khachHangRequest.newKhachHang(optionalCustomer.get());
            if (khachHangRequest.getAvatar() != null) {
                customer.setAvatar(cloudinaryImage.uploadAvatar(khachHangRequest.getAvatar()));
            }
            khachHangRepository.save(customer);
            return true;

        } else {
            return false;
        }
    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public TaiKhoan getKhachHangById(Integer id) {
        return khachHangRepository.findById(id).orElse(null);
    }

    @Override
    public List<KhachHangResponse> getAllKhachHang() {
        return List.of();
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
