package com.example.da_be.repository;

import com.example.da_be.entity.ThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThanhToanRepository extends JpaRepository<ThanhToan, Long> {
    ThanhToan findByHoaDonId(Long hoaDonId);
}
