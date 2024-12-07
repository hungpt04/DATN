package com.example.da_be.service;

import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.response.KhachHangResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface KhachHangVoucherService {
    List<Integer> getIdKhachHangByIdVoucher(Integer idVoucher);

}
