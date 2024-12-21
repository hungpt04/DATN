package com.example.da_be.controller;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.request.KhachHangRequest;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.response.KhachHangResponse;
import com.example.da_be.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/khach-hang")
public class KhachHangController {
    @Autowired
    private KhachHangService khachHangService;

    @GetMapping("/searchKhachHang")
    public Map<String, Object> searchKhachHang(
            @RequestParam(required = false) String tenSearch,
            @RequestParam(required = false) String emailSearch,
            @RequestParam(required = false) String sdtSearch,
            @RequestParam(required = false) Integer gioiTinhSearch,
            @RequestParam(required = false) Integer trangThaiSearch,
            @RequestParam(value = "currentPage", defaultValue = "0") Integer currentPage,
            @RequestParam(value = "size", defaultValue = "5") Integer size
    ) {
        KhachHangSearch search = new KhachHangSearch();
        search.setTenSearch(tenSearch);
        search.setEmailSearch(emailSearch);
        search.setSdtSearch(sdtSearch);
        search.setGioiTinhSearch(gioiTinhSearch);
        search.setTrangThaiSearch(trangThaiSearch);

        Pageable pageable = PageRequest.of(currentPage, size);

        Page<KhachHangResponse> pageResult = khachHangService.getSearchKhachHang(search, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", pageResult.getContent());
        response.put("totalPages", pageResult.getTotalPages());
        response.put("totalElements", pageResult.getTotalElements());
        response.put("currentPage", pageResult.getNumber());
        response.put("size", pageResult.getSize());

        return response;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addKhachHang(KhachHangRequest khachHangRequest) throws ParseException {
        return ResponseEntity.ok(khachHangService.add(khachHangRequest));
    }

    @GetMapping("/getKhachHangById/{id}")
    public ResponseEntity<TaiKhoan> getKhachHangById(@PathVariable Integer id) {
        return ResponseEntity.ok(khachHangService.getKhachHangById(id));
    }

//    @PutMapping("/update/{id}")
//    public ResponseEntity<?> updateKhachHang(@PathVariable Integer id, @ModelAttribute KhachHangRequest khachHangRequest) throws ParseException {
//        return ResponseEntity.ok(khachHangService.update(id, khachHangRequest));
//    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateKhachHang(
            @PathVariable Integer id,
            @RequestParam("hoTen") String hoTen,
            @RequestParam("sdt") String sdt,
            @RequestParam("email") String email,
            @RequestParam("gioiTinh") String gioiTinh,
            @RequestParam("vaiTro") String vaiTro,
            @RequestParam("ngaySinh") LocalDate ngaySinh,
            @RequestParam("trangThai") Integer trangThai,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) throws ParseException {

        KhachHangRequest khachHangRequest = new KhachHangRequest();
        khachHangRequest.setHoTen(hoTen);
        khachHangRequest.setSdt(sdt);
        khachHangRequest.setEmail(email);
        khachHangRequest.setGioiTinh(Integer.parseInt(gioiTinh));
        khachHangRequest.setVaiTro(vaiTro);
        khachHangRequest.setNgaySinh(ngaySinh);
        khachHangRequest.setTrangThai(trangThai);
        khachHangRequest.setAvatar(avatar);


        return ResponseEntity.ok(khachHangService.update(id, khachHangRequest));
    }
}
