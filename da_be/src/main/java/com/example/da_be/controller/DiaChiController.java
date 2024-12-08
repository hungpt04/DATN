package com.example.da_be.controller;

import com.example.da_be.entity.DiaChi;
import com.example.da_be.service.DiaChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/dia-chi")
public class DiaChiController {

    @Autowired
    private DiaChiService diaChiService;

    // Lấy danh sách tất cả địa chỉ
    @GetMapping
    public List<DiaChi> getAllDiaChi() {
        return diaChiService.getAllDiaChi();
    }

    // Lấy thông tin địa chỉ theo id
    @GetMapping("/{id}")
    public ResponseEntity<DiaChi> getDiaChiById(@PathVariable Long id) {
        DiaChi diaChi = diaChiService.getDiaChiById(id);
        if (diaChi.getId() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(diaChi, HttpStatus.OK);
    }

    // Lấy danh sách địa chỉ theo IdTaiKhoan
    @GetMapping("/tai-khoan/{idTaiKhoan}")
    public ResponseEntity<List<DiaChi>> getDiaChiByTaiKhoanId(@PathVariable Long idTaiKhoan) {
        List<DiaChi> diaChiList = diaChiService.getDiaChiByTaiKhoanId(idTaiKhoan);
        return new ResponseEntity<>(diaChiList, HttpStatus.OK);
    }

    // Xóa địa chỉ theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiaChi(@PathVariable Long id) {
        diaChiService.deleteDiaChiById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping
    public ResponseEntity<DiaChi> addDiaChii(@RequestBody DiaChi diaChi) {
        DiaChi createdDiaChi = diaChiService.saveOrUpdateDiaChii(diaChi);
        return new ResponseEntity<>(createdDiaChi, HttpStatus.CREATED);
    }

    // Thêm địa chỉ mới
    @PostMapping("/add")
    public ResponseEntity<DiaChi> addDiaChi(@RequestBody DiaChi diaChi) {
        DiaChi createdDiaChi = diaChiService.saveOrUpdateDiaChi(diaChi);
        return new ResponseEntity<>(createdDiaChi, HttpStatus.CREATED);
    }

    // Cập nhật thông tin địa chỉ
    @PutMapping("/{id}")
    public ResponseEntity<DiaChi> updateDiaChi(@PathVariable Long id, @RequestBody DiaChi diaChi) {
        diaChi.setId(id);  // Đảm bảo ID trong body và path là giống nhau
        DiaChi updatedDiaChi = diaChiService.saveOrUpdateDiaChi(diaChi);
        return new ResponseEntity<>(updatedDiaChi, HttpStatus.OK);
    }
}