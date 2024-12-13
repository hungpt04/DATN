package com.example.da_be.repository;

import com.example.da_be.entity.ThuongHieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThuongHieuRepository extends JpaRepository<ThuongHieu, Integer> {
    @Query(
            "SELECT th FROM ThuongHieu th WHERE th.trangThai = 1"
    )
    List<ThuongHieu> getAllThuongHieu();
}
