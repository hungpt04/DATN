package com.example.da_be.controller;

import com.example.da_be.dto.UpdateHoaDonStatusRequest;
import com.example.da_be.entity.HoaDon;
import com.example.da_be.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    @PutMapping("/update-status")
    public ResponseEntity<HoaDon> updateHoaDonStatus(@RequestBody UpdateHoaDonStatusRequest request) {
        HoaDon updatedHoaDon = hoaDonService.updateHoaDonStatus(request.getHoaDonId(), request.getStatus());
        if (updatedHoaDon == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedHoaDon, HttpStatus.OK);
    }

    @GetMapping("/successful-orders")
    public ResponseEntity<List<HoaDon>> getSuccessfulOrders() {
        List<HoaDon> successfulOrders = hoaDonService.getSuccessfulOrders();
        return new ResponseEntity<>(successfulOrders, HttpStatus.OK);
    }

    @GetMapping("/monthly-sales")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySales() {
        List<Map<String, Object>> monthlySalesData = hoaDonService.getMonthlySalesData();
        return new ResponseEntity<>(monthlySalesData, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteHD(@PathVariable Long id) {
        hoaDonService.deleteHoaDon(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/get-hd-by-id-kh/{idKH}")
    public List<HoaDon> getHoaDonByIdKhachHang(@PathVariable("idKH") Integer idKH) {
        return hoaDonService.getHoaDonByIdKhachHang(idKH);
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<Void> updateHoaDonStatus(@PathVariable Long id) {
        hoaDonService.chuyenTrangThaiHoaDon(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/anh-san-pham/{hoaDonId}/{sanPhamCTId}")
    public ResponseEntity<String> getAnhSanPhamChinhByHoaDonId(
            @PathVariable Long hoaDonId,
            @PathVariable Integer sanPhamCTId) {

        Optional<String> anhSanPhamChinh = hoaDonService.getAnhSanPhamByHoaDonId(hoaDonId, sanPhamCTId);

        return anhSanPhamChinh.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

//    @GetMapping("/anh-san-pham/{hoaDonId}")
//    public ResponseEntity<List<String>> getAnhSanPhamChinhByHoaDonId(
//            @PathVariable Long hoaDonId,
//            @RequestParam List<Integer> sanPhamCTId) { // Use @RequestParam for a list
//
//        List<String> anhSanPhamChinh = hoaDonService.getAnhSanPhamByHoaDonId(hoaDonId, sanPhamCTId);
//
//        return anhSanPhamChinh.isEmpty()
//                ? ResponseEntity.notFound().build()
//                : ResponseEntity.ok(anhSanPhamChinh);
//    }

}
