package com.example.da_be.repository;

import com.example.da_be.entity.TrongLuong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrongLuongRepository extends JpaRepository<TrongLuong, Integer> {
}
