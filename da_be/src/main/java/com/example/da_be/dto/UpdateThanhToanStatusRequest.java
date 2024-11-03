package com.example.da_be.dto;

public class UpdateThanhToanStatusRequest {
    private Long thanhToanId;
    private int status;

    public Long getThanhToanId() {
        return thanhToanId;
    }

    public void setThanhToanId(Long thanhToanId) {
        this.thanhToanId = thanhToanId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}