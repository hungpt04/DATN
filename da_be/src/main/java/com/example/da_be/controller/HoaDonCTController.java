package com.example.da_be.controller;

import com.example.da_be.dto.ConfirmPurchaseRequestDTO;
import com.example.da_be.dto.UpdateHoaDonCTStatusRequest;
import com.example.da_be.dto.UpdateHoaDonStatusRequest;
import com.example.da_be.entity.HoaDon;
import com.example.da_be.entity.HoaDonCT;
import com.example.da_be.dto.HoaDonCTWithImageDTO;
import com.example.da_be.entity.SanPhamCT;
import com.example.da_be.repository.HoaDonCTRepository;
import com.example.da_be.service.HoaDonCTService;
import com.example.da_be.service.SanPhamCTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/hoa-don-ct")
public class HoaDonCTController {

    @Autowired
    private HoaDonCTService hoaDonCTService;

    @Autowired
    private HoaDonCTRepository hoaDonCTRepository;

    @Autowired
    private SanPhamCTService sanPhamCTService;

    // Get all HoaDonCT entries
    @GetMapping
    public List<HoaDonCT> getAllHoaDonCT() {
        return hoaDonCTService.getAllHoaDonCT();
    }

    // Get HoaDonCT entry by ID
    @GetMapping("/{id}")
    public ResponseEntity<HoaDonCT> getHoaDonCTById(@PathVariable int id) {
        HoaDonCT hoaDonCT = hoaDonCTService.getHoaDonCTById(id);
        if (hoaDonCT.getId() == 0) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(hoaDonCT, HttpStatus.OK);
    }

    // Delete HoaDonCT entry by ID
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteHoaDonCT(@PathVariable int id) {
//        hoaDonCTService.deleteHoaDonCTById(id);
//        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHoaDonCT(@PathVariable int id) {
        // Lấy hóa đơn chi tiết để lấy số lượng
        HoaDonCT hoaDonCT = hoaDonCTService.getHoaDonCTById(id);

        if (hoaDonCT == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Lấy sản phẩm liên quan
        SanPhamCT spct = sanPhamCTService.getSanPhamCTById(hoaDonCT.getSanPhamCT().getId());
        if (spct == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Cập nhật số lượng tồn kho sau khi xóa
        int updatedStock = spct.getSoLuong() + hoaDonCT.getSoLuong(); // Tăng lại số lượng tồn kho

        // Cập nhật tồn kho
        spct.setSoLuong(updatedStock);
        sanPhamCTService.saveOrUpdateSanPhamCT(spct);

        // Xóa hóa đơn chi tiết
        hoaDonCTService.deleteHoaDonCTById(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    // Add new HoaDonCT entry
    @PostMapping
    public ResponseEntity<HoaDonCT> addHoaDonCT(@RequestBody HoaDonCT hoaDonCT) {
        HoaDonCT createdHoaDonCT = hoaDonCTService.saveOrUpdateHoaDonCT(hoaDonCT);
        return new ResponseEntity<>(createdHoaDonCT, HttpStatus.CREATED);
    }

    // Update HoaDonCT entry
//    @PutMapping("/{id}")
//    public ResponseEntity<HoaDonCT> updateHoaDonCT(@PathVariable int id, @RequestBody HoaDonCT hoaDonCT) {
//        hoaDonCT.setId(id);  // Ensure the ID in the body and path are the same
//        HoaDonCT updatedHoaDonCT = hoaDonCTService.saveOrUpdateHoaDonCT(hoaDonCT);
//        return new ResponseEntity<>(updatedHoaDonCT, HttpStatus.OK);
//    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHoaDonCT(@PathVariable int id, @RequestBody HoaDonCT hoaDonCT) {
        // Lấy hóa đơn chi tiết hiện tại
        HoaDonCT existingHoaDonCT = hoaDonCTService.getHoaDonCTById(id);

        if (existingHoaDonCT == null) {
            return new ResponseEntity<>("Hóa đơn chi tiết không tồn tại!", HttpStatus.NOT_FOUND);
        }

        // Lấy sản phẩm liên quan
        SanPhamCT spct = sanPhamCTService.getSanPhamCTById(existingHoaDonCT.getSanPhamCT().getId());
        if (spct == null) {
            return new ResponseEntity<>("Sản phẩm không tồn tại!", HttpStatus.NOT_FOUND);
        }

        // Tính toán sự thay đổi số lượng
        int quantityChange = hoaDonCT.getSoLuong() - existingHoaDonCT.getSoLuong();
        int updatedStock = spct.getSoLuong() - quantityChange;

        // Kiểm tra tồn kho
        if (updatedStock < 0) {
            return new ResponseEntity<>("Không đủ hàng trong kho để cập nhật!", HttpStatus.BAD_REQUEST);
        }

        // Cập nhật tồn kho sản phẩm
        spct.setSoLuong(updatedStock);
        sanPhamCTService.saveOrUpdateSanPhamCT(spct);

        // Cập nhật hóa đơn chi tiết
        hoaDonCT.setId(id);  // Đảm bảo ID khớp với URL
        HoaDonCT updatedHoaDonCT = hoaDonCTService.saveOrUpdateHoaDonCT(hoaDonCT);

        return new ResponseEntity<>(updatedHoaDonCT, HttpStatus.OK);
    }


    @GetMapping("/with-images/{hoaDonId}")
    public ResponseEntity<List<HoaDonCTWithImageDTO>> getHoaDonCTWithImages(@PathVariable Long hoaDonId) {
        List<HoaDonCTWithImageDTO> detailsWithImages = hoaDonCTRepository.findHoaDonCTWithImages(hoaDonId);
        return ResponseEntity.ok(detailsWithImages);
    }

    @PostMapping("/confirm-purchase")
    public ResponseEntity<String> confirmPurchase(@RequestBody ConfirmPurchaseRequestDTO request) {
        hoaDonCTService.confirmPurchase(request);
        return ResponseEntity.ok("Xác nhận mua hàng thành công");
    }

    @PutMapping("/update-status")
    public ResponseEntity<HoaDonCT> updateHoaDonCTStatus(@RequestBody UpdateHoaDonCTStatusRequest request) {
        HoaDonCT updatedHoaDonCT = hoaDonCTService.updateHoaDonCTStatus(request.getHoaDonCTId(), request.getStatus());
        if (updatedHoaDonCT == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedHoaDonCT, HttpStatus.OK);
    }

    @GetMapping("/get-hd-ct-by-id-hd/{idHD}")
    public List<HoaDonCT> getHoaDonCTByIdHD (@PathVariable("idHD") Long idHD) {
        return hoaDonCTService.getHoaDonCTByIdHD(idHD);
    }

}
