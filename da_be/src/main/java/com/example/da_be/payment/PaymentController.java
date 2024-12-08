package com.example.da_be.payment;


import com.example.da_be.entity.HoaDon;
import com.example.da_be.entity.HoaDonCT;
import com.example.da_be.entity.LichSuDonHang;
import com.example.da_be.entity.SanPhamCT;
import com.example.da_be.repository.*;
import com.example.da_be.response.ResponseObject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${spring.application.api-prefix}/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private HoaDonCTRepository hoaDonCTRepository;

    @Autowired
    private SanPhamCTRepository sanPhamCTRepository;

    @Autowired
    private GioHangRepository gioHangRepository;
    @Autowired
    private LichSuDonHangRepository lichSuDonHangRepository;

    @GetMapping("/vn-pay")
    public ResponseObject<PaymentDTO.VNPayResponse> pay(HttpServletRequest request) {
        return new ResponseObject<>(HttpStatus.OK, "Success", paymentService.createVnPayPayment(request));
    }
    @GetMapping("/vn-pay-callback")
    public ResponseObject<PaymentDTO.VNPayResponse> payCallbackHandler(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestParam Map<String, String> params
    ) {
        try {
            String status = request.getParameter("vnp_ResponseCode");

            String amount = request.getParameter("vnp_Amount");

            // Lấy ID hóa đơn mới nhất
            String billId = String.valueOf(
                    hoaDonRepository.findTopByOrderByIdDesc()
                            .map(HoaDon::getId)
                            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hóa đơn"))
            );

            System.out.println("Bill ID: " + billId);


            if ("00".equals(status)) {
                // Tìm hóa đơn
                HoaDon hoaDon = hoaDonRepository.findById(Long.parseLong(billId))
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hóa đơn"));

                // Cập nhật trạng thái hóa đơn
                hoaDonRepository.save(hoaDon);

                // Cập nhật số lượng sản phẩm
                List<HoaDonCT> chiTiets = hoaDonCTRepository.findByHoaDon(hoaDon);
                for (HoaDonCT chiTiet : chiTiets) {
                    SanPhamCT sanPhamCT = chiTiet.getSanPhamCT();
                    sanPhamCT.setSoLuong(sanPhamCT.getSoLuong() - chiTiet.getSoLuong());
                    sanPhamCTRepository.save(sanPhamCT);
                }

                // Xóa giỏ hàng
                gioHangRepository.deleteByTaiKhoanId(hoaDon.getTaiKhoan().getId());



                // Redirect đến trang thanh toán thành công với thông tin
                String redirectUrl = "http://localhost:3000/payment-success?" +
                        params.entrySet().stream()
                                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                                .collect(Collectors.joining("&"));

                response.sendRedirect(redirectUrl);
                return new ResponseObject<>(
                        HttpStatus.OK,
                        "Thanh toán thành công",
                        PaymentDTO.VNPayResponse.builder()
                                .code("00")
                                .message("Thanh toán thành công")
                                .paymentUrl(redirectUrl)
                                .build()
                );
            } else {
                return new ResponseObject<>(
                        HttpStatus.BAD_REQUEST,
                        "Thanh toán thất bại",
                        null
                );
            }
        } catch (Exception e) {
            log.error("Lỗi xử lý callback VNPay", e);
            return new ResponseObject<>(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Lỗi hệ thống",
                    null
            );
        }
    }
}
