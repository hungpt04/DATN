package com.example.da_be.controller;

import com.example.da_be.entity.Voucher;
import com.example.da_be.repository.KhachHang_VoucherRepository;
import com.example.da_be.response.VoucherResponse;
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

    @Autowired
    private KhachHang_VoucherRepository khachHangVoucherRepository;

    @GetMapping("/list-id-khach-hang/{idVoucher}")
    public List<Integer> getIdKhachHangByIdVoucher(@PathVariable Integer idVoucher) {
        return khachHangVoucherService.getIdKhachHangByIdVoucher(idVoucher);
    }

    @GetMapping("/getList/{id}")
    public List<Voucher> getListVoucher(@PathVariable Integer id) {
        return  khachHangVoucherRepository.getListVoucherByIdKhachHang(id);
    }

    //voucher my profile
    @GetMapping("/voucher-public")
    public List<Voucher> getVoucherPublicMyProfile() {
        return khachHangVoucherRepository.getVoucherPublic();
    }

    @GetMapping("/voucher-private/{idKhachHang}")
    public List<Voucher> getVoucherPrivateMyProfile(@PathVariable Integer idKhachHang) {
        return khachHangVoucherRepository.getVoucherPrivate(idKhachHang);
    }
}
