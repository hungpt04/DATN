package com.example.da_be.service;

import com.example.da_be.entity.Voucher;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.request.VoucherRequest;
import com.example.da_be.request.VoucherSearch;
import com.example.da_be.response.KhachHangResponse;
import com.example.da_be.response.VoucherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.text.ParseException;
import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getAllVoucher();
    List<KhachHangResponse> getAllKhachHang();
    List<String> getAllMaVoucher();
    List<String> getAllTenVoucher();
    VoucherResponse getVoucherById(Integer id);
    Voucher addVoucher(VoucherRequest voucherRequest);
    Voucher updateVoucher(Integer id, VoucherRequest voucherRequest) throws ParseException;
    Boolean deleteVoucher(Integer id);
    Page<VoucherResponse> phanTrangVoucher(Pageable pageable);
    Page<VoucherResponse>getSearchVoucher(VoucherSearch voucherSearch, Pageable pageable);
    Page<KhachHangResponse> getSearchKhachHang(KhachHangSearch khachHangSearch, Pageable pageable);
    Voucher giamSoLuongVoucher(Integer id);

}
