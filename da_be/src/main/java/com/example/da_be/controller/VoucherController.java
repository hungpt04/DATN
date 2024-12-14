package com.example.da_be.controller;

import com.example.da_be.entity.Voucher;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.request.VoucherRequest;
import com.example.da_be.request.VoucherSearch;
import com.example.da_be.response.KhachHangResponse;
import com.example.da_be.response.VoucherResponse;
import com.example.da_be.service.VoucherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/admin/voucher")
public class VoucherController {
    @Autowired
    private VoucherService voucherService;

    @GetMapping("/hien-thi")
    public List<VoucherResponse> getAllVoucher() {
        return voucherService.getAllVoucher();
    }

    @GetMapping("/list-khachhang")
    public List<KhachHangResponse> getAllKhachHang() {
        return voucherService.getAllKhachHang();
    }

    @GetMapping("/phan-trang")
    public Map<String, Object> phanTrang(
            @RequestParam(value = "currentPage", defaultValue = "0") Integer currentPage,
            @RequestParam(value = "size", defaultValue = "5") Integer size) {
        Pageable pageable = PageRequest.of(currentPage, size);
        Page<VoucherResponse> page = voucherService.phanTrangVoucher(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", page.getContent());
        response.put("totalPages", page.getTotalPages());
        response.put("totalElements", page.getTotalElements());
        response.put("currentPage", page.getNumber());
        response.put("size", page.getSize());

        return response;
    }

    @GetMapping("/detail/{id}")
    public VoucherResponse getVoucherById(@PathVariable Integer id) {
        return voucherService.getVoucherById(id);
    }

    @PostMapping("/add")
    public Voucher addVoucher(@RequestBody @Valid VoucherRequest voucherRequest) {
        return voucherService.addVoucher(voucherRequest);
    }

    @PutMapping("/update/{id}")
    public Voucher updateVoucher(@PathVariable Integer id, @RequestBody @Valid VoucherRequest voucherRequest) throws ParseException {
        return voucherService.updateVoucher(id, voucherRequest);
    }

    @DeleteMapping("/delete/{id}")
    public Boolean deleteVoucher(@PathVariable Integer id) {
        return voucherService.deleteVoucher(id);
    }

    @GetMapping("/search")
    public Map<String, Object> searchVouchers(
            @RequestParam(required = false) String tenSearch,       // Tìm kiếm theo mã hoặc tên
            @RequestParam(required = false) LocalDateTime ngayBatDauSearch,  // Tìm kiếm theo ngày bắt đầu
            @RequestParam(required = false) LocalDateTime ngayKetThucSearch,    // Tìm kiếm theo ngày kết thúc
            @RequestParam(required = false) Integer kieuSearch    ,  // Tìm kiếm theo loại
            @RequestParam(required = false) Integer kieuGiaTriSearch,    // Tìm kiếm theo giá trị loại
            @RequestParam(required = false) Integer trangThaiSearch,       // Tìm kiếm theo trạng thái
            @RequestParam(value = "currentPage", defaultValue = "0") Integer currentPage,  // Trang hiện tại
            @RequestParam(value = "size", defaultValue = "5") Integer size) {  // Kích thước mỗi trang

        // Tạo đối tượng AdVoucherSearch từ các tham số request
        VoucherSearch searchCriteria = new VoucherSearch();
        searchCriteria.setTenSearch(tenSearch);
        searchCriteria.setNgayBatDauSearch(ngayBatDauSearch);
        searchCriteria.setNgayKetThucSearch(ngayKetThucSearch);
        searchCriteria.setKieuSearch(kieuSearch);
        searchCriteria.setKieuGiaTriSearch(kieuGiaTriSearch);
        searchCriteria.setTrangThaiSearch(trangThaiSearch);

        // Khởi tạo Pageable cho phân trang
        Pageable pageable = PageRequest.of(currentPage, size);

        // Lấy kết quả từ service
        Page<VoucherResponse> pageResult = voucherService.getSearchVoucher(searchCriteria, pageable);

        // Tạo response trả về cho client
        Map<String, Object> response = new HashMap<>();
        response.put("content", pageResult.getContent());
        response.put("totalPages", pageResult.getTotalPages());
        response.put("totalElements", pageResult.getTotalElements());
        response.put("currentPage", pageResult.getNumber());
        response.put("size", pageResult.getSize());

        return response;
    }

    @GetMapping("/searchKhachHang")
    public Map<String, Object> searchKhachHang(
            @RequestParam(required = false) String tenSearch,       // Tìm kiếm theo mã hoặc tên
            @RequestParam(value = "currentPage", defaultValue = "0") Integer currentPage,  // Trang hiện tại
            @RequestParam(value = "size", defaultValue = "5") Integer size) {  // Kích thước mỗi trang

        KhachHangSearch khachHangSearch = new KhachHangSearch();
        khachHangSearch.setTenSearch(tenSearch);

        // Khởi tạo Pageable cho phân trang
        Pageable pageable = PageRequest.of(currentPage, size);

        // Lấy kết quả từ service
        Page<KhachHangResponse> pageResult = voucherService.getSearchKhachHang(khachHangSearch, pageable);

        // Tạo response trả về cho client
        Map<String, Object> response = new HashMap<>();
        response.put("content", pageResult.getContent());
        response.put("totalPages", pageResult.getTotalPages());
        response.put("totalElements", pageResult.getTotalElements());
        response.put("currentPage", pageResult.getNumber());
        response.put("size", pageResult.getSize());

        return response;
    }

    @GetMapping("/list-ma-voucher")
    public List<String> getAllMaVoucher() {
        return voucherService.getAllMaVoucher();
    }

    @GetMapping("/list-ten-voucher")
    public List<String> getAllTenVoucher() {
        return voucherService.getAllTenVoucher();
    }

    @PutMapping("/giam-so-luong/{id}")
    public ResponseEntity<?> giamSoLuongVoucher(@PathVariable Integer id) {
        try {
            Voucher updatedVoucher = voucherService.giamSoLuongVoucher(id);
            return ResponseEntity.ok(updatedVoucher);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
}
