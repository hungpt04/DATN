package com.example.da_be.controller;

import com.example.da_be.cloudinary.CloudinaryImage;
import com.example.da_be.config.JwtTokenProvider;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.exception.ResourceNotFoundException;
import com.example.da_be.repository.TaiKhoanRepository;
import com.example.da_be.request.ChangeRequest;
import com.example.da_be.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

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

//    @PostMapping("/create")
//    public ResponseEntity<?> createUser(
//            @RequestParam("hoTen") String hoTen,
//            @RequestParam("sdt") String sdt,
//            @RequestParam("email") String email,
//            @RequestParam("matKhau") String matKhau,
//            @RequestParam("gioiTinh") Integer gioiTinh,
//            //@RequestParam("vaiTro") String vaiTro,
//            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
//            @RequestParam("ngaySinh") LocalDate ngaySinh,
//            @RequestParam("cccd") String cccd,
//            @RequestParam("trangThai") Integer trangThai
//    ) throws ParseException, IOException {
//        // Lưu đường dẫn tương đối vào database
//        TaiKhoan taiKhoan = new TaiKhoan();
//        taiKhoan.setHoTen(hoTen);
//        taiKhoan.setSdt(sdt);
//        taiKhoan.setEmail(email);
//        taiKhoan.setMatKhau(matKhau);
//        taiKhoan.setGioiTinh(gioiTinh);
//        taiKhoan.setVaiTro(vaiTro);
//        taiKhoan.setNgaySinh(ngaySinh);
//        taiKhoan.setCccd(cccd);
//        taiKhoan.setTrangThai(trangThai);
//
//        taiKhoan.setAvatar(cloudinaryImage.uploadAvatar(avatar));
//
//        return new ResponseEntity<>(taiKhoanService.saveOrUpdateTaiKhoan(taiKhoan), HttpStatus.CREATED);
//    }

    @PutMapping("/updateTaiKhoan/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @RequestParam(value = "hoTen", required = false) String hoTen,
            @RequestParam(value = "sdt", required = false) String sdt,
            @RequestParam(value = "email", required = false) String email,
//            @RequestParam(value = "matKhau", required = false) String matKhau,
            @RequestParam(value = "gioiTinh", required = false) Integer gioiTinh,
//            @RequestParam(value = "vaiTro", required = false) String vaiTro,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "ngaySinh", required = false) LocalDate ngaySinh,
            @RequestParam(value = "cccd", required = false) String cccd
//            @RequestParam(value = "trangThai", required = false) Integer trangThai
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
//        existingTaiKhoan.setVaiTro(vaiTro);
        existingTaiKhoan.setNgaySinh(ngaySinh);
        existingTaiKhoan.setCccd(cccd);
//        existingTaiKhoan.setTrangThai(trangThai);

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

//    @GetMapping("/searchNhanVien")
//    public Map<String, Object> searchNhanVien(
//            @RequestParam(required = false) String tenSearch,
//            @RequestParam(required = false) String emailSearch,
//            @RequestParam(required = false) String sdtSearch,
//            @RequestParam(required = false) Integer gioiTinhSearch,
//            @RequestParam(required = false) Integer trangThaiSearch,
//            @RequestParam(value = "currentPage", defaultValue = "0") Integer currentPage,
//            @RequestParam(value = "size", defaultValue = "5") Integer size
//    ) {
//        NhanVienSearch search = new NhanVienSearch();
//        search.setTenSearch(tenSearch);
//        search.setEmailSearch(emailSearch);
//        search.setSdtSearch(sdtSearch);
//        search.setGioiTinhSearch(gioiTinhSearch);
//        search.setTrangThaiSearch(trangThaiSearch);
//
//        Pageable pageable = PageRequest.of(currentPage, size);
//
//        Page<TaiKhoan> pageResult = taiKhoanService.searchNhanVien(search, pageable);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("content", pageResult.getContent());
//        response.put("totalPages", pageResult.getTotalPages());
//        response.put("totalElements", pageResult.getTotalElements());
//        response.put("currentPage", pageResult.getNumber());
//        response.put("size", pageResult.getSize());
//
//        return response;
//    }

//    @GetMapping("/searchKhachHang")
//    public Map<String, Object> searchKhachHang(
//            @RequestParam(required = false) String tenSearch,
//            @RequestParam(required = false) String emailSearch,
//            @RequestParam(required = false) String sdtSearch,
//            @RequestParam(required = false) Integer gioiTinhSearch,
//            @RequestParam(required = false) Integer trangThaiSearch,
//            @RequestParam(value = "currentPage", defaultValue = "0") Integer currentPage,
//            @RequestParam(value = "size", defaultValue = "5") Integer size
//    ) {
//        KhachHangSearch search = new KhachHangSearch();
//        search.setTenSearch(tenSearch);
//        search.setEmailSearch(emailSearch);
//        search.setSdtSearch(sdtSearch);
//        search.setGioiTinhSearch(gioiTinhSearch);
//        search.setTrangThaiSearch(trangThaiSearch);
//
//        Pageable pageable = PageRequest.of(currentPage, size);
//
//        Page<TaiKhoan> pageResult = taiKhoanService.searchKhachHang(search, pageable);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("content", pageResult.getContent());
//        response.put("totalPages", pageResult.getTotalPages());
//        response.put("totalElements", pageResult.getTotalElements());
//        response.put("currentPage", pageResult.getNumber());
//        response.put("size", pageResult.getSize());
//
//        return response;
//    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePass(@RequestHeader("Authorization") String token, @RequestBody ChangeRequest request) {
        try {
            String email = jwtTokenProvider.getEmailFromJwtToken(token);

            Boolean isPasswordChanged = taiKhoanService.changePassword(email, request);
            if (isPasswordChanged) {
                return new ResponseEntity<>(isPasswordChanged, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Password change failed", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/my-info")
    public ResponseEntity<Optional<TaiKhoan>> getInfo(@RequestHeader("Authorization") String token) {
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;

        try {
            Optional<TaiKhoan> taiKhoan = taiKhoanService.getMyInfo(jwtToken);
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
