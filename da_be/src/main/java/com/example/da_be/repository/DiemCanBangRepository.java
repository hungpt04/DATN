package com.example.da_be.repository;

import com.example.da_be.entity.DiemCanBang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiemCanBangRepository extends JpaRepository<DiemCanBang, Integer> {
    @Query(
            "SELECT dcb FROM DiemCanBang dcb WHERE dcb.trangThai = 1"
    )
    List<DiemCanBang> getAllDiemCanBang();
}
