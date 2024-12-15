package com.example.da_be.repository;

import com.example.da_be.entity.DiaChi;

import com.example.da_be.response.DiaChiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiaChiRepository extends JpaRepository<DiaChi, Long> {
    List<DiaChi> findByTaiKhoan_Id(Long idTaiKhoan); // Thêm phương thức tìm kiếm theo IdTaiKhoan

    @Query(
            """
            select dc.id from DiaChi dc
            where dc.taiKhoan.id = :idTaiKhoan
"""
    )
    Long getIdDiaChiByIdTaiKhoan(@Param("idTaiKhoan") Integer idTaiKhoan);

    @Query(
            """
            select new com.example.da_be.response.DiaChiResponse(dc.id, dc.ten, dc.sdt, dc.idTinh, dc.idHuyen, dc.idXa, dc.diaChiCuThe, dc.loai)
            from DiaChi dc
            where dc.taiKhoan.id = :idTaiKhoan
"""
    )
    Page<DiaChiResponse> getPageDiaChiByIdTaiKhoan(Pageable pageable, @Param("idTaiKhoan") Integer idTaiKhoan);

    @Query(
            """
            select dc from DiaChi dc
            where dc.taiKhoan.id = :idTaiKhoan
"""
    )
    List<DiaChi> getTrangThaiDiaChiByIdTaiKhoan(@Param("idTaiKhoan") Integer idTaiKhoan);

    @Modifying
    @Query("UPDATE DiaChi d SET d.loai = 0 WHERE d.taiKhoan.id = :taiKhoanId")
    void resetDefaultAddress(Long taiKhoanId);

}