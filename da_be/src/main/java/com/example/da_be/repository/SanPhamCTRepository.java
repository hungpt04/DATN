package com.example.da_be.repository;

import com.example.da_be.entity.SanPhamCT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SanPhamCTRepository extends JpaRepository<SanPhamCT, Integer> {
    Optional<SanPhamCT> findById(Long id);

    List<SanPhamCT> findBySanPham_Id(Integer productId);
}
