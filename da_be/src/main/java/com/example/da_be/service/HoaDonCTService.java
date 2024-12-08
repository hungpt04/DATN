package com.example.da_be.service;

import com.example.da_be.dto.ConfirmPurchaseRequestDTO;
import com.example.da_be.entity.HoaDon;
import com.example.da_be.entity.HoaDonCT;
import com.example.da_be.entity.SanPhamCT;
import com.example.da_be.repository.HoaDonCTRepository;
import com.example.da_be.repository.SanPhamCTRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HoaDonCTService {
    @Autowired
    private HoaDonCTRepository hoaDonCTRepository;

    public List<HoaDonCT> getAllHoaDonCT() {
        return hoaDonCTRepository.findAll();
    }

    public HoaDonCT getHoaDonCTById(int id) {
        Optional<HoaDonCT> hoaDonCT = this.hoaDonCTRepository.findById(id);
        return hoaDonCT.orElseGet(HoaDonCT::new);
    }

    public HoaDonCT saveOrUpdateHoaDonCT(HoaDonCT hoaDonCT) {
        return this.hoaDonCTRepository.save(hoaDonCT);
    }

    public void deleteHoaDonCTById(int id) {
        this.hoaDonCTRepository.deleteById(id);
    }


    @Autowired
    private SanPhamCTRepository sanPhamCTRepository;

    @Transactional
    public void confirmPurchase(ConfirmPurchaseRequestDTO request) {
        // Lấy danh sách hóa đơn chi tiết từ hóa đơn cần xóa
        List<HoaDonCT> hoaDonCTList = hoaDonCTRepository.findByHoaDonId(request.getHoaDonId());

        if (hoaDonCTList.isEmpty()) {
            throw new RuntimeException("Hóa đơn không tồn tại hoặc không có chi tiết nào để xóa");
        }

        // Trừ số lượng tương ứng trong sản phẩm chi tiết
        for (HoaDonCT hoaDonCT : hoaDonCTList) {
            SanPhamCT sanPhamCT = hoaDonCT.getSanPhamCT();
            sanPhamCT.setSoLuong(sanPhamCT.getSoLuong() - hoaDonCT.getSoLuong());
            sanPhamCTRepository.save(sanPhamCT);
        }


    }

    // Phương thức cập nhật trạng thái hóa đơn
    public HoaDonCT updateHoaDonCTStatus(int id, int status) {
        Optional<HoaDonCT> optionalHoaDonCT = hoaDonCTRepository.findById(id);
        if (optionalHoaDonCT.isPresent()) {
            HoaDonCT hoaDonCT = optionalHoaDonCT.get();
            hoaDonCT.setTrangThai(status);
            return hoaDonCTRepository.save(hoaDonCT);
        }
        return null; // Hoặc ném ngoại lệ nếu không tìm thấy hóa đơn
    }
}
