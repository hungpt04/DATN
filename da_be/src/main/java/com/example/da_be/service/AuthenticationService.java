package com.example.da_be.service;

import com.example.da_be.config.JwtTokenProvider;
import com.example.da_be.email.Email;
import com.example.da_be.email.EmailSender;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.enums.Roles;
import com.example.da_be.repository.TaiKhoanRepository;
import com.example.da_be.request.ForgotPasswordRequest;
import com.example.da_be.request.SignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class AuthenticationService {
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    TaiKhoanService taiKhoanService;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    EmailSender emailSender;

    public TaiKhoan registerUser  (SignupRequest signupRequest) {
        // Kiểm tra xem email đã tồn tại chưa
        String email = signupRequest.getEmail().trim(); // Trim email
        Optional<TaiKhoan> existingTaiKhoan = checkMail(email);
        if (existingTaiKhoan.isPresent()) {
            throw new RuntimeException("Email đã tồn tại!"); // Ném ra lỗi nếu email đã có trong hệ thống
        }

        // Tạo tài khoản mới
        TaiKhoan taiKhoan = new TaiKhoan();
        taiKhoan.setHoTen(signupRequest.getHoTen());
        taiKhoan.setEmail(email);

        // Mã hóa mật khẩu trước khi lưu
        taiKhoan.setMatKhau(passwordEncoder.encode(signupRequest.getMatKhau()));
        // Thiết lập vai trò mặc định là "Customer"
        taiKhoan.setVaiTro(Roles.CUSTOMER.name());
        taiKhoan.setTrangThai(1); // Hoặc trạng thái mặc định nào đó
        return taiKhoanRepository.save(taiKhoan);
    }

    public Optional<TaiKhoan> findTaiKhoanByEmail(String email) {
        return taiKhoanRepository.findByEmail(email);
    }


    public Optional<TaiKhoan> checkMail(String email) {
        Optional<TaiKhoan> taiKhoan = taiKhoanRepository.findByEmail(email);
        if (taiKhoan == null) {
            throw new RuntimeException("Email không tồn tại!");
        }
        return taiKhoan;
    }

    public boolean checkPassword(String email, String currentPass) {
        Optional<TaiKhoan> taiKhoanOptional = taiKhoanRepository.findByEmail(email);

        // Kiểm tra xem tài khoản có tồn tại không
        if (!taiKhoanOptional.isPresent()) {
            throw new RuntimeException("Tài khoản không tồn tại!");
        }

        // Lấy tài khoản từ Optional
        TaiKhoan taiKhoan = taiKhoanOptional.get();

        // So sánh mật khẩu hiện tại với mật khẩu đã mã hóa
        return passwordEncoder.matches(currentPass, taiKhoan.getMatKhau());
    }

    public String sendOTP(String email) {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            otp.append(random.nextInt(10));
        }

        String htmlBody = "<p>Xin chào,</p>"
                        + "<p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu tài khoản của bạn.</p>"
                        + "<p>Dưới đây là mã OTP của bạn:</p>"
                        + "<h2 style=\"color: #2e63cc;\">" + otp.toString() + "</h2>"
                        + "<p>Vui lòng sử dụng mã OTP này để đặt lại mật khẩu của bạn.</p>"
                        + "<p>Cảm ơn bạn!</p>";

        Email newEmail = new Email();
        String[] emailSend = {email};
        newEmail.setToEmail(emailSend);
        newEmail.setSubject("Quên mật khẩu");
        newEmail.setTitleEmail("");
        newEmail.setBody(htmlBody);
        emailSender.sendEmail(newEmail);

        return otp.toString();
    }

    public Boolean change(ForgotPasswordRequest request) {
        // Kiểm tra tài khoản qua email
        Optional<TaiKhoan> taiKhoanOpt = checkMail(request.getEmail());
        if (taiKhoanOpt.isEmpty()) {
            return false; // Không tìm thấy tài khoản
        }

        // Kiểm tra mật khẩu
        String rawPassword = request.getMatKhauMoi();
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống");
        }

        // Cập nhật mật khẩu và lưu tài khoản
        TaiKhoan taiKhoan = taiKhoanOpt.get();
        taiKhoan.setMatKhau(passwordEncoder.encode(rawPassword));
        taiKhoanRepository.save(taiKhoan);
        return true;
    }

}
