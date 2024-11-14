package com.example.da_be.repository;

import com.example.da_be.entity.LichSuDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LichSuDonHangRepository extends JpaRepository<LichSuDonHang, Integer> {
    Optional<LichSuDonHang> findById(Integer id);

    List<LichSuDonHang> findByHoaDonId(int hoaDonId);
}