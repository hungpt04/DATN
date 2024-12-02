package com.example.da_be.dto;

public class UpdateHoaDonCTStatusRequest {
    private Integer hoaDonCTId;
    private int status;

    public Integer getHoaDonCTId() {
        return hoaDonCTId;
    }

    public void setHoaDonCTId(Integer hoaDonCTId) {
        this.hoaDonCTId = hoaDonCTId;
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