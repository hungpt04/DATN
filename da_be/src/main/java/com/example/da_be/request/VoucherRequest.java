package com.example.da_be.request;

import com.example.da_be.entity.Voucher;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {

    private String ma;

    private String ten;

    private Integer giaTri;

    private Integer giaTriMax;

    private Integer kieu;

    private Integer kieuGiaTri;

    private Integer soLuong;

    private Integer dieuKienNhoNhat;

//    private LocalDate ngayBatDau;
//
//    private LocalDate ngayKetThuc;

    private LocalDateTime ngayBatDau;

    private LocalDateTime ngayKetThuc;

    private Integer trangThai;

    private List<Integer> listIdCustomer;

    // Phương thức tiện ích để thiết lập trạng thái dựa trên ngày hiện tại
//    public Integer setDataStatus(LocalDate startDate, LocalDate endDate, Integer status) {
//        LocalDate currentDate = LocalDate.now();
//        if (!currentDate.isBefore(startDate) && currentDate.isBefore(endDate.plusDays(1))) {
//            return 1;  // Đang diễn ra
//        } else {
//            return status;  // Trạng thái mặc định hoặc đã hết hạn
//        }
//    }

    public Integer setDataStatus(LocalDateTime startDate, LocalDateTime endDate, Integer status) {
        LocalDateTime currentDateTime = LocalDateTime.now();

        // Kiểm tra xem thời gian hiện tại có nằm trong khoảng thời gian diễn ra không
        if (!currentDateTime.isBefore(startDate) && currentDateTime.isBefore(endDate.plusMinutes(1))) {
            return 1;  // Đang diễn ra
        } else {
            return status;  // Trạng thái mặc định hoặc đã hết hạn
        }
    }

    public Voucher newVoucher(Voucher voucher) throws ParseException {
        voucher.setMa(this.getMa());
        voucher.setTen(this.getTen());
        voucher.setGiaTri(this.getGiaTri());
        voucher.setGiaTriMax(this.getGiaTriMax());
        voucher.setKieu(this.getKieu());
        voucher.setKieuGiaTri(this.getKieuGiaTri());
        voucher.setSoLuong(this.getSoLuong());
        voucher.setDieuKienNhoNhat(this.getDieuKienNhoNhat());
        voucher.setNgayBatDau(this.getNgayBatDau());
        voucher.setNgayKetThuc(this.getNgayKetThuc());
        voucher.setTrangThai(this.setDataStatus(this.getNgayBatDau(), this.getNgayKetThuc(), this.getTrangThai()));
        return voucher;
    }
}
