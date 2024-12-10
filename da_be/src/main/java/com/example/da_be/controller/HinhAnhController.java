package com.example.da_be.controller;

import com.example.da_be.entity.HinhAnh;
import com.example.da_be.service.HinhAnhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/hinh-anh")
public class HinhAnhController {

    @Autowired
    private HinhAnhService hinhAnhService;

    // Lấy danh sách tất cả hình ảnh
    @GetMapping
    public List<HinhAnh> getAllHinhAnh() {
        return hinhAnhService.getAllHinhAnh();
    }

    // Lấy thông tin hình ảnh theo id
    @GetMapping("/{id}")
    public HinhAnh getHinhAnhById(@PathVariable int id) {
        return hinhAnhService.getHinhAnhById(id);
    }

    // Xóa hình ảnh theo id
    @DeleteMapping("/{id}")
    public void deleteHinhAnh(@PathVariable int id) {
        hinhAnhService.deleteHinhAnhById(id);
    }

    // Thêm hình ảnh mới
    @PostMapping
    public HinhAnh addHinhAnh(@RequestBody HinhAnh hinhAnh) {
        return hinhAnhService.saveOrUpdateHinhAnh(hinhAnh);
    }

    // Cập nhật thông tin hình ảnh
    @PutMapping("/{id}")
    public HinhAnh updateHinhAnh(@PathVariable int id, @RequestBody HinhAnh hinhAnh) {
        hinhAnh.setId(id);  // Đảm bảo ID trong body và path là giống nhau
        return hinhAnhService.saveOrUpdateHinhAnh(hinhAnh);
    }

    // Tải lên hình ảnh
    @PostMapping("/upload-images")
    public List<HinhAnh> uploadImages(@RequestParam("images") MultipartFile[] files, @RequestParam("idSanPhamCT") int idSanPhamCT) {
        return hinhAnhService.uploadImages(files, idSanPhamCT);
    }

    @PostMapping("/upload-image")
    public List<HinhAnh> uploadImage(@RequestParam("images") MultipartFile[] files, @RequestParam("idSanPhamCT") int idSanPhamCT) {
        return hinhAnhService.uploadImage(files, idSanPhamCT);
    }
}