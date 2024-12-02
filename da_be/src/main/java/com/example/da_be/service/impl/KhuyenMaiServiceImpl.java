package com.example.da_be.service.impl;

import com.example.da_be.entity.KhuyenMai;
import com.example.da_be.entity.SanPhamCT;
import com.example.da_be.entity.SanPhamKhuyenMai;
import com.example.da_be.repository.KhuyenMaiRepository;
import com.example.da_be.repository.SanPhamCTRepository;
import com.example.da_be.repository.SanPhamKhuyenMaiRepository;
import com.example.da_be.request.KhuyenMaiRequest;
import com.example.da_be.request.SanPhamRequest;
import com.example.da_be.response.KhuyenMaiResponse;
import com.example.da_be.response.SanPhamCTResponse;
import com.example.da_be.response.SanPhamResponse;
import com.example.da_be.service.KhuyenMaiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

//    @Override
//    public KhuyenMai updateKhuyenMai(KhuyenMaiRequest khuyenMaiRequest, Integer id) {
//        KhuyenMai getOneKhuyenMai = khuyenMaiRepository.findById(id).orElse(null);
//        List<SanPhamChiTiet> spctList = sanPhamChiTietRepository.findAll();
//        List<SanPhamKhuyenMai> sanPhamKhuyenMai = sanPhamKhuyenMaiRepository.getListSanPhamKhuyenMaiByIdKhuyenMai(id);
//
//        for (SanPhamKhuyenMai spkm : sanPhamKhuyenMai) {
//            sanPhamKhuyenMaiRepository.deleteById(spkm.getId());
//        }
//
//        KhuyenMai khuyenMaiUpdate = new KhuyenMai();
//
//        if (getOneKhuyenMai != null) {
//            KhuyenMai khuyenMai = getOneKhuyenMai;
//            khuyenMaiUpdate = khuyenMaiRepository.save(khuyenMaiRequest.newKhuyenMaiAddSanPham(khuyenMai));
//
//            List<SanPhamKhuyenMai> sanPhamKhuyenMaiList1 = new ArrayList<>();
//
//            // Nếu type == false: Áp dụng cho TẤT CẢ sản phẩm
//            if (khuyenMaiRequest.getLoai() == false) {
//                for (SanPhamChiTiet spct : spctList) {
//                    SanPhamRequest addRequest = new SanPhamRequest();
//                    addRequest.setKhuyenMai(khuyenMai);
//                    addRequest.setSanPhamChiTiet(spct);
//                    SanPhamKhuyenMai sanPhamKhuyenMai1 = addRequest.newSanPhamKhuyenMai(new SanPhamKhuyenMai());
//                    sanPhamKhuyenMaiList1.add(sanPhamKhuyenMai1);
//                }
//            }
//            // Nếu type == true: Áp dụng cho các sản phẩm ĐƯỢC CHỌN
//            else {
//                for (Integer idProductDetail : khuyenMaiRequest.getIdProductDetail()) {
//                    SanPhamChiTiet spct = sanPhamChiTietRepository.findById(idProductDetail).get();
//                    SanPhamRequest addRequest = new SanPhamRequest();
//                    addRequest.setKhuyenMai(khuyenMai);
//                    addRequest.setSanPhamChiTiet(spct);
//                    SanPhamKhuyenMai sanPhamKhuyenMai1 = addRequest.newSanPhamKhuyenMai(new SanPhamKhuyenMai());
//                    sanPhamKhuyenMaiList1.add(sanPhamKhuyenMai1);
//                }
//            }
//            sanPhamKhuyenMaiRepository.saveAll(sanPhamKhuyenMaiList1);
//
//            List<KhuyenMai> khuyenMaiList = new ArrayList<>();
//            khuyenMaiList.add(khuyenMaiUpdate);
//
//            return khuyenMai;
//        }
//        return null;
//    }

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
    public KhuyenMai deleteKhuyenMai(Integer id) {
        // Lấy ngày hiện tại (không có giờ)
        LocalDate currentDate = LocalDate.now();
        // Định dạng ngày theo kiểu "dd-MM-yyyy"
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        String formattedDate = currentDate.format(dateFormatter);

        // Chuyển đổi chuỗi thành LocalDate
        LocalDate endDate = LocalDate.parse(formattedDate, dateFormatter);
        // Tìm khuyến mãi theo id
        Optional<KhuyenMai> optionalKhuyenMai = khuyenMaiRepository.findById(id);
        if (optionalKhuyenMai.isPresent()) {
            KhuyenMai khuyenMai = optionalKhuyenMai.get();
            // Cập nhật trạng thái và thời gian kết thúc (chỉ ngày)
            khuyenMai.setTrangThai(2);
            khuyenMai.setTgKetThuc(endDate);
            return khuyenMaiRepository.save(khuyenMai);
        } else {
            return null;
        }

    }
}
