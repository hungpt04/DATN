package com.example.da_be.repository;

import com.example.da_be.entity.SanPhamCT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamCTRepository extends JpaRepository<SanPhamCT, Integer> {


}
