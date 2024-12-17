package com.example.da_be.controller;

import com.example.da_be.dto.ConfirmPurchaseRequestDTO;
import com.example.da_be.dto.UpdateHoaDonCTStatusRequest;
import com.example.da_be.dto.UpdateHoaDonStatusRequest;
import com.example.da_be.entity.HoaDon;
import com.example.da_be.entity.HoaDonCT;
import com.example.da_be.dto.HoaDonCTWithImageDTO;
import com.example.da_be.repository.HoaDonCTRepository;
import com.example.da_be.service.HoaDonCTService;
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
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHoaDonCT(@PathVariable int id) {
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
    @PutMapping("/{id}")
    public ResponseEntity<HoaDonCT> updateHoaDonCT(@PathVariable int id, @RequestBody HoaDonCT hoaDonCT) {
        hoaDonCT.setId(id);  // Ensure the ID in the body and path are the same
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
