package com.example.da_be.controller;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/tai-khoan")
public class TaiKhoanController {

    @Autowired
    private TaiKhoanService taiKhoanService;

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
    @PostMapping
    public ResponseEntity<TaiKhoan> addTaiKhoan(@RequestBody TaiKhoan taiKhoan) {
        TaiKhoan createdTaiKhoan = taiKhoanService.saveOrUpdateTaiKhoan(taiKhoan);
        return new ResponseEntity<>(createdTaiKhoan, HttpStatus.CREATED);
    }

    // Cập nhật tài khoản
    @PutMapping("/{id}")
    public ResponseEntity<TaiKhoan> updateTaiKhoan(@PathVariable int id, @RequestBody TaiKhoan taiKhoan) {
        taiKhoan.setId(id); // Đảm bảo ID được cập nhật
        TaiKhoan updatedTaiKhoan = taiKhoanService.saveOrUpdateTaiKhoan(taiKhoan);
        return new ResponseEntity<>(updatedTaiKhoan, HttpStatus.OK);
    }

    // Xóa tài khoản
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaiKhoan(@PathVariable int id) {
        taiKhoanService.deleteTaiKhoanById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
