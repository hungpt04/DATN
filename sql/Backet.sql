	DROP DATABASE BACKET;
	CREATE DATABASE BACKET

	USE BACKET;
	GO


	CREATE TABLE ThuongHieu(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		Ten NVARCHAR(255),
		TrangThai INT
	);

	CREATE TABLE MauSac(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		Ten NVARCHAR(255),
		TrangThai INT
	);

	CREATE TABLE ChatLieu(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		Ten NVARCHAR(255),
		TrangThai INT
	);

	CREATE TABLE TrongLuong(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		Ten NVARCHAR(255),
		TrangThai INT
	);

	CREATE TABLE DiemCanBang(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		Ten NVARCHAR(255),
		TrangThai INT
	);

	CREATE TABLE DoCung(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		Ten NVARCHAR(255),
		TrangThai INT
	);

	CREATE TABLE KhuyenMai(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		Ten NVARCHAR(255),
		TG_BatDau DATETIME,
		TG_KetThuc DATETIME,
		GiaTri INT,
		Loai BIT,
		TrangThai INT
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
		Avatar NVARCHAR(MAX),
		NgaySinh DATE,
		CCCD VARCHAR(50),
		TrangThai INT
	);

	CREATE TABLE Voucher(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		Ma NVARCHAR(255),
		Ten NVARCHAR(255),
		GiaTri INT,
		GiaTriMax INT,
		DieuKienNhoNhat INT,
		Kieu INT,
		KieuGiaTri INT,
		SoLuong INT,
		NgayBatDau DATETIME,
		NgayKetThuc DATETIME,
		TrangThai INT
	);

	CREATE TABLE SanPham(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		Ma NVARCHAR(255),
		Ten NVARCHAR(255),
		TrangThai INT
	);

	CREATE TABLE SanPhamCT(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		IdSanPham INT,
		IdThuongHieu INT,
		IdMauSac INT,
		IdChatLieu INT,
		IdTrongLuong INT,
		IdDiemCanBang INT,
		IdDoCung INT,
		Ma NVARCHAR(255),
		SoLuong INT,
		DonGia DECIMAL(10,2),
		MoTa NVARCHAR(255),
		TrangThai INT,
		FOREIGN KEY (IdSanPham) REFERENCES SanPham(Id),
		FOREIGN KEY (IdThuongHieu) REFERENCES ThuongHieu(Id),
		FOREIGN KEY (IdMauSac) REFERENCES MauSac(Id),
		FOREIGN KEY (IdChatLieu) REFERENCES ChatLieu(Id),
		FOREIGN KEY (IdTrongLuong) REFERENCES TrongLuong(Id),
		FOREIGN KEY (IdDiemCanBang) REFERENCES DiemCanBang(Id)
	);

	CREATE TABLE HinhAnh(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		IdSanPhamCT INT,
		Link NVARCHAR(255),
		TrangThai INT,
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
		Loai BIT,
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
		TrangThai INT,
		FOREIGN KEY (IdKhachHang) REFERENCES TaiKhoan(Id)
	);

	CREATE TABLE GioHang(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		IdSanPhamCT INT,
		IdTaiKhoan INT,
		SoLuong INT,
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
		TrangThai INT,
		FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan(Id),
		FOREIGN KEY (IdVoucher) REFERENCES Voucher(Id)
	);

	CREATE TABLE HoaDonCT(
		Id INT IDENTITY(1,1) PRIMARY KEY,
		IdSanPhamCT INT,
		IdHoaDon INT,
		SoLuong INT,
		GiaBan DECIMAL(10,2),
		TrangThai INT,
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
		NgayTao DATETIME,
		PhuongThucThanhToan NVARCHAR(255),
		TrangThai INT,
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
		TrangThai INT,
		FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan(Id),
		FOREIGN KEY (IdHoaDon) REFERENCES HoaDon(Id)
	);



	INSERT INTO ThuongHieu (Ten, TrangThai) VALUES
('Yonex', 1),
('Lining', 1),
('Victor', 0),
('Kumpoo', 1),
('Adidas', 0);

-- MauSac
INSERT INTO MauSac (Ten, TrangThai) VALUES
('#0a0a0a', 1),
('#146496', 1),
('#b81a2c', 1),
('#1ab82a', 0),
('#de3acd', 0);

-- ChatLieu
INSERT INTO ChatLieu (Ten, TrangThai) VALUES
('HM Graphite', 1),
('Woven Graphite', 1),
('46T Hot Melt Graphite', 1),
('30T HM Graphite', 0),
('Cacbon S.M.A.R.T', 0);

-- TrongLuong
INSERT INTO TrongLuong (Ten, TrangThai) VALUES
('2U', 1),
('3U', 1),
('4U', 1),
('5U', 0),
('6U', 0);

-- DiemCanBang
INSERT INTO DiemCanBang (Ten, TrangThai) VALUES
('290mm', 1),
('295mm', 1),
('300mm', 1),
('305mm', 0),
('310mm', 0);

