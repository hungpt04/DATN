package com.example.da_be.repository;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.request.NhanVienSearch;
import com.example.da_be.response.NhanVienResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NhanVienRepository extends JpaRepository<TaiKhoan, Integer> {
    @Query(
            """
        SELECT new com.example.da_be.response.NhanVienResponse(tk.id, tk.ma, tk.hoTen, tk.sdt, tk.email, tk.matKhau, tk.gioiTinh, tk.vaiTro, tk.avatar, tk.ngaySinh, tk.cccd, tk.trangThai)
        FROM TaiKhoan tk
        WHERE (tk.vaiTro = 'User' OR tk.vaiTro = 'Admin')
"""
    )
    List<NhanVienResponse> getAllNhanVien();

    @Query(
            """
        SELECT new com.example.da_be.response.NhanVienResponse(tk.id, tk.ma, tk.hoTen, tk.sdt, tk.email, tk.matKhau, tk.gioiTinh, tk.vaiTro, tk.avatar, tk.ngaySinh, tk.cccd, tk.trangThai)
        FROM TaiKhoan tk
        WHERE tk.id = :id
"""
    )
    NhanVienResponse getNhanVienById(Integer id);

    @Query(
            """
        SELECT new com.example.da_be.response.NhanVienResponse(tk.id, tk.ma, tk.hoTen, tk.sdt, tk.email, tk.matKhau, tk.gioiTinh, tk.vaiTro, tk.avatar, tk.ngaySinh, tk.cccd, tk.trangThai)
        FROM TaiKhoan tk
        where (tk.vaiTro = 'User' OR tk.vaiTro = 'Admin')
        and
        (:#{#search.tenSearch} IS NULL OR tk.hoTen LIKE %:#{#search.tenSearch}%)
        and 
        (:#{#search.emailSearch} IS NULL OR tk.email LIKE %:#{#search.emailSearch}%)
        and 
        (:#{#search.sdtSearch} IS NULL OR tk.sdt LIKE %:#{#search.sdtSearch}%)
        and 
        (:#{#search.gioiTinhSearch} IS NULL OR tk.gioiTinh = :#{#search.gioiTinhSearch})
        and 
        (:#{#search.trangThaiSearch} IS NULL OR tk.trangThai = :#{#search.trangThaiSearch})
        order by tk.id desc
"""
    )
    Page<NhanVienResponse> getSearchNhanVienAndPhanTrang(NhanVienSearch search, Pageable pageable);
}
