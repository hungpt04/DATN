package com.example.da_be.service.impl;

import com.example.da_be.entity.KhachHang_Voucher;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.entity.Voucher;
import com.example.da_be.repository.KhachHangRepository;
import com.example.da_be.repository.KhachHang_VoucherRepository;
import com.example.da_be.repository.VoucherRepository;
import com.example.da_be.request.KhachHang_VoucherRequest;
import com.example.da_be.request.VoucherRequest;
import com.example.da_be.request.VoucherSearch;
import com.example.da_be.response.KhachHangResponse;
import com.example.da_be.response.VoucherResponse;
import com.example.da_be.service.VoucherService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.LocalDate;
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
        // Lấy thông tin voucher theo ID
        Optional<Voucher> optionalVoucher = voucherRepository.findById(id);
        // Lấy danh sách KhachHang_Voucher liên quan đến voucher
        List<KhachHang_Voucher> customerVouchers = khachHang_VoucherRepository.getListKhachHangVoucherByIdVoucher(id);

        // Xóa tất cả các KhachHang_Voucher cũ
        for (KhachHang_Voucher customerVoucher : customerVouchers) {
            khachHang_VoucherRepository.deleteById(customerVoucher.getId());
        }

        if (optionalVoucher.isPresent()) {
            // Lấy voucher cần cập nhật
            Voucher voucher = optionalVoucher.get();
            // Cập nhật thông tin voucher
            Voucher voucherUpdate = voucherRepository.save(voucherRequest.newVoucher(voucher));
            List<KhachHang_Voucher> customerVoucherList = new ArrayList<>();

            // Kiểm tra kiểu voucher
            if (voucherRequest.getKieu() == 0) {
                return voucherUpdate; // Không cần xử lý thêm nếu kiểu là 0
            } else {
                // Lấy danh sách ID khách hàng từ yêu cầu
                List<Integer> listIdCustomer = voucherRequest.getListIdCustomer();
                if (listIdCustomer != null && !listIdCustomer.isEmpty()) {
                    for (Integer idCustomer : listIdCustomer) {
                        // Kiểm tra và lấy thông tin tài khoản khách hàng theo ID
                        Optional<TaiKhoan> optionalCustomer = khachHangRepository.findById(idCustomer);
                        if (optionalCustomer.isPresent()) {
                            TaiKhoan customer = optionalCustomer.get();
                            // Tạo mới đối tượng KhachHang_Voucher từ thông tin yêu cầu
                            KhachHang_VoucherRequest adCustomerVoucherRequest = new KhachHang_VoucherRequest();
                            adCustomerVoucherRequest.setVoucher(voucherUpdate);
                            adCustomerVoucherRequest.setTaiKhoan(customer);
                            KhachHang_Voucher customerVoucher = adCustomerVoucherRequest.newKhachHang_Voucher(new KhachHang_Voucher());
                            customerVoucherList.add(customerVoucher);
                        } else {
                            // Xử lý nếu không tìm thấy khách hàng
                            System.out.println("Không tìm thấy khách hàng với ID: " + idCustomer);
                        }
                    }
                } else {
                    // Xử lý khi danh sách ID khách hàng bị null hoặc rỗng
                    System.out.println("Danh sách ID khách hàng (listIdCustomer) null hoặc rỗng.");
                }
            }

            // Lưu danh sách KhachHang_Voucher mới vào cơ sở dữ liệu
            khachHang_VoucherRepository.saveAll(customerVoucherList);
            return voucherUpdate;
        } else {
            // Trả về null nếu không tìm thấy voucher
            System.out.println("Không tìm thấy voucher với ID: " + id);
            return null;
        }
    }

    @Override
    public Boolean deleteVoucher(Integer id) {
        LocalDate currentDate = LocalDate.now();  // Lấy ngày hiện tại
        Optional<Voucher> optionalVoucher = voucherRepository.findById(id);  // Tìm voucher theo id kiểu Integer
        if (optionalVoucher.isPresent()) {
            Voucher voucher = optionalVoucher.get();
            voucher.setNgayKetThuc(currentDate);  // Cập nhật ngày kết thúc của voucher
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
}
