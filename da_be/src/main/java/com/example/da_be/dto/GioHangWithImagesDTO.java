package com.example.da_be.dto;

import com.example.da_be.entity.GioHang;

public class GioHangWithImagesDTO {
    private GioHang gioHang;
    private String link;

    public GioHangWithImagesDTO(GioHang gioHang, String link) {
        this.gioHang = gioHang;
        this.link = link;
    }

    public GioHang getGioHang() {
        return gioHang;
    }

    public void setGioHang(GioHang gioHang) {
        this.gioHang = gioHang;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
