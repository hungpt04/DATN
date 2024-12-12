package com.example.da_be.controller;

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

import java.text.ParseException;
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
}
