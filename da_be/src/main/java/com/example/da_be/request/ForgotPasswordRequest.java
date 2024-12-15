package com.example.da_be.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {
    private String email;
    private String otp;
    private String matKhauMoi;
    private String xacNhanMkMoi;
}
