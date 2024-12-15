package com.example.da_be.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class HoaDonKHResponse {
    private String id; // ID hóa đơn
    private String khachHang; // ID khách hàng
    private String tenSanPham; // Tên sản phẩm
    private String ma; // Mã hóa đơn
    private Integer trangThai; // Trạng thái
    private LocalDate ngayTao; // Ngày tạo
    private BigDecimal tienShip; // Tiền ship
    private BigDecimal tongTien; // Tổng tiền
}
