package com.example.da_be.controller;

import com.example.da_be.request.NhanVienRequest;
import com.example.da_be.request.NhanVienSearch;
import com.example.da_be.response.NhanVienResponse;
import com.example.da_be.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/nhan-vien")
public class NhanVienController {
    @Autowired
    private NhanVienService nhanVienService;

    @GetMapping("/hien-thi")
    public List<NhanVienResponse> getAllNhanVien() {
        return nhanVienService.getAllNhanVien();
    }

    @GetMapping("/searchNhanVien")
    public Map<String, Object> searchNhanVien(
            @RequestParam(required = false) String tenSearch,
            @RequestParam(required = false) String emailSearch,
            @RequestParam(required = false) String sdtSearch,
            @RequestParam(required = false) Integer gioiTinhSearch,
            @RequestParam(required = false) Integer trangThaiSearch,
            @RequestParam(value = "currentPage", defaultValue = "0") Integer currentPage,
            @RequestParam(value = "size", defaultValue = "5") Integer size
    ) {
        NhanVienSearch search = new NhanVienSearch();
        search.setTenSearch(tenSearch);
        search.setEmailSearch(emailSearch);
        search.setSdtSearch(sdtSearch);
        search.setGioiTinhSearch(gioiTinhSearch);
        search.setTrangThaiSearch(trangThaiSearch);

        Pageable pageable = PageRequest.of(currentPage, size);

        Page<NhanVienResponse> pageResult = nhanVienService.searchNhanVien(search, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", pageResult.getContent());
        response.put("totalPages", pageResult.getTotalPages());
        response.put("totalElements", pageResult.getTotalElements());
        response.put("currentPage", pageResult.getNumber());
        response.put("size", pageResult.getSize());

        return response;
    }

    @GetMapping("/detail/{id}")
    public NhanVienResponse getNhanVienById(@PathVariable Integer id) {
        return nhanVienService.getNhanVienById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(NhanVienRequest nhanVienRequest) throws ParseException {
        return ResponseEntity.ok(nhanVienService.add(nhanVienRequest));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(NhanVienRequest nhanVienRequest, @PathVariable Integer id) throws ParseException {
        return ResponseEntity.ok(nhanVienService.update(nhanVienRequest, id));
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return ResponseEntity.ok(nhanVienService.delete(id));
    }
}
