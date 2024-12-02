package com.example.da_be.service;

import com.example.da_be.entity.HoaDon;
import com.example.da_be.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;


import java.util.List;

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

    public List<HoaDon> getSuccessfulOrders() {
        return hoaDonRepository.findByTrangThai(7);
    }

    public List<Map<String, Object>> getMonthlySalesData() {
        List<HoaDon> hoaDons = hoaDonRepository.findAll(); // Lấy tất cả hóa đơn
        Map<String, Integer> monthlyOrders = new HashMap<>();
        Map<String, Integer> monthlyRevenue = new HashMap<>();

        for (HoaDon hoaDon : hoaDons) {
            // Giả sử bạn có một phương thức để lấy tháng từ ngày tạo
            String month = getMonth(hoaDon.getNgayTao());

            // Cập nhật số lượng đơn hàng
            monthlyOrders.put(month, monthlyOrders.getOrDefault(month, 0) + 1);

            // Cập nhật doanh thu
            monthlyRevenue.put(month, monthlyRevenue.getOrDefault(month, 0) + hoaDon.getTongTien());
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (String month : monthlyOrders.keySet()) {
            Map<String, Object> data = new HashMap<>();
            data.put("month", month);
            data.put("orders", monthlyOrders.get(month));
            data.put("revenue", monthlyRevenue.get(month));
            result.add(data);
        }

        return result;
    }

    private String getMonth(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("MMM");
        return sdf.format(date);
    }
}