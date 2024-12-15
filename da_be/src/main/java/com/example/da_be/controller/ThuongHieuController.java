package com.example.da_be.controller;

import com.example.da_be.entity.ThuongHieu;
import com.example.da_be.repository.ThuongHieuRepository;
import com.example.da_be.service.ThuongHieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Cho phép kết nối từ React
@RequestMapping("/api/thuong-hieu")
public class ThuongHieuController {

    @Autowired
    private ThuongHieuService thuongHieuService;

    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    // Lấy danh sách tất cả thương hiệu
    @GetMapping
    public List<ThuongHieu> getAllThuongHieu() {
        return thuongHieuService.getAllThuongHieu();
    }

    @GetMapping("/hien-thi")
    public List<ThuongHieu> getAllThuongHieuHienThi() {
        return thuongHieuRepository.getAllThuongHieu();
    }

    // Lấy thông tin thương hiệu theo id
    @GetMapping("/{id}")
    public ThuongHieu getThuongHieuById(@PathVariable int id) {
        return thuongHieuService.getThuongHieuById(id);
    }

    // Xóa thương hiệu theo id
    @DeleteMapping("/{id}")
    public void deleteThuongHieu(@PathVariable int id) {
        thuongHieuService.deleteThuongHieuById(id);
    }

    // Thêm thương hiệu mới
    @PostMapping
    public ThuongHieu addThuongHieu(@RequestBody ThuongHieu thuongHieu) {
        return thuongHieuService.saveOrUpdateThuongHieu(thuongHieu);
    }

    // Cập nhật thông tin thương hiệu
    @PutMapping("/{id}")
    public ThuongHieu updateThuongHieu(@PathVariable int id, @RequestBody ThuongHieu thuongHieu) {
        thuongHieu.setId(id);  // Đảm bảo ID trong body và path là giống nhau
        return thuongHieuService.saveOrUpdateThuongHieu(thuongHieu);
    }
}