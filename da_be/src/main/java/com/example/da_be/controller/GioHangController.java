package com.example.da_be.controller;

import com.example.da_be.dto.GioHangWithImagesDTO;
import com.example.da_be.dto.HoaDonCTWithImageDTO;
import com.example.da_be.entity.GioHang;
import com.example.da_be.repository.GioHangRepository;
import com.example.da_be.service.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/gio-hang")
public class GioHangController {

    @Autowired
    private GioHangService gioHangService;
    @Autowired
    private GioHangRepository gioHangRepository;

    // Lấy danh sách tất cả giỏ hàng
    @GetMapping
    public List<GioHang> getAllGioHang() {
        return gioHangService.getAllGioHang();
    }

    // Lấy thông tin giỏ hàng theo id
    @GetMapping("/{id}")
    public ResponseEntity<GioHang> getGioHangById(@PathVariable int id) {
        GioHang gioHang = gioHangService.getGioHangById(id);
        return new ResponseEntity<>(gioHang, HttpStatus.OK);
    }

    // Thêm giỏ hàng mới
    @PostMapping
    public ResponseEntity<GioHang> addGioHang(@RequestBody GioHang gioHang) {
        GioHang createdGioHang = gioHangService.saveOrUpdateGioHang(gioHang);
        return new ResponseEntity<>(createdGioHang, HttpStatus.CREATED);
    }

    // Cập nhật thông tin giỏ hàng
    @PutMapping("/{id}")
    public ResponseEntity<GioHang> updateGioHang(@PathVariable int id, @RequestBody GioHang gioHang) {
        gioHang.setId(id);  // Đảm bảo ID trong body và path là giống nhau
        GioHang updatedGioHang = gioHangService.saveOrUpdateGioHang(gioHang);
        return new ResponseEntity<>(updatedGioHang, HttpStatus.OK);
    }

    // Xóa giỏ hàng theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGioHang(@PathVariable int id) {
        gioHangService.deleteGioHangById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}/update-quantity")
    public ResponseEntity<GioHang> updateQuantity(@PathVariable int id, @RequestParam int quantity) {
        GioHang gioHang = gioHangService.getGioHangById(id);
        if (gioHang != null) {
            gioHang.setSoLuong(quantity); // Cập nhật số lượng
            GioHang updatedGioHang = gioHangService.saveOrUpdateGioHang(gioHang);
            return new ResponseEntity<>(updatedGioHang, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }



    @GetMapping("/with-images/{taiKhoanId}")
    public ResponseEntity<List<GioHangWithImagesDTO>> getGioHangCTWithImages(@PathVariable Long taiKhoanId) {
        List<GioHangWithImagesDTO> cartsWithImages = gioHangRepository.findGioHangCTWithImages(taiKhoanId);
        return ResponseEntity.ok(cartsWithImages);
    }
}
