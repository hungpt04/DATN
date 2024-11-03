package com.example.da_be.controller;

import com.example.da_be.dto.UpdateHoaDonStatusRequest;
import com.example.da_be.dto.UpdateThanhToanStatusRequest;
import com.example.da_be.entity.HoaDon;
import com.example.da_be.entity.ThanhToan;
import com.example.da_be.service.ThanhToanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/thanh-toan")
public class ThanhToanController {

    @Autowired
    private ThanhToanService thanhToanService;

    // Lấy danh sách tất cả thanh toán
    @GetMapping
    public List<ThanhToan> getAllThanhToan() {
        return thanhToanService.getAllThanhToan();
    }

    // Lấy thông tin thanh toán theo id
    @GetMapping("/{id}")
    public ThanhToan getThanhToanById(@PathVariable Long id) {
        return thanhToanService.getThanhToanById(id);
    }

    // Xóa thanh toán theo id
    @DeleteMapping("/{id}")
    public void deleteThanhToan(@PathVariable Long id) {
        thanhToanService.deleteThanhToanById(id);
    }

    // Thêm thanh toán mới
    @PostMapping
    public ThanhToan addThanhToan(@RequestBody ThanhToan thanhToan) {
        return thanhToanService.saveOrUpdateThanhToan(thanhToan);
    }

    // Cập nhật thông tin thanh toán
    @PutMapping("/{id}")
    public ThanhToan updateThanhToan(@PathVariable Long id, @RequestBody ThanhToan thanhToan) {
        thanhToan.setId(id);  // Đảm bảo ID trong body và path là giống nhau
        return thanhToanService.saveOrUpdateThanhToan(thanhToan);
    }

    @PutMapping("/update-status")
    public ResponseEntity<ThanhToan> updateThanhToanStatus(@RequestBody UpdateThanhToanStatusRequest request) {
        ThanhToan updatedThanhToan = thanhToanService.updateThanhToanStatus(request.getThanhToanId(), request.getStatus()); // Sử dụng getThanhToanId
        if (updatedThanhToan == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedThanhToan, HttpStatus.OK);
    }

    @GetMapping("/hoa-don/{hoaDonId}")
    public ResponseEntity<ThanhToan> getThanhToanByHoaDonId(@PathVariable Long hoaDonId) {
        ThanhToan thanhToan = thanhToanService.getThanhToanByHoaDonId(hoaDonId);
        if (thanhToan == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(thanhToan, HttpStatus.OK);
    }
}
