package com.example.da_be.service.impl;

import com.example.da_be.repository.KhachHang_VoucherRepository;
import com.example.da_be.service.KhachHangVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KhachHangVoucherServiceImpl implements KhachHangVoucherService {
    @Autowired
    private KhachHang_VoucherRepository khachHang_voucherRepository;

    @Override
    public List<Integer> getIdKhachHangByIdVoucher(Integer idVoucher) {
        return khachHang_voucherRepository.getListIdKhachHangByIdVoucher(idVoucher);
    }
}
