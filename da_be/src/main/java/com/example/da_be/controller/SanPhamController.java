package com.example.da_be.controller;

import com.example.da_be.cloudinary.CloudinaryImage;
import com.example.da_be.entity.SanPham;
import com.example.da_be.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/san-pham")
public class SanPhamController {
    @Autowired
    private SanPhamService sanPhamService;
    @Autowired
    private CloudinaryImage cloudinaryImage;

    @GetMapping
    public List<SanPham> getAllSanPham() {
        return sanPhamService.getAllSanPham();
    }

    @DeleteMapping("{id}")
    public void deleteSanPham(@PathVariable int id) {
        this.sanPhamService.deleteSanPhamById(id);
    }

    @PostMapping
    public SanPham addSanPham(@RequestBody SanPham sanPham) {
        return this.sanPhamService.saveOrUpdateSanPham(sanPham);
    }

    @PutMapping
    public SanPham updateSanPham(@RequestBody SanPham sanPham) {
        return this.sanPhamService.saveOrUpdateSanPham(sanPham);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam("nameFolder") String nameFolder
    ) {
        try {
            String imageUrl = cloudinaryImage.uploadImage(imageFile, nameFolder);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
