package com.example.da_be.controller;

import com.example.da_be.email.Email;
import com.example.da_be.email.EmailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // Đánh dấu đây là một REST Controller
@RequestMapping("/api/email") // Đường dẫn gốc cho tất cả các endpoint trong controller này
public class EmailController {
    @Autowired
    private EmailSender emailService;

    // Endpoint gửi email HTML
    @GetMapping("/test-send")
    public ResponseEntity<String> testSendEmail() {
        try {
            // Tạo email test
            Email testEmail = new Email();
            testEmail.setToEmail(new String[]{"hoanghvph43103@fpt.edu.vn"});
            testEmail.setSubject("Test Email");
            testEmail.setTitleEmail("Welcome");
            testEmail.setBody("This is a test email body");

            // Gọi phương thức gửi email
            emailService.sendEmail(testEmail);

            return ResponseEntity.ok("Test email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send test email: " + e.getMessage());
        }
    }
}
