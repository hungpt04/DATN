package com.example.da_be.repository;

import com.example.da_be.entity.HoaDon;
import com.example.da_be.entity.HoaDonCT;
import com.example.da_be.dto.HoaDonCTWithImageDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonCTRepository extends JpaRepository<HoaDonCT, Integer> {

    @Query("SELECT new com.example.da_be.dto.HoaDonCTWithImageDTO(hdct, ha.link) " +
            "FROM HoaDonCT hdct " +
            "JOIN hdct.sanPhamCT sp ON hdct.sanPhamCT.id = sp.id " + // Sử dụng alias cho rõ ràng
            "JOIN HinhAnh ha ON sp.id = ha.sanPhamCT.id " +
            "WHERE hdct.hoaDon.id = :hoaDonId")
    List<HoaDonCTWithImageDTO> findHoaDonCTWithImages(@Param("hoaDonId") Long hoaDonId);

    List<HoaDonCT> findByHoaDonId(Long hoaDonId);

    List<HoaDonCT> findByHoaDon(HoaDon hoaDon);
}
