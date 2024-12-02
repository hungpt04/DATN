package com.example.da_be.repository;

import com.example.da_be.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangRepository extends JpaRepository<TaiKhoan, Integer> {
}
