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

    Optional<TaiKhoan> findByEmail(String email);

//    @Query(
//            """
//        SELECT new com.example.da_be.entity.TaiKhoan(tk.id, tk.ma, tk.hoTen, tk.sdt, tk.email, tk.matKhau, tk.gioiTinh, tk.vaiTro, tk.avatar, tk.ngaySinh, tk.cccd, tk.trangThai, tk.diaChiList)
//        FROM TaiKhoan tk
//        where tk.vaiTro = 'User'
//        and
//        (:#{#search.tenSearch} IS NULL OR tk.hoTen LIKE %:#{#search.tenSearch}%)
//        and
//        (:#{#search.emailSearch} IS NULL OR tk.email LIKE %:#{#search.emailSearch}%)
//        and
//        (:#{#search.sdtSearch} IS NULL OR tk.sdt LIKE %:#{#search.sdtSearch}%)
//        and
//        (:#{#search.gioiTinhSearch} IS NULL OR tk.gioiTinh = :#{#search.gioiTinhSearch})
//        and
//        (:#{#search.trangThaiSearch} IS NULL OR tk.trangThai = :#{#search.trangThaiSearch})
//        order by tk.id desc
//"""
//    )
//    Page<TaiKhoan> getSearchNhanVienAndPhanTrang(NhanVienSearch search, Pageable pageable);

//    @Query(
//            """
//        SELECT new com.example.da_be.entity.TaiKhoan(tk.id, tk.ma, tk.hoTen, tk.sdt, tk.email, tk.matKhau, tk.gioiTinh, tk.vaiTro, tk.avatar, tk.ngaySinh, tk.cccd, tk.trangThai, tk.diaChiList)
//        FROM TaiKhoan tk
//        where tk.vaiTro = 'Customer'
//        and
//        (:#{#search.tenSearch} IS NULL OR tk.hoTen LIKE %:#{#search.tenSearch}%)
//        and
//        (:#{#search.emailSearch} IS NULL OR tk.email LIKE %:#{#search.emailSearch}%)
//        and
//        (:#{#search.sdtSearch} IS NULL OR tk.sdt LIKE %:#{#search.sdtSearch}%)
//        and
//        (:#{#search.gioiTinhSearch} IS NULL OR tk.gioiTinh = :#{#search.gioiTinhSearch})
//        and
//        (:#{#search.trangThaiSearch} IS NULL OR tk.trangThai = :#{#search.trangThaiSearch})
//        order by tk.id desc
//"""
//    )
//    Page<TaiKhoan> getSearchKhacHangAndPhanTrang(KhachHangSearch search, Pageable pageable);

}
