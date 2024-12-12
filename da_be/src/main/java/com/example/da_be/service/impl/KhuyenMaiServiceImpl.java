package com.example.da_be.service.impl;

import com.example.da_be.entity.KhuyenMai;
import com.example.da_be.entity.SanPhamCT;
import com.example.da_be.entity.SanPhamKhuyenMai;
import com.example.da_be.repository.KhuyenMaiRepository;
import com.example.da_be.repository.SanPhamCTRepository;
import com.example.da_be.repository.SanPhamKhuyenMaiRepository;
import com.example.da_be.request.*;
import com.example.da_be.response.KhuyenMaiResponse;
import com.example.da_be.response.SanPhamCTResponse;
import com.example.da_be.response.SanPhamResponse;
import com.example.da_be.service.KhuyenMaiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class KhuyenMaiServiceImpl implements KhuyenMaiService {
    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;

    @Autowired
    private SanPhamCTRepository sanPhamChiTietRepository;

    @Autowired
    private SanPhamKhuyenMaiRepository sanPhamKhuyenMaiRepository;

    @Override
    public List<KhuyenMaiResponse> getAllKhuyenMai() {
        return khuyenMaiRepository.getAllKhuyenMai();
    }

    @Override
    public List<SanPhamResponse> getAllSanPham() {
        return khuyenMaiRepository.getAllSanPham();
    }

    @Override
    public List<SanPhamCTResponse> getAllSanPhamChiTiet() {
        return khuyenMaiRepository.getAllSanPhamChiTiet();
    }

    @Override
    public List<SanPhamCTResponse> getSanPhamChiTietBySanPham(List<Integer> id) {
        return khuyenMaiRepository.getSanPhamChiTietBySanPham(id);
    }

    @Override
    public KhuyenMai addKhuyenMaiOnProduct(KhuyenMaiRequest khuyenMaiRequest) {
        KhuyenMai khuyenMai = khuyenMaiRequest.newKhuyenMaiAddSanPham(new KhuyenMai());
        khuyenMaiRepository.save(khuyenMai);

        List<SanPhamCT> spctList = sanPhamChiTietRepository.findAll();
        List<SanPhamKhuyenMai> sanPhamKhuyenMaiList = new ArrayList<>();

        // Nếu type == false: Áp dụng cho TẤT CẢ sản phẩm
        if (khuyenMaiRequest.getLoai() == false) {
            for (SanPhamCT spct : spctList) {
                SanPhamRequest addRequest = new SanPhamRequest();
                addRequest.setKhuyenMai(khuyenMai);
                addRequest.setSanPhamChiTiet(spct);
                SanPhamKhuyenMai sanPhamKhuyenMai = addRequest.newSanPhamKhuyenMai(new SanPhamKhuyenMai());
                sanPhamKhuyenMaiList.add(sanPhamKhuyenMai);
            }
        }
        // Nếu type == true: Áp dụng cho các sản phẩm ĐƯỢC CHỌN
        else {
            for (Integer idProductDetail : khuyenMaiRequest.getIdProductDetail()) {
                SanPhamCT spct = sanPhamChiTietRepository.findById(idProductDetail).get();
                SanPhamRequest addRequest = new SanPhamRequest();
                addRequest.setKhuyenMai(khuyenMai);
                addRequest.setSanPhamChiTiet(spct);
                SanPhamKhuyenMai sanPhamKhuyenMai = addRequest.newSanPhamKhuyenMai(new SanPhamKhuyenMai());
                sanPhamKhuyenMaiList.add(sanPhamKhuyenMai);
            }
        }
        sanPhamKhuyenMaiRepository.saveAll(sanPhamKhuyenMaiList);
        return khuyenMai;
    }


    @Override
    public KhuyenMai updateKhuyenMai(KhuyenMaiRequest khuyenMaiRequest, Integer id) {
        KhuyenMai existingKhuyenMai = khuyenMaiRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("KhuyenMai not found for ID: " + id));

        // Xóa tất cả sản phẩm khuyến mãi cũ
        List<SanPhamKhuyenMai> oldSanPhamKhuyenMai = sanPhamKhuyenMaiRepository.getListSanPhamKhuyenMaiByIdKhuyenMai(id);
        if (!oldSanPhamKhuyenMai.isEmpty()) {
            sanPhamKhuyenMaiRepository.deleteAll(oldSanPhamKhuyenMai);
        }

        // Cập nhật thông tin khuyến mãi
        KhuyenMai updatedKhuyenMai = khuyenMaiRequest.newKhuyenMaiAddSanPham(existingKhuyenMai);
        khuyenMaiRepository.save(updatedKhuyenMai);

        // Thêm mới danh sách sản phẩm khuyến mãi
        List<SanPhamKhuyenMai> newSanPhamKhuyenMaiList = new ArrayList<>();
        if (!khuyenMaiRequest.getLoai()) {
            List<SanPhamCT> spctList = sanPhamChiTietRepository.findAll();
            for (SanPhamCT spct : spctList) {
                SanPhamKhuyenMai newSanPhamKhuyenMai = new SanPhamKhuyenMai();
                newSanPhamKhuyenMai.setKhuyenMai(updatedKhuyenMai);
                newSanPhamKhuyenMai.setSanPhamCT(spct);
                newSanPhamKhuyenMaiList.add(newSanPhamKhuyenMai);
            }
        } else {
            for (Integer idProductDetail : khuyenMaiRequest.getIdProductDetail()) {
                SanPhamCT spct = sanPhamChiTietRepository.findById(idProductDetail)
                        .orElseThrow(() -> new IllegalArgumentException("SanPhamChiTiet not found for ID: " + idProductDetail));
                SanPhamKhuyenMai newSanPhamKhuyenMai = new SanPhamKhuyenMai();
                newSanPhamKhuyenMai.setKhuyenMai(updatedKhuyenMai);
                newSanPhamKhuyenMai.setSanPhamCT(spct);
                newSanPhamKhuyenMaiList.add(newSanPhamKhuyenMai);
            }
        }
        sanPhamKhuyenMaiRepository.saveAll(newSanPhamKhuyenMaiList);

        return updatedKhuyenMai;
    }


    @Override
    public KhuyenMaiResponse getKhuyenMaiById(Integer id) {
        return khuyenMaiRepository.getKhuyenMaiById(id);
    }

    @Override
    public List<Integer> getIdSanPhamVaSanPhamChiTietByIdKhuyenMai(Integer idKhuyenMai) {
        return khuyenMaiRepository.getIdSanPhamVaSanPhamChiTietByIdKhuyenMai(idKhuyenMai);
    }

    @Override
    public List<Integer> getIdSanPhamChiTietByIdKhuyenMai(Integer idKhuyenMai) {
        return khuyenMaiRepository.getIdSanPhamChiTietByIdKhuyenMai(idKhuyenMai);
    }

    @Override
    public KhuyenMai deleteKhuyenMai(Integer id) {
        // Lấy ngày giờ hiện tại (bao gồm cả giờ)
        LocalDateTime currentDateTime = LocalDateTime.now();

        // Tìm khuyến mãi theo id
        Optional<KhuyenMai> optionalKhuyenMai = khuyenMaiRepository.findById(id);
        if (optionalKhuyenMai.isPresent()) {
            KhuyenMai khuyenMai = optionalKhuyenMai.get();
            // Cập nhật trạng thái và thời gian kết thúc
            khuyenMai.setTrangThai(2);
            khuyenMai.setTgKetThuc(currentDateTime);
            return khuyenMaiRepository.save(khuyenMai);
        } else {
            return null;
        }
    }

    @Override
    public Page<KhuyenMaiResponse> getSearchKhuyenMai(KhuyenMaiSearch khuyenMaiSearch, Pageable pageable) {
        return khuyenMaiRepository.getSearchKhuyenMai(khuyenMaiSearch, pageable);
    }

    @Override
    public Page<SanPhamResponse> getSearchSanPham(SanPhamSearch sanPhamSearch, Pageable pageable) {
        return khuyenMaiRepository.getSearchSanPham(sanPhamSearch, pageable);
    }

    @Override
    public Page<SanPhamCTResponse> phanTrangSanPhamCT(Pageable pageable) {
        return khuyenMaiRepository.phanTrangSanPhamCT(pageable);
    }

    @Override
    public List<SanPhamCTResponse> fillterSanPhamCT(SanPhamCTSearch sanPhamCTSearch) {
        return khuyenMaiRepository.fillterSanPhamCT(sanPhamCTSearch);
    }

    @Override
    public Page<SanPhamCTResponse> getSanPhamChiTietBySanPham(SanPhamCTSearch search, List<Integer> id, Pageable pageable) {
        return khuyenMaiRepository.getSanPhamChiTietBySanPham(search, id, pageable);
    }

    @Override
    public List<String> getAllTenKhuyenMai() {
        return khuyenMaiRepository.getAllTenKhuyenMai();
    }

    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void cronJobCheckPromotion() {
        boolean flag = false;
        LocalDateTime dateNow = LocalDateTime.now();

        List<KhuyenMai> khuyenMaisList = khuyenMaiRepository.getAllKhuyenMaiWrong(dateNow);

        for (KhuyenMai khuyenMai : khuyenMaisList) {
            if (khuyenMai.getTgBatDau().isAfter(dateNow) &&
                    khuyenMai.getTrangThai() != 0) {
                khuyenMai.setTrangThai(0);
                flag = true;
            } else if (khuyenMai.getTgKetThuc().isBefore(dateNow) &&
                    khuyenMai.getTrangThai() != 2) {
                khuyenMai.setTrangThai(2);
                flag = true;
            } else if (khuyenMai.getTgBatDau().isBefore(dateNow) &&
                    khuyenMai.getTgKetThuc().isAfter(dateNow) &&
                    khuyenMai.getTrangThai() != 1) {
                khuyenMai.setTrangThai(1);
                flag = true;
            }
        }
    }
}
