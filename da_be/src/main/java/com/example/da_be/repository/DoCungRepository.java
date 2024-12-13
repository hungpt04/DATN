package com.example.da_be.repository;

import com.example.da_be.entity.DoCung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoCungRepository extends JpaRepository<DoCung, Integer> {
    @Query(
            "SELECT dc FROM DoCung dc WHERE dc.trangThai = 1"
    )
    List<DoCung> getAllDoCung();
}
