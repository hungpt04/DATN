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
        try {
            DiaChi diaChi = diaChiService.getDiaChiById(id);
            if (diaChi == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(diaChi);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
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
   @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDiaChi(@PathVariable Long id, @RequestBody DiaChi diaChi) {
        try {
            // Ensure the ID in the path is set in the body
            diaChi.setId(id);

            // This will either update existing or create new
            DiaChi updatedDiaChi = diaChiService.saveOrUpdateDiaChi(diaChi);
            return new ResponseEntity<>(updatedDiaChi, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiaChi> updateDiaChi(@PathVariable Long id, @RequestBody DiaChi diaChi) {
        diaChi.setId(id);  // Đảm bảo ID trong body và path là giống nhau
        DiaChi updatedDiaChi = diaChiService.saveOrUpdateDiaChi(diaChi);
        return new ResponseEntity<>(updatedDiaChi, HttpStatus.OK);

    }

    @GetMapping("/get-id-dia-chi-by-id-tai-khoan/{idTaiKhoan}")
    public Long getIdDiaChiByIdTaiKhoan(@PathVariable Integer idTaiKhoan) {
        return diaChiService.getIdDiaChiByIdTaiKhoan(idTaiKhoan);
    }

}