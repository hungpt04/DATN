package com.example.da_be.dto;


import java.util.List;

public class SanPhamCTWithImagesDTO {
    private Integer id;
    private String ten;
    private String ma;
    private int soLuong;
    private double donGia;

    private String sanPhamTen;
    private String sanPhamMa;

    private String thuongHieuTen;

    private String mauSacTen;

    private String chatLieuTen;

    private String trongLuongTen;

    private String diemCanBangTen;

    private Integer trangThai;

    private List<String> hinhAnhUrls;

    // Constructors
    public SanPhamCTWithImagesDTO() {
    }

    public SanPhamCTWithImagesDTO(Integer id, String ten, String ma, int soLuong, double donGia, String sanPhamTen, String sanPhamMa, String thuongHieuTen, String mauSacTen, String chatLieuTen, String trongLuongTen, String diemCanBangTen, Integer trangThai, List<String> hinhAnhUrls) {
        this.id = id;
        this.ten = ten;
        this.ma = ma;
        this.soLuong = soLuong;
        this.donGia = donGia;
        this.sanPhamTen = sanPhamTen;
        this.sanPhamMa = sanPhamMa;
        this.thuongHieuTen = thuongHieuTen;
        this.mauSacTen = mauSacTen;
        this.chatLieuTen = chatLieuTen;
        this.trongLuongTen = trongLuongTen;
        this.diemCanBangTen = diemCanBangTen;
        this.trangThai = trangThai;
        this.hinhAnhUrls = hinhAnhUrls;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public String getMa() {
        return ma;
    }

    public void setMa(String ma) {
        this.ma = ma;
    }

    public int getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(int soLuong) {
        this.soLuong = soLuong;
    }

    public double getDonGia() {
        return donGia;
    }

    public void setDonGia(double donGia) {
        this.donGia = donGia;
    }

    public String getSanPhamTen() {
        return sanPhamTen;
    }

    public void setSanPhamTen(String sanPhamTen) {
        this.sanPhamTen = sanPhamTen;
    }

    public String getSanPhamMa() {
        return sanPhamMa;
    }

    public void setSanPhamMa(String sanPhamMa) {
        this.sanPhamMa = sanPhamMa;
    }

    public String getThuongHieuTen() {
        return thuongHieuTen;
    }

    public void setThuongHieuTen(String thuongHieuTen) {
        this.thuongHieuTen = thuongHieuTen;
    }

    public String getMauSacTen() {
        return mauSacTen;
    }

    public void setMauSacTen(String mauSacTen) {
        this.mauSacTen = mauSacTen;
    }

    public String getChatLieuTen() {
        return chatLieuTen;
    }

    public void setChatLieuTen(String chatLieuTen) {
        this.chatLieuTen = chatLieuTen;
    }

    public String getTrongLuongTen() {
        return trongLuongTen;
    }

    public void setTrongLuongTen(String trongLuongTen) {
        this.trongLuongTen = trongLuongTen;
    }

    public String getDiemCanBangTen() {
        return diemCanBangTen;
    }

    public void setDiemCanBangTen(String diemCanBangTen) {
        this.diemCanBangTen = diemCanBangTen;
    }

    public Integer getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }

    public List<String> getHinhAnhUrls() {
        return hinhAnhUrls;
    }

    public void setHinhAnhUrls(List<String> hinhAnhUrls) {
        this.hinhAnhUrls = hinhAnhUrls;
    }
}
