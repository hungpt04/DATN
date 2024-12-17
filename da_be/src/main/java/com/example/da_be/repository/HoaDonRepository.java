package com.example.da_be.repository;

import com.example.da_be.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Long> {
    @Query("SELECT h FROM HoaDon h WHERE h.trangThai = :trangThai")
    List<HoaDon> findByTrangThai(@Param("trangThai") int trangThai);

    Optional<HoaDon> findTopByOrderByIdDesc();

    @Query(
            """
        SELECT hd FROM HoaDon hd WHERE hd.taiKhoan.id = :idKH
"""
    )
    List<HoaDon> getHoaDonByIdKhachHang(Integer idKH);
}
