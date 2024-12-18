package com.example.da_be.controller;

import com.example.da_be.cloudinary.CloudinaryImage;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.exception.ResourceNotFoundException;
import com.example.da_be.repository.TaiKhoanRepository;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.request.NhanVienSearch;
import com.example.da_be.request.TaiKhoanRequest;
import com.example.da_be.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/tai-khoan")
public class TaiKhoanController {

    @Autowired
    private TaiKhoanService taiKhoanService;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private CloudinaryImage cloudinaryImage;

    // Lấy tất cả tài khoản
    @GetMapping
    public List<TaiKhoan> getAllTaiKhoan() {
        return taiKhoanService.getAllTaiKhoan();
    }

    // Lấy tài khoản theo id
    @GetMapping("/{id}")
    public ResponseEntity<TaiKhoan> getTaiKhoanById(@PathVariable int id) {
        TaiKhoan taiKhoan = taiKhoanService.getTaiKhoanById(id);
        if (taiKhoan == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(taiKhoan, HttpStatus.OK);
    }

    // Thêm tài khoản mới
    @PostMapping("/add")
    public ResponseEntity<TaiKhoan> addTaiKhoan(@RequestBody TaiKhoan taiKhoan) {
        TaiKhoan createdTaiKhoan = taiKhoanService.saveOrUpdateTaiKhoan(taiKhoan);
        return new ResponseEntity<>(createdTaiKhoan, HttpStatus.CREATED);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(
            @RequestParam("hoTen") String hoTen,
            @RequestParam("sdt") String sdt,
            @RequestParam("email") String email,
            @RequestParam("matKhau") String matKhau,
            @RequestParam("gioiTinh") Integer gioiTinh,
            @RequestParam("vaiTro") String vaiTro,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam("ngaySinh") LocalDate ngaySinh,
            @RequestParam("cccd") String cccd,
            @RequestParam("trangThai") Integer trangThai
    ) throws ParseException, IOException {
        // Lưu đường dẫn tương đối vào database
        TaiKhoan taiKhoan = new TaiKhoan();
        taiKhoan.setHoTen(hoTen);
        taiKhoan.setSdt(sdt);
        taiKhoan.setEmail(email);
        taiKhoan.setMatKhau(matKhau);
        taiKhoan.setGioiTinh(gioiTinh);
        taiKhoan.setVaiTro(vaiTro);
        taiKhoan.setNgaySinh(ngaySinh);
        taiKhoan.setCccd(cccd);
        taiKhoan.setTrangThai(trangThai);

        taiKhoan.setAvatar(cloudinaryImage.uploadAvatar(avatar));

        return new ResponseEntity<>(taiKhoanService.saveOrUpdateTaiKhoan(taiKhoan), HttpStatus.CREATED);
    }

    @PutMapping("/updateTaiKhoan/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @RequestParam(value = "hoTen", required = false) String hoTen,
            @RequestParam(value = "sdt", required = false) String sdt,
            @RequestParam(value = "email", required = false) String email,
//            @RequestParam(value = "matKhau", required = false) String matKhau,
            @RequestParam(value = "gioiTinh", required = false) Integer gioiTinh,
            @RequestParam(value = "vaiTro", required = false) String vaiTro,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "ngaySinh", required = false) LocalDate ngaySinh,
            @RequestParam(value = "cccd", required = false) String cccd,
            @RequestParam(value = "trangThai", required = false) Integer trangThai
    ) throws ParseException, IOException {
        // Tìm tài khoản cần update
        TaiKhoan existingTaiKhoan = taiKhoanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản không tồn tại"));

        // Cập nhật thông tin
        existingTaiKhoan.setHoTen(hoTen);
        existingTaiKhoan.setSdt(sdt);
        existingTaiKhoan.setEmail(email);

//        // Kiểm tra và cập nhật mật khẩu nếu được cung cấp
//        if (matKhau != null && !matKhau.isEmpty()) {
//            existingTaiKhoan.setMatKhau(matKhau);
//        }

        existingTaiKhoan.setGioiTinh(gioiTinh);
        existingTaiKhoan.setVaiTro(vaiTro);
        existingTaiKhoan.setNgaySinh(ngaySinh);
        existingTaiKhoan.setCccd(cccd);
        existingTaiKhoan.setTrangThai(trangThai);

        // Cập nhật avatar nếu được cung cấp
        if (avatar != null && !avatar.isEmpty()) {
            existingTaiKhoan.setAvatar(cloudinaryImage.uploadAvatar(avatar));
        }

        // Lưu thông tin đã cập nhật
        return new ResponseEntity<>(taiKhoanService.saveOrUpdateTaiKhoan(existingTaiKhoan), HttpStatus.OK);
    }

    // Cập nhật tài khoản
    @PutMapping("/update/{id}")
    public ResponseEntity<TaiKhoan> updateTaiKhoan(@PathVariable int id, @RequestBody TaiKhoan taiKhoan) {
        taiKhoan.setId(id); // Đảm bảo ID được cập nhật
        TaiKhoan updatedTaiKhoan = taiKhoanService.saveOrUpdateTaiKhoan(taiKhoan);
        return new ResponseEntity<>(updatedTaiKhoan, HttpStatus.OK);
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<TaiKhoan> deleteTaiKhoan(@PathVariable int id) {
        TaiKhoan taiKhoan = taiKhoanService.deleteTaiKhoanById(id);
        return new ResponseEntity<>(taiKhoan, HttpStatus.OK);
    }

    @GetMapping("/my-info")
    public ResponseEntity<TaiKhoan> getInfo(@RequestHeader("Authorization") String token) {
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;

        try {
            TaiKhoan taiKhoan = taiKhoanService.getMyInfo(jwtToken);
            return ResponseEntity.ok(taiKhoan);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
