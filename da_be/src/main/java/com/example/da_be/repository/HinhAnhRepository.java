package com.example.da_be.repository;

import com.example.da_be.entity.HinhAnh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HinhAnhRepository extends JpaRepository<HinhAnh, Integer> {
    List<HinhAnh> findBySanPhamCT_Id(Long sanPhamCTId);
}
