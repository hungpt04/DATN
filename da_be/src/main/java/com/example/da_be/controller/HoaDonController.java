package com.example.da_be.controller;

import com.example.da_be.entity.HoaDon;
import com.example.da_be.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/hoa-don")
public class HoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

    // Lấy danh sách tất cả hóa đơn
    @GetMapping
    public List<HoaDon> getAllHoaDon() {
        return hoaDonService.getAllHoaDon();
    }

    // Lấy thông tin hóa đơn theo id
    @GetMapping("/{id}")
    public ResponseEntity<HoaDon> getHoaDonById(@PathVariable Long id) {
        HoaDon hoaDon = hoaDonService.getHoaDonById(id);
        if (hoaDon.getId() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(hoaDon, HttpStatus.OK);
    }

    // Xóa hóa đơn theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHoaDon(@PathVariable Long id) {
        hoaDonService.deleteHoaDonById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Thêm hóa đơn mới
    @PostMapping
    public ResponseEntity<HoaDon> addHoaDon(@RequestBody HoaDon hoaDon) {
        HoaDon createdHoaDon = hoaDonService.saveOrUpdateHoaDon(hoaDon);
        return new ResponseEntity<>(createdHoaDon, HttpStatus.CREATED);
    }

    // Cập nhật thông tin hóa đơn
    @PutMapping("/{id}")
    public ResponseEntity<HoaDon> updateHoaDon(@PathVariable Long id, @RequestBody HoaDon hoaDon) {
        hoaDon.setId(id);  // Đảm bảo ID trong body và path là giống nhau
        HoaDon updatedHoaDon = hoaDonService.saveOrUpdateHoaDon(hoaDon);
        return new ResponseEntity<>(updatedHoaDon, HttpStatus.OK);
    }
}
