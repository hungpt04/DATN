DROP DATABASE POLYBADMINTON
CREATE DATABASE POLYBADMINTON

USE POLYBADMINTON;
GO


CREATE TABLE ThuongHieu(
	Id INT IDENTITY(1,1) PRIMARY KEY,
    Ten NVARCHAR(255),
    TrangThai NVARCHAR(255)
);

CREATE TABLE QuanCan(
	Id INT IDENTITY(1,1) PRIMARY KEY,
    Ten NVARCHAR(255),
    TrangThai NVARCHAR(255)
);

CREATE TABLE Cuoc(
	Id INT IDENTITY(1,1) PRIMARY KEY,
    Ten NVARCHAR(255),
    TrangThai NVARCHAR(255)
);

CREATE TABLE TrongLuong(
	Id INT IDENTITY(1,1) PRIMARY KEY,
    Ten NVARCHAR(255),
    TrangThai NVARCHAR(255)
);

CREATE TABLE DiemCanBang(
	Id INT IDENTITY(1,1) PRIMARY KEY,
    Ten NVARCHAR(255),
    TrangThai NVARCHAR(255)
);

CREATE TABLE KhuyenMai(
	Id INT IDENTITY(1,1) PRIMARY KEY,
    Ten NVARCHAR(255),
	TG_BatDau DATETIME,
	TG_KetThuc DATETIME,
    TrangThai NVARCHAR(255)
);

CREATE TABLE TaiKhoan(
	Id INT IDENTITY(1,1) PRIMARY KEY,
    Ma NVARCHAR(255),
    HoTen NVARCHAR(255),
	Sdt VARCHAR(255),
	Email NVARCHAR(255),
	MatKhau NVARCHAR(255),
	GioiTinh BIT,
	VaiTro NVARCHAR(255),
	Avatar NVARCHAR(255),
    TrangThai NVARCHAR(255)
);

CREATE TABLE Voucher(
	Id INT IDENTITY(1,1) PRIMARY KEY,
    Ma NVARCHAR(255),
    Ten NVARCHAR(255),
	GiaTri INT,
	GiaTriMax INT,
	LoaiVoucher NVARCHAR(255),
	GiaTriVoucher INT,
	SoLuong INT,
	SoLuongToiThieu INT,
	NgayBatDau DATETIME,
	NgayKetThuc DATETIME,
    TrangThai NVARCHAR(255)
);

CREATE TABLE SanPham(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Ma NVARCHAR(255),
    Ten NVARCHAR(255),
	TrangThai NVARCHAR(255)
);

CREATE TABLE SanPhamCT(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdSanPham INT,
	IdThuongHieu INT,
	IdQuanCan INT,
	IdCuoc INT,
	IdTrongLuong INT,
	IdDiemCanBang INT,
	Ma NVARCHAR(255),
	SoLuong INT,
	DonGia DECIMAL(10,2),
	TrangThai NVARCHAR(255),
	FOREIGN KEY (IdSanPham) REFERENCES SanPham(Id),
	FOREIGN KEY (IdThuongHieu) REFERENCES ThuongHieu(Id),
	FOREIGN KEY (IdQuanCan) REFERENCES QuanCan(Id),
	FOREIGN KEY (IdCuoc) REFERENCES Cuoc(Id),
	FOREIGN KEY (IdTrongLuong) REFERENCES TrongLuong(Id),
	FOREIGN KEY (IdDiemCanBang) REFERENCES DiemCanBang(Id)
);

CREATE TABLE HinhAnh(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdSanPhamCT INT,
	Link NVARCHAR(255),
	TrangThai NVARCHAR(255),
	FOREIGN KEY (IdSanPhamCT) REFERENCES SanPhamCT(Id)
);

CREATE TABLE DiaChi(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdTaiKhoan INT,
    Ten NVARCHAR(255),
	Sdt VARCHAR(255),
    IdTinh NVARCHAR(255),
    IdHuyen NVARCHAR(255),
    IdXa NVARCHAR(255),
    DiaChiCuThe NVARCHAR(255),
	FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan(Id)
);

CREATE TABLE ThongBao(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdKhachHang INT,
    TieuDe NVARCHAR(255),
    NoiDung NVARCHAR(255),
    IdRedirect NVARCHAR(255),
    KieuThongBao NVARCHAR(255),
	TrangThai NVARCHAR(255),
	FOREIGN KEY (IdKhachHang) REFERENCES TaiKhoan(Id)
);

