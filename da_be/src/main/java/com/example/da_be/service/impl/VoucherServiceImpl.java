package com.example.da_be.service.impl;

import com.example.da_be.email.Email;
import com.example.da_be.email.EmailSender;
import com.example.da_be.entity.KhachHang_Voucher;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.entity.Voucher;
import com.example.da_be.repository.KhachHangRepository;
import com.example.da_be.repository.KhachHang_VoucherRepository;
import com.example.da_be.repository.VoucherRepository;
import com.example.da_be.request.KhachHangSearch;
import com.example.da_be.request.KhachHang_VoucherRequest;
import com.example.da_be.request.VoucherRequest;
import com.example.da_be.request.VoucherSearch;
import com.example.da_be.response.KhachHangResponse;
import com.example.da_be.response.VoucherResponse;
import com.example.da_be.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VoucherServiceImpl implements VoucherService {
    @Autowired
    VoucherRepository voucherRepository;

    @Autowired
    KhachHangRepository khachHangRepository;

    @Autowired
    private KhachHang_VoucherRepository khachHang_VoucherRepository;
    @Autowired
    private EmailSender emailSender;

    @Override
    public List<VoucherResponse> getAllVoucher() {
        return voucherRepository.getAllVoucher();
    }

    @Override
    public List<KhachHangResponse> getAllKhachHang() {
        return voucherRepository.getAllKhachHang();
    }

    @Override
    public VoucherResponse getVoucherById(Integer id) {
        return voucherRepository.getVoucherById(id);
    }

    @Override
    public Voucher addVoucher(VoucherRequest voucherRequest) {
        try {
            Voucher voucher = voucherRequest.newVoucher(new Voucher());
            voucherRepository.save(voucher);
            List<KhachHang_Voucher> khachHangVoucherList = new ArrayList<>();
            if (voucherRequest.getKieu() == 0) {
                return voucher;
            } else {
                for (Integer idKhachHang : voucherRequest.getListIdCustomer()) {
                    TaiKhoan khachHang = khachHangRepository.findById(idKhachHang).get();
                    KhachHang_VoucherRequest khachHang_voucherRequest = new KhachHang_VoucherRequest();
                    khachHang_voucherRequest.setVoucher(voucher);
                    khachHang_voucherRequest.setTaiKhoan(khachHang);
                    KhachHang_Voucher khachHang_voucher = khachHang_voucherRequest.newKhachHang_Voucher(new KhachHang_Voucher());
                    khachHangVoucherList.add(khachHang_voucher);
                    khachHang_VoucherRepository.save(khachHang_voucher);

                    String valueText = voucher.getKieuGiaTri() == 0 ? (voucher.getGiaTri() + "%") : (voucher.getGiaTri() + "(VNĐ)");
                    String[] toMail = {khachHang.getEmail()};
                    Email email = new Email();
                    email.setBody("<!DOCTYPE html>\n" +
                            "<html>\n" +
                            "  <head>\n" +
                            "    <style>\n" +
                            "      body {\n" +
                            "        font-family: Arial, sans-serif;\n" +
                            "        background-color: #f5f5f5;\n" +
                            "      }\n" +
                            "\n" +
                            "      .container {\n" +
                            "        background-color: #fff;\n" +
                            "        max-width: 600px;\n" +
                            "        margin: 0 auto;\n" +
                            "        padding: 20px;\n" +
                            "        border: 1px solid #ccc;\n" +
                            "        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                            "      }\n" +
                            "\n" +
                            "      h1 {\n" +
                            "        color: #333;\n" +
                            "        text-align: center;\n" +
                            "      }\n" +
                            "\n" +
                            "      .voucher {\n" +
                            "        background-image: url(\"https://shorturl.at/uBKU6\");\n" +
                            "        background-size: auto;\n" +
                            "        background-repeat: no-repeat;\n" +
                            "        background-position: center center;\n" +
                            "        color: #fff;\n" +
                            "        text-align: center;\n" +
                            "        padding: 20px;\n" +
                            "        margin: 20px 0;\n" +
                            "        border-radius: 5px;\n" +
                            "        display: flex;\n" +
                            "      }\n" +
                            "\n" +
                            "      .voucher p {\n" +
                            "        font-size: 18px;\n" +
                            "        font-weight: bold;\n" +
                            "        color: #333;\n" +
                            "        flex: 2;\n" +
                            "      }\n" +
                            "\n" +
                            "      button {\n" +
                            "        background-color: #333;\n" +
                            "        color: #fff;\n" +
                            "        padding: 10px 20px;\n" +
                            "        border: none;\n" +
                            "        border-radius: 5px;\n" +
                            "        font-size: 16px;\n" +
                            "        cursor: pointer;\n" +
                            "      }\n" +
                            "\n" +
                            "      button:hover {\n" +
                            "        background-color: #555;\n" +
                            "      }\n" +
                            "    </style>\n" +
                            "  </head>\n" +
                            "  <body>\n" +
                            "    <div class=\"container\">\n" +
                            "      <h1>Thông Báo Phiếu Giảm Giá</h1>\n" +
                            "      <p>Xin chào quý khách hàng thân yêu,</p>\n" +
                            "      <p>\n" +
                            "        Chúng tôi vô cùng vui mừng thông báo rằng bạn có một phiếu giảm giá đặc biệt.\n" +
                            "      </p>\n" +
                            "      <div class=\"voucher\">\n" +
                            "        <p>Giảm " + valueText + "</p>\n" +
                            "        <p>Có hiệu lực từ: " + voucher.getNgayBatDau().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "</p>\n" +
                            "      </div>\n" +
                            "\n" +
                            "      <p>\n" +
                            "        Hãy sử dụng phiếu giảm giá này khi bạn mua sắm trên trang web của chúng tôi\n" +
                            "        để nhận được ưu đãi đặc biệt.\n" +
                            "      </p>\n" +
                            "       <a href='http://localhost:3000/home'><button>Xem Chi Tiết</button></a>" +
                            "      <p>Cảm ơn bạn đã ủng hộ chúng tôi!</p>\n" +
                            "    </div>\n" +
                            "  </body>\n" +
                            "</html>\n");
                    email.setToEmail(toMail);
                    email.setSubject("BACKET WEBSITE BÁN VỢT CẦU LÔNG");
                    email.setTitleEmail("<b style=\"text-align: left;\">Bạn có một phiếu giảm giá: </b><span>" + voucher.getTen() + "</span>");
                    emailSender.sendEmail(email);
                }
                return voucher;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Voucher updateVoucher(Integer id, VoucherRequest voucherRequest) throws ParseException {
        Optional<Voucher> optionalVoucher = voucherRepository.findById(id);
        List<KhachHang_Voucher> customerVouchers = khachHang_VoucherRepository.getListKhachHangVoucherByIdVoucher(id);

        // Xóa tất cả các KhachHang_Voucher cũ
        for (KhachHang_Voucher customerVoucher : customerVouchers) {
            khachHang_VoucherRepository.deleteById(customerVoucher.getId());
        }

        if (optionalVoucher.isPresent()) {
            Voucher voucher = optionalVoucher.get();
            Voucher voucherUpdate = voucherRepository.save(voucherRequest.newVoucher(voucher));
            List<KhachHang_Voucher> customerVoucherList = new ArrayList<>();

            if (voucherRequest.getKieu() == 0) {
                return voucherUpdate;
            } else {
                List<Integer> listIdCustomer = voucherRequest.getListIdCustomer();
                if (listIdCustomer != null && !listIdCustomer.isEmpty()) {
                    for (Integer idCustomer : listIdCustomer) {
                        Optional<TaiKhoan> optionalCustomer = khachHangRepository.findById(idCustomer);
                        if (optionalCustomer.isPresent()) {
                            TaiKhoan customer = optionalCustomer.get();
                            KhachHang_VoucherRequest adCustomerVoucherRequest = new KhachHang_VoucherRequest();
                            adCustomerVoucherRequest.setVoucher(voucherUpdate);
                            adCustomerVoucherRequest.setTaiKhoan(customer);
                            KhachHang_Voucher customerVoucher = adCustomerVoucherRequest.newKhachHang_Voucher(new KhachHang_Voucher());
                            customerVoucherList.add(customerVoucher);
                        } else {
                            System.out.println("Không tìm thấy khách hàng với ID: " + idCustomer);
                        }
                    }
                } else {
                    System.out.println("Danh sách ID khách hàng (listIdCustomer) null hoặc rỗng.");
                }
            }

            khachHang_VoucherRepository.saveAll(customerVoucherList);

            // Thêm logic gửi email
            for (KhachHang_Voucher customerVoucher : customerVoucherList) {
                TaiKhoan khachHang = customerVoucher.getTaiKhoan();
                String valueText = voucherUpdate.getKieuGiaTri() == 0 ? (voucherUpdate.getGiaTri() + "%") : (voucherUpdate.getGiaTri() + "(VNĐ)");
                String[] toMail = {khachHang.getEmail()};
                Email email = new Email();
                email.setBody("<!DOCTYPE html>\n" +
                        "<html>\n" +
                        "  <head>\n" +
                        "    <style>\n" +
                        "      body {\n" +
                        "        font-family: Arial, sans-serif;\n" +
                        "        background-color: #f5f5f5;\n" +
                        "      }\n" +
                        "      .container {\n" +
                        "        background-color: #fff;\n" +
                        "        max-width: 600px;\n" +
                        "        margin: 0 auto;\n" +
                        "        padding: 20px;\n" +
                        "        border: 1px solid #ccc;\n" +
                        "        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                        "      }\n" +
                        "      h1 {\n" +
                        "        color: #333;\n" +
                        "        text-align: center;\n" +
                        "      }\n" +
                        "      .voucher {\n" +
                        "        background-image: url(\"https://shorturl.at/uBKU6\");\n" +
                        "        background-size: auto;\n" +
                        "        background-repeat: no-repeat;\n" +
                        "        background-position: center center;\n" +
                        "        color: #fff;\n" +
                        "        text-align: center;\n" +
                        "        padding: 20px;\n" +
                        "        margin: 20px 0;\n" +
                        "        border-radius: 5px;\n" +
                        "        display: flex;\n" +
                        "      }\n" +
                        "      .voucher p {\n" +
                        "        font-size: 18px;\n" +
                        "        font-weight: bold;\n" +
                        "        color: #333;\n" +
                        "        flex: 2;\n" +
                        "      }\n" +
                        "      button {\n" +
                        "        background-color: #333;\n" +
                        "        color: #fff;\n" +
                        "        padding: 10px 20px;\n" +
                        "        border: none;\n" +
                        "        border-radius: 5px;\n" +
                        "        font-size: 16px;\n" +
                        "        cursor: pointer;\n" +
                        "      }\n" +
                        "      button:hover {\n" +
                        "        background-color: #555;\n" +
                        "      }\n" +
                        "    </style>\n" +
                        "  </head>\n" +
                        "  <body>\n" +
                        "    <div class=\"container\">\n" +
                        "      <h1>Thông Báo Phiếu Giảm Giá</h1>\n" +
                        "      <p>Xin chào quý khách hàng thân yêu,</p>\n" +
                        "      <p>\n" +
                        "        Chúng tôi vô cùng vui mừng thông báo rằng bạn có một phiếu giảm giá đặc biệt.\n" +
                        "      </p>\n" +
                        "      <div class=\"voucher\">\n" +
                        "        <p>Giảm " + valueText + "</p>\n" +
                        "        <p>Có hiệu lực từ: " + voucherUpdate.getNgayBatDau().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "</p>\n" +
                        "      </div>\n" +
                        "      <p>\n" +
                        "        Hãy sử dụng phiếu giảm giá này khi bạn mua sắm trên trang web của chúng tôi\n" +
                        "        để nhận được ưu đãi đặc biệt.\n" +
                        "      </p>\n" +
                        "       <a href='http://localhost:3000/home'><button>Xem Chi Tiết</button></a>" +
                        "      <p>Cảm ơn bạn đã ủng hộ chúng tôi!</p>\n" +
                        "    </div>\n" +
                        "  </body>\n" +
                        "</html>\n");
                email.setToEmail(toMail);
                email.setSubject("BACKET WEBSITE BÁN VỢT CẦU LÔNG");
                email.setTitleEmail("<b style=\"text-align: left;\">Bạn có một phiếu giảm giá: </b><span>" + voucherUpdate.getTen() + "</span>");
                emailSender.sendEmail(email);
            }
            return voucherUpdate;
        } else {
            System.out.println("Không tìm thấy voucher với ID: " + id);
            return null;
        }
    }


    @Override
    public Boolean deleteVoucher(Integer id) {
        LocalDateTime currentDateTime = LocalDateTime.now();  // Lấy thời gian hiện tại với ngày và giờ

        Optional<Voucher> optionalVoucher = voucherRepository.findById(id);  // Tìm voucher theo id kiểu Integer

        if (optionalVoucher.isPresent()) {
            Voucher voucher = optionalVoucher.get();
            voucher.setNgayKetThuc(currentDateTime);  // Cập nhật ngày kết thúc của voucher với ngày và giờ hiện tại
            voucher.setTrangThai(2);  // Đặt trạng thái voucher là "đã xóa"
            voucherRepository.save(voucher);  // Lưu voucher đã thay đổi
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Page<VoucherResponse> phanTrangVoucher(Pageable pageable) {
        return voucherRepository.phanTrangVoucher(pageable);
    }

    @Override
    public Page<VoucherResponse> getSearchVoucher(VoucherSearch voucherSearch, Pageable pageable) {
        return voucherRepository.getSearchVoucher(voucherSearch, pageable);
    }

    @Override
    public Page<KhachHangResponse> getSearchKhachHang(KhachHangSearch khachHangSearch, Pageable pageable) {
        return khachHangRepository.getSearchKhachHang(khachHangSearch, pageable);
    }

    @Override
    public List<String> getAllMaVoucher() {
        return voucherRepository.getAllMaVoucher();
    }

    @Override
    public List<String> getAllTenVoucher() {
        return voucherRepository.getAllTenVoucher();
    }

    @Override
    @Transactional
    public Voucher giamSoLuongVoucher(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher"));

        // Kiểm tra số lượng voucher
        if (voucher.getSoLuong() <= 0) {
            throw new RuntimeException("Voucher đã hết");
        }

        // Giảm số lượng voucher
        voucher.setSoLuong(voucher.getSoLuong() - 1);
        return voucherRepository.save(voucher);

    }

    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void updateTrangThaiVoucher() {
        boolean flag = false;
        LocalDateTime now = LocalDateTime.now(); // Lấy thời gian hiện tại

        List<Voucher> voucherList = voucherRepository.getAllVoucherWrong(now);

        for (Voucher voucher : voucherList) {
            LocalDateTime ngayBatDau = voucher.getNgayBatDau();
            LocalDateTime ngayKetThuc = voucher.getNgayKetThuc();

            if (ngayBatDau.isAfter(now) && voucher.getTrangThai() != 0) {
                voucher.setTrangThai(0);
                flag = true;
            } else if (ngayKetThuc.isBefore(now) && voucher.getTrangThai() != 2) {
                voucher.setTrangThai(2);
                flag = true;
            } else if (ngayBatDau.isBefore(now) && ngayKetThuc.isAfter(now) && voucher.getTrangThai() != 1) {
                voucher.setTrangThai(1);
                flag = true;
            }
        }
    }
}
