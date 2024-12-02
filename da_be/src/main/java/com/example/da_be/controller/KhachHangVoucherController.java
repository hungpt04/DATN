package com.example.da_be.controller;

import com.example.da_be.service.KhachHangVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/khach-hang-voucher")
public class KhachHangVoucherController {
    @Autowired
    private KhachHangVoucherService khachHangVoucherService;

    @GetMapping("/list-id-khach-hang/{idVoucher}")
    public List<Integer> getIdKhachHangByIdVoucher(@PathVariable Integer idVoucher) {
        return khachHangVoucherService.getIdKhachHangByIdVoucher(idVoucher);
    }
}
