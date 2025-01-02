package com.example.da_be.service;

import com.example.da_be.entity.HoaDon;
import com.example.da_be.entity.LichSuDonHang;
import com.example.da_be.repository.HoaDonRepository;
import com.example.da_be.repository.LichSuDonHangRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;


import java.util.List;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private LichSuDonHangRepository lichSuDonHangRepository;

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



    private String getMonth(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("MMM");
        return sdf.format(date);
    }

    @Transactional
    public void deleteHoaDon(Long id) {
         lichSuDonHangRepository.deleteByIdHoaDon(Math.toIntExact(id));
            hoaDonRepository.deleteById(id);
    }

    public List<HoaDon> getHoaDonByIdKhachHang(Integer idKH) {
        return hoaDonRepository.getHoaDonByIdKhachHang(idKH);
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

    public Map<String, Object> getStatisticsToday() {
        return convertMapKeys(hoaDonRepository.getStatisticsToday());
    }

    public Map<String, Object> getStatisticsThisWeek() {
        return convertMapKeys(hoaDonRepository.getStatisticsThisWeek());
    }

    public Map<String, Object> getStatisticsThisMonth() {
        return convertMapKeys(hoaDonRepository.getStatisticsThisMonth());
    }

    public Map<String, Object> getStatisticsThisYear() {
        return convertMapKeys(hoaDonRepository.getStatisticsThisYear());
    }

    // Phương thức hỗ trợ chuyển đổi key từ SQL sang camelCase
    private Map<String, Object> convertMapKeys(Map<String, Object> originalMap) {
        Map<String, Object> convertedMap = new HashMap<>();
        for (Map.Entry<String, Object> entry : originalMap.entrySet()) {
            String camelCaseKey = convertToCamelCase(entry.getKey());
            convertedMap.put(camelCaseKey, entry.getValue());
        }
        return convertedMap;
    }

    // Chuyển đổi snake_case sang camelCase
    private String convertToCamelCase(String snakeCase) {
        if (snakeCase == null || snakeCase.isEmpty()) {
            return snakeCase;
        }

        StringBuilder camelCase = new StringBuilder();
        boolean capitalizeNext = false;

        for (char c : snakeCase.toCharArray()) {
            if (c == '_') {
                capitalizeNext = true;
            } else if (capitalizeNext) {
                camelCase.append(Character.toUpperCase(c));
                capitalizeNext = false;
            } else {
                camelCase.append(Character.toLowerCase(c));
            }
        }

        return camelCase.toString();
    }

//    public List<Map<String, Object>> getMonthlySalesData() {
//        List<Map<String, Object>> salesData = hoaDonRepository.getMonthlySalesData();
//
//        // Chuyển đổi key sang camelCase
//        return salesData.stream()
//                .map(this::convertMapKeys)
//                .collect(Collectors.toList());
//    }

    public List<HoaDon> getSuccessfulOrders() {
        return hoaDonRepository.findByTrangThai(7); // Giả sử 7 là trạng thái đơn hàng thành công
    }

    public void chuyenTrangThaiHoaDon(Long id) {
       Optional<HoaDon> optionalHoaDon = hoaDonRepository.findById(id);

        if (optionalHoaDon.isEmpty()) {
            throw new EntityNotFoundException("Hóa đơn với ID " + id + " không tồn tại");
        }

        if (optionalHoaDon.isPresent()) {
           HoaDon hoaDon = optionalHoaDon.get();
           hoaDon.setTrangThai(8);
           hoaDonRepository.save(hoaDon);
       }
    }

    public Optional<String> getAnhSanPhamByHoaDonId(Long id, Integer idSPCT) {
        return hoaDonRepository.getAnhSanPhamByHoaDonId(id, idSPCT);
    }

    public List<Map<String, Object>> getDoanhThuTheoNgay() {
        return hoaDonRepository.getDoanhThuTheoNgay();
    }

//    public List<String> getAnhSanPhamByHoaDonId(Long id, List<Integer> idSPCT) {
//        // Pass the updated parameter (List<Integer>) to the repository method
//        return hoaDonRepository.getAnhSanPhamByHoaDonId(id, idSPCT);
//    }

}