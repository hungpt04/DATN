package com.example.da_be.repository;

import com.example.da_be.entity.MauSac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MauSacRepository extends JpaRepository<MauSac, Integer> {
    @Query(
            "SELECT ms FROM MauSac ms WHERE ms.trangThai = 1"
    )
    List<MauSac> getAllMauSac();

}
