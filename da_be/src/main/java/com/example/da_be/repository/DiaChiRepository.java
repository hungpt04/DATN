package com.example.da_be.repository;

import com.example.da_be.entity.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaChiRepository extends JpaRepository<DiaChi, Long> {
    List<DiaChi> findByTaiKhoan_Id(Long idTaiKhoan); // Thêm phương thức tìm kiếm theo IdTaiKhoan
}