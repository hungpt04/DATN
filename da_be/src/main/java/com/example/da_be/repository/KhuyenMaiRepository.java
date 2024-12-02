package com.example.da_be.repository;

import com.example.da_be.entity.KhuyenMai;
import com.example.da_be.response.KhuyenMaiResponse;
import com.example.da_be.response.SanPhamCTResponse;
import com.example.da_be.response.SanPhamResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhuyenMaiRepository extends JpaRepository<KhuyenMai, Integer> {
    @Query(
            """
        SELECT new com.example.da_be.response.KhuyenMaiResponse(km.id, km.ten, km.tgBatDau, km.tgKetThuc, km.trangThai, km.giaTri, km.loai)
        FROM KhuyenMai km
    """
    )
    List<KhuyenMaiResponse> getAllKhuyenMai();

    @Query(
            """
                   SELECT new com.example.da_be.response.SanPhamCTResponse(spct.id, spct.sanPham.ten, spct.thuongHieu.ten, spct.mauSac.ten, spct.chatLieu.ten, spct.trongLuong.ten, spct.diemCanBang.ten, spct.doCung.ten)
                     FROM SanPhamCT spct
            """
    )
    List<SanPhamCTResponse> getAllSanPhamChiTiet();

    @Query (
            """
            SELECT new com.example.da_be.response.SanPhamResponse(s.id, s.ma, s.ten, s.trangthai)
            FROM SanPham s
"""
    )
    List<SanPhamResponse> getAllSanPham();

    @Query(
            """
            SELECT new com.example.da_be.response.SanPhamCTResponse(spct.id, spct.sanPham.ten, spct.thuongHieu.ten, spct.mauSac.ten, spct.chatLieu.ten, spct.trongLuong.ten, spct.diemCanBang.ten, spct.doCung.ten)
            FROM SanPhamCT spct
            WHERE spct.sanPham.id IN :id
"""
    )
    List<SanPhamCTResponse> getSanPhamChiTietBySanPham(List<Integer> id);

    @Query(
            """
            SELECT new com.example.da_be.response.KhuyenMaiResponse(km.id, km.ten, km.tgBatDau, km.tgKetThuc, km.trangThai, km.giaTri, km.loai)
            FROM KhuyenMai km
            WHERE km.id = :id
    """
    )
    KhuyenMaiResponse getKhuyenMaiById(Integer id);

    @Query(
            """
            SELECT sp.id
            from SanPhamKhuyenMai spkm
            inner join SanPhamCT spct on spkm.sanPhamCT.id = spct.id
            inner join SanPham sp on spct.sanPham.id = sp.id
            where spkm.khuyenMai.id = :idKhuyenMai
"""
    )
    List<Integer> getIdSanPhamVaSanPhamChiTietByIdKhuyenMai(Integer idKhuyenMai);
}
