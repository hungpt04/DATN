package com.example.da_be.controller;

import com.example.da_be.entity.LichSuDonHang;
import com.example.da_be.service.LichSuDonHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/lich-su-don-hang")
public class LichSuDonHangController {

    @Autowired
    private LichSuDonHangService lichSuDonHangService;

    // Lấy danh sách tất cả lịch sử đơn hàng
    @GetMapping
    public List<LichSuDonHang> getAllLichSuDonHang() {
        return lichSuDonHangService.getAllLichSuDonHang();
    }

    // Lấy thông tin lịch sử đơn hàng theo id
    @GetMapping("/{id}")
    public ResponseEntity<LichSuDonHang> getLichSuDonHangById(@PathVariable int id) {
        LichSuDonHang lichSuDonHang = lichSuDonHangService.getLichSuDonHangById(id);
        return new ResponseEntity<>(lichSuDonHang, HttpStatus.OK);
    }

    // Xóa lịch sử đơn hàng theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLichSuDonHang(@PathVariable int id) {
        lichSuDonHangService.deleteLichSuDonHangById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Thêm lịch sử đơn hàng mới
    @PostMapping
    public ResponseEntity<LichSuDonHang> addLichSuDonHang(@RequestBody LichSuDonHang lichSuDonHang) {
        LichSuDonHang createdLichSuDonHang = lichSuDonHangService.saveOrUpdateLichSuDonHang(lichSuDonHang);
        return new ResponseEntity<>(createdLichSuDonHang, HttpStatus.CREATED);
    }

    // Cập nhật thông tin lịch sử đơn hàng
    @PutMapping("/{id}")
    public ResponseEntity<LichSuDonHang> updateLichSuDonHang(@PathVariable int id, @RequestBody LichSuDonHang lichSuDonHang) {
        lichSuDonHang.setId(id);  // Đảm bảo ID trong body và path là giống nhau
        LichSuDonHang updatedLichSuDonHang = lichSuDonHangService.saveOrUpdateLichSuDonHang(lichSuDonHang);
        return new ResponseEntity<>(updatedLichSuDonHang, HttpStatus.OK);
    }

    // Lấy danh sách lịch sử đơn hàng theo ID hóa đơn
    @GetMapping("/hoa-don/{hoaDonId}")
    public ResponseEntity<List<LichSuDonHang>> getLichSuDonHangByHoaDonId(@PathVariable int hoaDonId) {
        List<LichSuDonHang> lichSuDonHangList = lichSuDonHangService.getLichSuDonHangByHoaDonId(hoaDonId);
        return new ResponseEntity<>(lichSuDonHangList, HttpStatus.OK);
    }
}