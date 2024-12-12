package com.example.da_be.service;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.request.KhachHangRequest;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.response.KhachHangResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.text.ParseException;
import java.util.List;

public interface KhachHangService {
    Page<KhachHangResponse> getSearchKhachHang(KhachHangSearch search, Pageable pageable);

    TaiKhoan add(KhachHangRequest khachHangRequest) throws ParseException;

    Boolean update(Integer id, KhachHangRequest khachHangRequest) throws ParseException;

    void delete(Integer id);

    TaiKhoan getKhachHangById(Integer id);

    List<KhachHangResponse> getAllKhachHang();
}
