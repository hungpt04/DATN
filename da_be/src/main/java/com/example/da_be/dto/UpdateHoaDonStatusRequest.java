package com.example.da_be.dto;

public class UpdateHoaDonStatusRequest {
    private Long hoaDonId;
    private int status;

    // Getter cho hoaDonId
    public Long getHoaDonId() {
        return hoaDonId;
    }

    // Setter cho hoaDonId
    public void setHoaDonId(Long hoaDonId) {
        this.hoaDonId = hoaDonId;
    }

    // Getter cho status
    public int getStatus() {
        return status;
    }

    // Setter cho status
    public void setStatus(int status) {
        this.status = status;
    }
}