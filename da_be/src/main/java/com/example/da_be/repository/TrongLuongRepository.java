package com.example.da_be.repository;

import com.example.da_be.entity.TrongLuong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrongLuongRepository extends JpaRepository<TrongLuong, Integer> {
    @Query(
            "SELECT tl FROM TrongLuong tl WHERE tl.trangThai = 1"
    )
    List<TrongLuong> getAllTrongLuong();
}
