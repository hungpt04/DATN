package com.example.da_be.repository;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.request.NhanVienSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Integer> {
    Optional<TaiKhoan> findById(Integer id);

    public TaiKhoan findByEmail(String email);

}
