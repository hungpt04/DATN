package com.example.da_be.service;

import com.example.da_be.entity.HoaDon;
import com.example.da_be.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    public List<HoaDon> getAllHoaDon() {
        return hoaDonRepository.findAll();
    }

    public HoaDon getHoaDonById(Long id) {
        Optional<HoaDon> hoaDon = hoaDonRepository.findById(id);
        return hoaDon.orElseGet(HoaDon::new);
    }

    public HoaDon saveOrUpdateHoaDon(HoaDon hoaDon) {
        return hoaDonRepository.save(hoaDon);
    }

    public void deleteHoaDonById(Long id) {
        hoaDonRepository.deleteById(id);
    }

    // Phương thức cập nhật trạng thái hóa đơn
    public HoaDon updateHoaDonStatus(Long id, int status) {
        Optional<HoaDon> optionalHoaDon = hoaDonRepository.findById(id);
        if (optionalHoaDon.isPresent()) {
            HoaDon hoaDon = optionalHoaDon.get();
            hoaDon.setTrangThai(status);
            return hoaDonRepository.save(hoaDon);
        }
        return null; // Hoặc ném ngoại lệ nếu không tìm thấy hóa đơn
    }
}