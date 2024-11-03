package com.example.da_be.repository;

import com.example.da_be.dto.GioHangWithImagesDTO;
import com.example.da_be.entity.GioHang;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GioHangRepository extends JpaRepository<GioHang, Integer> {
    @Query("SELECT new com.example.da_be.dto.GioHangWithImagesDTO(gh, ha.link) " +
            "FROM GioHang gh " +
            "JOIN gh.sanPhamCT sp ON gh.sanPhamCT.id = sp.id " + // Sử dụng alias cho rõ ràng
            "JOIN HinhAnh ha ON sp.id = ha.sanPhamCT.id " +
            "WHERE gh.taiKhoan.id = :taiKhoanId")
    List<GioHangWithImagesDTO> findGioHangCTWithImages(@Param("taiKhoanId") Long taiKhoanId);

    @Transactional
    void deleteByTaiKhoanId(Long taiKhoanId);

}
