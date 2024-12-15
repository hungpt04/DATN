package com.example.da_be.repository;

import com.example.da_be.entity.LichSuDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface LichSuDonHangRepository extends JpaRepository<LichSuDonHang, Integer> {
    Optional<LichSuDonHang> findById(Integer id);

    List<LichSuDonHang> findByHoaDonId(int hoaDonId);

    @Modifying
    @Transactional
    @Query("DELETE FROM LichSuDonHang l WHERE l.hoaDon.id = :hoaDonId")
    void deleteByIdHoaDon(@Param("hoaDonId") int hoaDonId);
}