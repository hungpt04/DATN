package com.example.da_be.service;

import com.example.da_be.entity.Voucher;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.response.KhachHangResponse;
import com.example.da_be.response.VoucherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface KhachHangVoucherService {
    List<Integer> getIdKhachHangByIdVoucher(Integer idVoucher);

    List<Voucher> getVoucherPublic();

    List<Voucher> getVoucherPrivate(Integer idKhachHang);
}