CREATE TABLE GioHang(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdSanPhamCT INT,
	IdTaiKhoan INT,
    Ma NVARCHAR(255),
	SoLuong INT,
	TongTien DECIMAL(10,2),
    NgayTao DATETIME,
	NgaySua DATETIME,
	FOREIGN KEY (IdSanPhamCT) REFERENCES SanPhamCT(Id),
	FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan(Id)
);

CREATE TABLE HoaDon(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdTaiKhoan INT,
	IdVoucher INT,
	Ma NVARCHAR(255),
	SoLuong INT,
	LoaiHoaDon NVARCHAR(255),
	PhuongThucThanhToan NVARCHAR(255),
	TenNguoiNhan NVARCHAR(255),
	SdtNguoiNhan NVARCHAR(255),
	EmailNguoiNhan NVARCHAR(255),
	DiaChiNguoiNhan NVARCHAR(255),
	PhiShip DECIMAL(10,2),
	TongTien DECIMAL(10,2),
	NgayTao DATETIME,
	NgaySua DATETIME,
	TrangThai NVARCHAR(255),
	FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan(Id),
	FOREIGN KEY (IdVoucher) REFERENCES Voucher(Id)
);

CREATE TABLE HoaDonCT(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdSanPhamCT INT,
	IdHoaDon INT,
    Ma NVARCHAR(255),
	SoLuong INT,
	GiaBan DECIMAL(10,2),
	TrangThai NVARCHAR(255),
	FOREIGN KEY (IdSanPhamCT) REFERENCES SanPhamCT(Id),
	FOREIGN KEY (IdHoaDon) REFERENCES HoaDon(Id)
);

CREATE TABLE SanPham_KhuyenMai(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdSanPhamCT INT,
	IdKhuyenMai INT,
	GiaKhuyenMai INT,
	FOREIGN KEY (IdSanPhamCT) REFERENCES SanPhamCT(Id),
	FOREIGN KEY (IdKhuyenMai) REFERENCES KhuyenMai(Id)
);

CREATE TABLE ThanhToan(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdTaiKhoan INT,
	IdHoaDon INT,
    Ma NVARCHAR(255),
	TongTien DECIMAL(10,2),
	PhuongThucThanhToan NVARCHAR(255),
	TrangThai NVARCHAR(255),
	FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan(Id),
	FOREIGN KEY (IdHoaDon) REFERENCES HoaDon(Id)
);

CREATE TABLE KhachHang_Voucher(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdKhachHang INT,
	IdVoucher INT,
	FOREIGN KEY (IdKhachHang) REFERENCES TaiKhoan(Id),
	FOREIGN KEY (IdVoucher) REFERENCES Voucher(Id)
);

CREATE TABLE LichSuDonHang(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdTaiKhoan INT,
	IdHoaDon INT,
    MoTa NVARCHAR(255),
	NgayTao DATETIME,
	NgaySua DATETIME,
	TrangThai NVARCHAR(255),
	FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan(Id),
	FOREIGN KEY (IdHoaDon) REFERENCES HoaDon(Id)
);



INSERT INTO ThuongHieu (Ten, TrangThai) VALUES
('Yonex', 'Active'),
('Lining', 'Active'),
('Victor', 'Inactive'),
('Kumpoo', 'Active'),
('Adidas', 'Inactive');


INSERT INTO QuanCan (Ten, TrangThai) VALUES
('Yonex AC102EX', 'Active'),
('Bumbee AS007', 'Active'),
('HBT', 'Active'),
('Kumpoo K003', 'Inactive'),
('Kamito KMC2041', 'Inactive');


INSERT INTO Cuoc (Ten, TrangThai) VALUES
('Yonex BG65 Titanium', 'Active'),
('Victor VBS66', 'Active'),
('Lining NO1', 'Active'),
('kizuna Z69T', 'Inactive'),
('Yonex BG66 Ultimax', 'Inactive');


INSERT INTO TrongLuong (Ten, TrangThai) VALUES
('2U', 'Active'),
('3U', 'Active'),
('4U', 'Active'),
('5U', 'Inactive'),
('6U', 'Inactive');


INSERT INTO DiemCanBang (Ten, TrangThai) VALUES
('290mm', 'Active'),
('295mm', 'Active'),
('300mm', 'Active'),
('305mm', 'Inactive'),
('310mm', 'Inactive');


INSERT INTO KhuyenMai (Ten, TG_BatDau, TG_KetThuc, TrangThai) VALUES
('Khuyen mai 10%', '2024-01-01', '2024-01-10', 'Active'),
('Khuyen mai 20%', '2024-02-01', '2024-02-15', 'Active'),
('Khuyen mai 30%', '2024-03-01', '2024-03-10', 'Active'),
('Khuyen mai 40%', '2024-04-01', '2024-04-05', 'Inactive'),
('Khuyen mai 50%', '2024-05-01', '2024-05-07', 'Inactive');



