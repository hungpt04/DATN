package com.example.da_be.controller;

import com.example.da_be.entity.DiaChi;
import com.example.da_be.request.DiaChiRequest;
import com.example.da_be.response.DiaChiResponse;
import com.example.da_be.response.KhuyenMaiResponse;
import com.example.da_be.service.DiaChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> updateDiaChiByHoang(@PathVariable Long id, @RequestBody DiaChi diaChi) {
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

    // lấy tất cả địa chỉ qua idTaiKhoan
    @GetMapping("/getAllDiaChi")
    public ResponseEntity<?> getAllDiaChi(
            @RequestParam Integer idTaiKhoan,
            @RequestParam(value = "currentPage", defaultValue = "0") Integer currentPage,
            @RequestParam(value = "size", defaultValue = "5") Integer size) {
        try {
            // Tạo Pageable từ currentPage và size
            Pageable pageable = PageRequest.of(currentPage, size);

            // Gọi dịch vụ để lấy dữ liệu phân trang
            Page<DiaChiResponse> result  = diaChiService.getAllDiaChiByIdTaiKhoan(pageable, idTaiKhoan);

            // Trả về dữ liệu với HTTP status 200 OK
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // Xử lý lỗi và trả về HTTP status 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi lấy danh sách địa chỉ", "error", e.getMessage()));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDiaChi(@RequestBody DiaChiRequest diaChiRequest) {
        return ResponseEntity.ok(diaChiService.add(diaChiRequest));
    }

    @PutMapping("/updatee/{id}")
    public ResponseEntity<?> updateDiaChi(@PathVariable Long id, @RequestBody DiaChiRequest diaChiRequest) {
        return ResponseEntity.ok(diaChiService.update(id, diaChiRequest));
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        diaChiService.delete(id);
    }

    @PutMapping("/status")
    public ResponseEntity<?> getTrangThaiDiaChiByIdTaiKhoan(@RequestParam Integer idTaiKhoan, @RequestParam Long idDiaChi) {
        return ResponseEntity.ok(diaChiService.updateDefault(idTaiKhoan, idDiaChi));
    }

}