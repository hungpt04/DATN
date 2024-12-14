package com.example.da_be.repository;

import com.example.da_be.entity.HoaDon;
import com.example.da_be.request.HoaDonKHRequest;
import com.example.da_be.response.HoaDonKHResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonKHRepository extends JpaRepository<HoaDon, Long> {

//    @Query(
//            """
//        select h.id, h.taiKhoan.id, h.trangThai, h.ngayTao, h.phiShip, h.tongTien
//        from HoaDon h
//        where (:#{request.trangThai} is null or h.trangThai = :#{request.trangThai})
//        and (:#{request.ma} is null or h.ma like %:#{#request.ma}% )
//        and h.taiKhoan.id = :idTaiKhoan
//        order by h.ngayTao desc
//"""
//    )
//    List<HoaDonKHResponse> getAllHoaDon(@Param("request")HoaDonKHRequest request,  @Param("idTaiKhoan") String idTaiKhoan);
}
