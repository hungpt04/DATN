package com.example.da_be.service;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.request.NhanVienRequest;
import com.example.da_be.request.NhanVienSearch;
import com.example.da_be.response.NhanVienResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.text.ParseException;
import java.util.List;

public interface NhanVienService {
    List<NhanVienResponse> getAllNhanVien();
    Page<NhanVienResponse> searchNhanVien(NhanVienSearch nhanVienSearch, Pageable pageable);
    NhanVienResponse getNhanVienById(Integer id);
    TaiKhoan add(NhanVienRequest nhanVienRequest) throws ParseException;
    Boolean update(NhanVienRequest nhanVienRequest, Integer id) throws ParseException;
    TaiKhoan delete(Integer id);
}
