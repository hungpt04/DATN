package com.example.da_be.repository;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.response.KhachHangResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangRepository extends JpaRepository<TaiKhoan, Integer> {

    @Query(
            """
            SELECT new com.example.da_be.response.KhachHangResponse(tk.id, tk.hoTen, tk.sdt, tk.email, tk.ngaySinh)
            from TaiKhoan tk
            where tk.vaiTro = 'Customer' and tk.trangThai = 1
            and
            (:#{#search.tenSearch} IS NULL OR tk.hoTen LIKE %:#{#search.tenSearch}%)
            order by tk.id desc 
            """
    )
    Page<KhachHangResponse> getSearchKhachHang(@Param("search")KhachHangSearch search, Pageable pageable);
}
