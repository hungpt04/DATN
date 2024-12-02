package com.example.da_be.controller;

import com.example.da_be.dto.SanPhamCTWithImagesDTO;
import com.example.da_be.entity.SanPhamCT;
import com.example.da_be.service.SanPhamCTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/san-pham-ct")
public class SanPhamCTController {

    @Autowired
    private SanPhamCTService sanPhamCTService;

    // Lấy danh sách tất cả sản phẩm chi tiết
    @GetMapping
    public List<SanPhamCT> getAllSanPhamCT() {
        return sanPhamCTService.getAllSanPhamCT();
    }

    // Lấy thông tin sản phẩm chi tiết theo id
    @GetMapping("/{id}")
    public ResponseEntity<SanPhamCT> getSanPhamCTById(@PathVariable int id) {
        SanPhamCT sanPhamCT = sanPhamCTService.getSanPhamCTById(id);
        if (sanPhamCT.getId() == 0) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(sanPhamCT, HttpStatus.OK);
    }

    // Xóa sản phẩm chi tiết theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSanPhamCT(@PathVariable int id) {
        sanPhamCTService.deleteSanPhamCTById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Thêm sản phẩm chi tiết mới
    @PostMapping
    public ResponseEntity<SanPhamCT> addSanPhamCT(@RequestBody SanPhamCT sanPhamCT) {
        SanPhamCT createdSanPhamCT = sanPhamCTService.saveOrUpdateSanPhamCT(sanPhamCT);
        return new ResponseEntity<>(createdSanPhamCT, HttpStatus.CREATED);
    }

    // Cập nhật thông tin sản phẩm chi tiết
    @PutMapping("/{id}")
    public ResponseEntity<SanPhamCT> updateSanPhamCT(@PathVariable int id, @RequestBody SanPhamCT sanPhamCT) {
        sanPhamCT.setId(id);  // Đảm bảo ID trong body và path là giống nhau
        SanPhamCT updatedSanPhamCT = sanPhamCTService.saveOrUpdateSanPhamCT(sanPhamCT);
        return new ResponseEntity<>(updatedSanPhamCT, HttpStatus.OK);
    }


    @GetMapping("/with-images/{id}")
    public ResponseEntity<SanPhamCTWithImagesDTO> getSanPhamCTWithImages(@PathVariable Long id) {
        SanPhamCTWithImagesDTO sanPhamCTWithImages = sanPhamCTService.getSanPhamCTWithImages(id);
        return ResponseEntity.ok(sanPhamCTWithImages);
    }


    @GetMapping("/with-images")
    public ResponseEntity<List<SanPhamCTWithImagesDTO>> getAllSanPhamCTWithImages() {
        List<SanPhamCTWithImagesDTO> sanPhamCTWithImagesList = sanPhamCTService.getAllSanPhamCTWithImages();
        return ResponseEntity.ok(sanPhamCTWithImagesList);
    }

}