INSERT INTO TaiKhoan (Ma, HoTen, Sdt, Email, MatKhau, GioiTinh, VaiTro, Avatar, TrangThai) VALUES
('TK001', 'Nguyen Van A', '0123456789', 'a@example.com', 'password123', 1, 'Customer', 'avatar1.png', 'Active'),
('TK002', 'Tran Thi B', '0987654321', 'b@example.com', 'password123', 0, 'Admin', 'avatar2.png', 'Active'),
('TK003', 'Le Van C', '0912345678', 'c@example.com', 'password123', 1, 'Customer', 'avatar3.png', 'Inactive'),
('TK004', 'Pham Thi D', '0908765432', 'd@example.com', 'password123', 0, 'Customer', 'avatar4.png', 'Active'),
('TK005', 'Hoang Van E', '0897654321', 'e@example.com', 'password123', 1, 'Customer', 'avatar5.png', 'Inactive');



INSERT INTO Voucher (Ma, Ten, GiaTri, GiaTriMax, LoaiVoucher, GiaTriVoucher, SoLuong, SoLuongToiThieu, NgayBatDau, NgayKetThuc, TrangThai) VALUES
('V001', 'Voucher 10%', 10, 100000, 'Percent', 10, 50, 1, '2024-01-01', '2024-01-10', 'Active'),
('V002', 'Voucher 20%', 20, 200000, 'Percent', 20, 100, 1, '2024-02-01', '2024-02-15', 'Active'),
('V003', 'Voucher 50k', 50000, 50000, 'Fixed', 50000, 200, 1, '2024-03-01', '2024-03-10', 'Inactive'),
('V004', 'Voucher 100k', 100000, 100000, 'Fixed', 100000, 300, 1, '2024-04-01', '2024-04-05', 'Inactive'),
('V005', 'Voucher 5%', 5, 50000, 'Percent', 5, 150, 1, '2024-05-01', '2024-05-07', 'Active');



INSERT INTO SanPham (Ma, Ten, TrangThai) VALUES
('SP001', 'Yonex Astrox 100zz', 'Active'),
('SP002', 'Lining Halbertec 9000', 'Active'),
('SP003', 'Victor Ryuga D', 'Active'),
('SP004', 'Yonex Nanoflare 1000z', 'Inactive'),
('SP005', 'lining Axforce 100', 'Inactive');


INSERT INTO SanPhamCT (IdSanPham, IdThuongHieu, IdQuanCan, IdCuoc, IdTrongLuong, IdDiemCanBang, Ma, SoLuong, DonGia, TrangThai) VALUES
(1, 1, 1, 1, 1, 1, 'SPCT001', 10, 3000000, 'Active'),
(2, 2, 2, 2, 2, 2, 'SPCT002', 20, 2500000, 'Active'),
(3, 3, 3, 3, 3, 3, 'SPCT003', 15, 2800000, 'Inactive'),
(4, 4, 4, 4, 4, 4, 'SPCT004', 5, 2700000, 'Inactive'),
(5, 5, 5, 5, 5, 5, 'SPCT005', 8, 2200000, 'Active');


INSERT INTO HinhAnh (IdSanPhamCT, Link, TrangThai) VALUES
(1, 'yonex_voltric80.png', 'Active'),
(2, 'lining_turbo_x.png', 'Active'),
(3, 'victor_thruster_k.png', 'Active'),
(4, 'adidas_p800.png', 'Inactive'),
(5, 'apacs_ziggler.png', 'Active');


INSERT INTO DiaChi (IdTaiKhoan, Ten, Sdt, IdTinh, IdHuyen, IdXa, DiaChiCuThe) VALUES
(1, 'Nguyen Van A', '0123456789', 'Hanoi', 'Dong Da', 'Khuong Thuong', 'So 10, Pho ABC'),
(2, 'Tran Thi B', '0987654321', 'Ho Chi Minh', 'District 1', 'Ben Nghe', '123 Nguyen Hue'),
(3, 'Le Van C', '0912345678', 'Da Nang', 'Hai Chau', 'Thach Thang', '45 Bach Dang'),
(4, 'Pham Thi D', '0908765432', 'Can Tho', 'Ninh Kieu', 'An Hoa', '67 Hung Vuong'),
(5, 'Hoang Van E', '0897654321', 'Hai Phong', 'Le Chan', 'Niem Nghia', '21 Tran Phu');


