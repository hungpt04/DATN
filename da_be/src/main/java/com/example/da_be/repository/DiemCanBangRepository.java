package com.example.da_be.repository;

import com.example.da_be.entity.DiemCanBang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiemCanBangRepository extends JpaRepository<DiemCanBang, Integer> {
}