--DoCung
INSERT INTO DoCung (Ten, TrangThai) VALUES
('Cứng', 1),
('Hơi cứng', 1),
('Dẻo', 1),
('Siêu dẻo', 0),
('Siêu cứng', 0);

	INSERT INTO SanPham (Ma, Ten, TrangThai) VALUES
	('SP001', 'Yonex Nanoflare 700 Pro', 1),
	('SP002', 'Yonex Astrox 99 Pro', 1),
	('SP003', 'Yonex Astrox 88s Pro', 1),
	('SP004', 'Victor Ryuga Metallic', 0),
	('SP005', 'Yonex Nanoflare Wex', 0),
	('SP006', 'Victor Ryuga D', 1),
	('SP007', 'Victor Mjolnir Metallic', 1),
	('SP008', 'Yonex Astrox Bkek', 0);


	INSERT INTO SanPhamCT (IdSanPham, IdThuongHieu, IdMauSac, IdChatLieu, IdTrongLuong, IdDiemCanBang,IdDoCung, Ma, SoLuong, DonGia, MoTa, TrangThai) VALUES
	(1, 1, 1, 1, 1, 1,2, 'SPCT001', 100, 3000000,N'Vợt cầu lông đẹp và đẳng cấp nhất thế giới', 1),
	(2, 1, 2, 2, 2, 2,3, 'SPCT002', 200, 2500000,N'Vợt cầu lông đẹp và đẳng cấp nhất việt nam', 1),
	(3, 1, 3, 3, 3, 3,2, 'SPCT003', 150, 2800000,N'Vợt cầu lông đẹp và đẳng cấp nhất vũ trụ', 0),
	(4, 3, 4, 4, 4, 4,1, 'SPCT004', 50, 2700000,N'Vợt cầu lông đẹp và đẳng cấp nhất thiên hà', 0),
	(5, 1, 5, 5, 5, 5,5, 'SPCT005', 80, 2200000,N'Vợt cầu lông đẹp và đẳng cấp nhất hành tinh', 1),
	(6, 3, 5, 5, 5, 5,4, 'SPCT006', 80, 2200000,N'Vợt cầu lông đẹp và đẳng cấp nhất hệ mặt trời', 1),
	(7, 3, 5, 5, 5, 5,5, 'SPCT007', 80, 2200000,N'Vợt cầu lông đẹp và đẳng cấp nhất xóm', 1),
	(8, 1, 5, 5, 5, 5,1, 'SPCT008', 80, 2200000,N'Vợt cầu lông đẹp và đẳng cấp nhất nhà', 1);


	INSERT INTO HinhAnh (IdSanPhamCT, Link, TrangThai) VALUES
	(1, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-nanoflare-700-pro-chinh-hang_1727042472.webp', 1),
	(1, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-nanoflare-700-pro-chinh-hang-1_1724277329.webp', 1),
	(1, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-nanoflare-700-pro-chinh-hang-2_1724277548.webp', 1),
	(1, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-nanoflare-700-pro-chinh-hang-3_1724277555.webp', 1),
	(2, 'https://cdn.shopvnb.com/uploads/san_pham/vot-cau-long-yonex-astrox-99-pro-do-chinh-hang-1.webp', 1),
	(2, 'https://pksport.vn/wp-content/uploads/2023/06/Vot-cau-long-Yonex-Astrox-99-Play-do.jpg', 1),
	(3, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-astrox-88s-pro-ch-noi-dia-trung-limited-5.webp', 1),
	(3, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-astrox-88s-pro-ch-noi-dia-trung-limited-4.webp', 1),
	(3, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-astrox-88s-pro-ch-noi-dia-trung-limited-3.webp', 1),
	(3, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-astrox-88s-pro-ch-noi-dia-trung-limited-2.webp', 1),
	(4, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-victor-ryuga-metallic-china-open-2024-noi-dia-trung_1726449913.webp', 0),
	(4, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-victor-tk-ryuga-metallic-chinh-hang-9_1702259888.webp', 1),
	(4, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-victor-tk-ryuga-metallic-chinh-hang-8_1702259894.webp', 1),
	(4, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-victor-tk-ryuga-metallic-chinh-hang-7_1702259903.webp', 1),
	(5, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-nanoflare-wex-noi-dia-trung_1719176769.webp', 1),
	(5, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-nanoflare-wex-noi-dia-trung-1_1719176775.webp', 1),
	(6, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-victor-ryuga-d-taiwan_1712201755.webp', 1),
	(6, 'https://cdn.shopvnb.com/uploads/san_pham/vot-cau-long-victor-thruster-ryuga-d-chinh-hang-4.webp', 1),
	(6, 'https://cdn.shopvnb.com/uploads/san_pham/vot-cau-long-victor-thruster-ryuga-d-chinh-hang-3.webp', 1),
	(6, 'https://cdn.shopvnb.com/uploads/san_pham/vot-cau-long-victor-thruster-ryuga-d-chinh-hang-2.webp', 1),
	(7, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-victor-mjolnir-metallic-limited-2024-ma-taiwan_1716431807.webp', 1),
	(7, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-victor-mjolnir-metallic-limited-2024-ma-taiwan-1_1716431827.webp', 1),
	(7, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-victor-mjolnir-metallic-limited-2024-ma-taiwan-2_1716431839.webp', 1),
	(7, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-victor-mjolnir-metallic-limited-2024-ma-taiwan-3_1716431847.webp', 1),
	(8, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-astrox-bkex-noi-dia-trung_1719176463.webp', 1),
	(8, 'https://cdn.shopvnb.com/uploads/gallery/vot-cau-long-yonex-astrox-bkex-noi-dia-trung-1_1719176469.webp', 1);


	






