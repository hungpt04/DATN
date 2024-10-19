package com.example.da_be.dto;


import com.example.da_be.entity.HoaDonCT;

public class HoaDonCTWithImageDTO {
    private HoaDonCT hoaDonCT; // Hoặc chỉ các trường cụ thể nếu bạn không muốn toàn bộ thực thể
    private String link;

    // Constructor
    public HoaDonCTWithImageDTO(HoaDonCT hoaDonCT, String link) {
        this.hoaDonCT = hoaDonCT;
        this.link = link;
    }

    // Getter và Setter cho các trường (nếu cần)
    public HoaDonCT getHoaDonCT() {
        return hoaDonCT;
    }

    public void setHoaDonCT(HoaDonCT hoaDonCT) {
        this.hoaDonCT = hoaDonCT;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}

