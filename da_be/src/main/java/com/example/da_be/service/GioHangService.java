package com.example.da_be.service;

import com.example.da_be.entity.GioHang;
import com.example.da_be.exception.ResourceNotFoundException;
import com.example.da_be.repository.GioHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GioHangService {
    @Autowired
    private GioHangRepository gioHangRepository;

    public List<GioHang> getAllGioHang() {
        return gioHangRepository.findAll();
    }

    public GioHang getGioHangById(int id) {
        Optional<GioHang> gioHang = gioHangRepository.findById(id);
        return gioHang.orElseThrow(() -> new ResourceNotFoundException("GioHang not found with id " + id));
    }

    public GioHang saveOrUpdateGioHang(GioHang gioHang) {
        return gioHangRepository.save(gioHang);
    }

    public void deleteGioHangById(int id) {
        gioHangRepository.deleteById(id);
    }

    public void deleteCartByAccountId(Integer taiKhoanId) {
        gioHangRepository.deleteByTaiKhoanId(taiKhoanId);
    }

}