INSERT INTO ThongBao (IdKhachHang, TieuDe, NoiDung, IdRedirect, KieuThongBao, TrangThai) VALUES
(1, 'Khuyến mãi 10%', 'Bạn nhận được khuyến mãi 10% từ hệ thống', 'SP001', 'Promotion', 'Active'),
(2, 'Thông báo đơn hàng', 'Đơn hàng của bạn đã được giao', 'HD001', 'Order', 'Active'),
(3, 'Thông báo hệ thống', 'Hệ thống sẽ bảo trì trong 2 giờ', 'System', 'System', 'Inactive'),
(4, 'Khuyến mãi 20%', 'Bạn nhận được khuyến mãi 20% từ hệ thống', 'SP002', 'Promotion', 'Active'),
(5, 'Thông báo giao hàng', 'Đơn hàng của bạn đang được giao', 'HD002', 'Order', 'Inactive');



INSERT INTO GioHang (IdSanPhamCT, IdTaiKhoan, Ma, SoLuong, TongTien, NgayTao, NgaySua) VALUES
(1, 1, 'GH001', 2, 6000000, '2024-09-01', '2024-09-02'),
(2, 2, 'GH002', 1, 2500000, '2024-09-03', '2024-09-04'),
(3, 3, 'GH003', 3, 8400000, '2024-09-05', '2024-09-06'),
(4, 4, 'GH004', 1, 2700000, '2024-09-07', '2024-09-08'),
(5, 5, 'GH005', 2, 4400000, '2024-09-09', '2024-09-10');




INSERT INTO HoaDon (IdTaiKhoan, Ma, DiaChiNguoiNhan, SdtNguoiNhan, PhiShip, TongTien, TrangThai) VALUES
(1, 'HD001', 'So 10, Pho ABC, Hanoi', '0123456789', 30000, 6030000, 'Delivered'),
(2, 'HD002', '123 Nguyen Hue, Ho Chi Minh', '0987654321', 50000, 2550000, 'Shipping'),
(3, 'HD003', '45 Bach Dang, Da Nang', '0912345678', 40000, 8440000, 'Cancelled'),
(4, 'HD004', '67 Hung Vuong, Can Tho', '0908765432', 20000, 2720000, 'Delivered'),
(5, 'HD005', '21 Tran Phu, Hai Phong', '0897654321', 30000, 4430000, 'Pending');




INSERT INTO HoaDonCT (IdSanPhamCT, IdHoaDon, Ma, SoLuong, GiaBan, TrangThai) VALUES
(1, 1, 'HDCT001', 2, 3000000, 'Delivered'),
(2, 2, 'HDCT002', 1, 2500000, 'Shipping'),
(3, 3, 'HDCT003', 3, 2800000, 'Cancelled'),
(4, 4, 'HDCT004', 1, 2700000, 'Delivered'),
(5, 5, 'HDCT005', 2, 2200000, 'Pending');



INSERT INTO SanPham_KhuyenMai (IdSanPhamCT, IdKhuyenMai, GiaKhuyenMai) VALUES
(1, 1, 2700000),
(2, 2, 2000000),
(3, 3, 2500000),
(4, 4, 2300000),
(5, 5, 1800000);



INSERT INTO ThanhToan (IdTaiKhoan, IdHoaDon, Ma, TongTien, PhuongThucThanhToan, TrangThai) VALUES
(1, 1, 'TT001', 6030000, 'Credit Card', 'Paid'),
(2, 2, 'TT002', 2550000, 'Cash', 'Pending'),
(3, 3, 'TT003', 8440000, 'Bank Transfer', 'Cancelled'),
(4, 4, 'TT004', 2720000, 'Credit Card', 'Paid'),
(5, 5, 'TT005', 4430000, 'Cash', 'Pending');



INSERT INTO KhachHang_Voucher (IdKhachHang, IdVoucher) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);



INSERT INTO LichSuDonHang (IdTaiKhoan, IdHoaDon, MoTa, NgayTao, NgaySua, TrangThai) VALUES
(1, 1, 'Đơn hàng đã được giao', '2024-09-01', '2024-09-02', 'Delivered'),
(2, 2, 'Đơn hàng đang trong quá trình vận chuyển', '2024-09-03', '2024-09-04', 'Shipping'),
(3, 3, 'Đơn hàng đã bị hủy', '2024-09-05', '2024-09-06', 'Cancelled'),
(4, 4, 'Đơn hàng đã được giao', '2024-09-07', '2024-09-08', 'Delivered'),
(5, 5, 'Đơn hàng đang chờ xử lý', '2024-09-09', '2024-09-10', 'Pending');






