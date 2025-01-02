package com.example.da_be.controller;

import com.example.da_be.response.HoaDonKHResponse;
import com.example.da_be.service.HoaDonKHService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/hoa-don-kh")
public class HoaDonKHController {
    @Autowired
    private HoaDonKHService hoaDonKHService;

    @GetMapping("/hoa-don/{idHoaDon}")
    public ResponseEntity<List<HoaDonKHResponse>> getHoaDonKHByIdHoaDon(@PathVariable Long idHoaDon) {
        List<HoaDonKHResponse> hoaDonKHResponses = hoaDonKHService.getHoaDonKHByIdHoaDon(idHoaDon);
        return new ResponseEntity<>(hoaDonKHResponses, HttpStatus.OK);
    }
}
