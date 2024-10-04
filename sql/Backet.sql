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
		Avatar NVARCHAR(255),
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
		LoaiVoucher NVARCHAR(255),
		GiaTriVoucher INT,
		SoLuong INT,
		SoLuongToiThieu INT,
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
		Ma NVARCHAR(255),
		SoLuong INT,
		DonGia DECIMAL(10,2),
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
		TrangThai INT,
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
('Đen', 1),
('Xanh dương', 1),
('Xám', 1),
('Đỏ', 0),
('Trắng', 0);

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

	-- KhuyenMai
INSERT INTO KhuyenMai (Ten, TG_BatDau, TG_KetThuc, TrangThai) VALUES
('Khuyen mai 10%', '2024-01-01', '2024-01-10', 1),
('Khuyen mai 20%', '2024-02-01', '2024-02-15', 1),
('Khuyen mai 30%', '2024-03-01', '2024-03-10', 0),
('Khuyen mai 40%', '2024-04-01', '2024-04-15', 0),
('Khuyen mai 50%', '2024-05-01', '2024-05-10', 0);



	INSERT INTO TaiKhoan (Ma, HoTen, Sdt, Email, MatKhau, GioiTinh, VaiTro, Avatar, NgaySinh, CCCD, TrangThai) VALUES
	('TK001', 'Nguyen Van A', '0123456789', 'a@example.com', 'password123', 1, 'Customer', 'avatar1.png', '1990-01-01', '123456789', 1),
	('TK002', 'Tran Thi B', '0987654321', 'b@example.com', 'password123', 0, 'Admin', 'avatar2.png', '1985-02-15', '987654321', 1),
	('TK003', 'Le Van C', '0912345678', 'c@example.com', 'password123', 1, 'Customer', 'avatar3.png', '1992-03-10', '345678912', 0),
	('TK004', 'Pham Thi D', '0908765432', 'd@example.com', 'password123', 0, 'Customer', 'avatar4.png', '1991-04-20', '654321987', 1),
	('TK005', 'Hoang Van E', '0897654321', 'e@example.com', 'password123', 1, 'Customer', 'avatar5.png', '1988-05-30', '234567891', 0);




	INSERT INTO Voucher (Ma, Ten, GiaTri, GiaTriMax, LoaiVoucher, GiaTriVoucher, SoLuong, SoLuongToiThieu, NgayBatDau, NgayKetThuc, TrangThai) VALUES
	('V001', 'Voucher 10%', 10, 100000, 'Percent', 10, 50, 1, '2024-01-01', '2024-01-10', 1),
	('V002', 'Voucher 20%', 20, 200000, 'Percent', 20, 100, 1, '2024-02-01', '2024-02-15', 1),
	('V003', 'Voucher 50k', 50000, 50000, 'Fixed', 50000, 200, 1, '2024-03-01', '2024-03-10', 0),
	('V004', 'Voucher 100k', 100000, 100000, 'Fixed', 100000, 300, 1, '2024-04-01', '2024-04-05', 0),
	('V005', 'Voucher 5%', 5, 50000, 'Percent', 5, 150, 1, '2024-05-01', '2024-05-07', 1);



	INSERT INTO SanPham (Ma, Ten, TrangThai) VALUES
	('SP001', 'Yonex Astrox 100zz', 1),
	('SP002', 'Lining Halbertec 9000', 1),
	('SP003', 'Victor Ryuga D', 1),
	('SP004', 'Yonex Nanoflare 1000z', 0),
	('SP005', 'lining Axforce 100', 0);


	INSERT INTO SanPhamCT (IdSanPham, IdThuongHieu, IdMauSac, IdChatLieu, IdTrongLuong, IdDiemCanBang, Ma, SoLuong, DonGia, TrangThai) VALUES
	(1, 1, 1, 1, 1, 1, 'SPCT001', 10, 3000000, 1),
	(2, 2, 2, 2, 2, 2, 'SPCT002', 20, 2500000, 1),
	(3, 3, 3, 3, 3, 3, 'SPCT003', 15, 2800000, 0),
	(4, 4, 4, 4, 4, 4, 'SPCT004', 5, 2700000, 0),
	(5, 5, 5, 5, 5, 5, 'SPCT005', 8, 2200000, 1);


	INSERT INTO HinhAnh (IdSanPhamCT, Link, TrangThai) VALUES
	(1, '../../../components/Assets/nanoflare-700-pro.webp', 1),
	(2, '../../../components/Assets/arcsaber-11.webp', 1),
	(3, '../../../components/Assets/arcsaber-7-tour.webp', 1),
	(4, '../../../components/Assets/astrox-69.webp', 0),
	(5, '../../../components/Assets/astrox-88d-pro-2024.webp', 1);


	INSERT INTO DiaChi (IdTaiKhoan, Ten, Sdt, IdTinh, IdHuyen, IdXa, DiaChiCuThe) VALUES
	(1, 'Nguyen Van A', '0123456789', 'Hanoi', 'Dong Da', 'Khuong Thuong', 'So 10, Pho ABC'),
	(2, 'Tran Thi B', '0987654321', 'Ho Chi Minh', 'District 1', 'Ben Nghe', '123 Nguyen Hue'),
	(3, 'Le Van C', '0912345678', 'Da Nang', 'Hai Chau', 'Thach Thang', '45 Bach Dang'),
	(4, 'Pham Thi D', '0908765432', 'Can Tho', 'Ninh Kieu', 'An Hoa', '67 Hung Vuong'),
	(5, 'Hoang Van E', '0897654321', 'Hai Phong', 'Le Chan', 'Niem Nghia', '21 Tran Phu');


	INSERT INTO ThongBao (IdKhachHang, TieuDe, NoiDung, IdRedirect, KieuThongBao, TrangThai) VALUES
	(1, 'Khuyến mãi 10%', 'Bạn nhận được khuyến mãi 10% từ hệ thống', 'SP001', 'Promotion', 1),
	(2, 'Thông báo đơn hàng', 'Đơn hàng của bạn đã được giao', 'HD001', 'Order', 1),
	(3, 'Thông báo hệ thống', 'Hệ thống sẽ bảo trì trong 2 giờ', 'System', 'System', 0),
	(4, 'Khuyến mãi 20%', 'Bạn nhận được khuyến mãi 20% từ hệ thống', 'SP002', 'Promotion', 1),
	(5, 'Thông báo giao hàng', 'Đơn hàng của bạn đang được giao', 'HD002', 'Order', 0);



	INSERT INTO GioHang (IdSanPhamCT, IdTaiKhoan, Ma, SoLuong, TongTien, NgayTao, NgaySua) VALUES
	(1, 1, 'GH001', 2, 6000000, '2024-09-01', '2024-09-02'),
	(2, 2, 'GH002', 1, 2500000, '2024-09-03', '2024-09-04'),
	(3, 3, 'GH003', 3, 8400000, '2024-09-05', '2024-09-06'),
	(4, 4, 'GH004', 1, 2700000, '2024-09-07', '2024-09-08'),
	(5, 5, 'GH005', 2, 4400000, '2024-09-09', '2024-09-10');




	INSERT INTO HoaDon (IdTaiKhoan, Ma, DiaChiNguoiNhan, SdtNguoiNhan, PhiShip, TongTien, TrangThai) VALUES
	(1, 'HD001', 'So 10, Pho ABC, Hanoi', '0123456789', 30000, 6030000, 1),
	(2, 'HD002', '123 Nguyen Hue, Ho Chi Minh', '0987654321', 50000, 2550000, 2),
	(3, 'HD003', '45 Bach Dang, Da Nang', '0912345678', 40000, 8440000, 3),
	(4, 'HD004', '67 Hung Vuong, Can Tho', '0908765432', 20000, 2720000, 1),
	(5, 'HD005', '21 Tran Phu, Hai Phong', '0897654321', 30000, 4430000, 0);




	INSERT INTO HoaDonCT (IdSanPhamCT, IdHoaDon, Ma, SoLuong, GiaBan, TrangThai) VALUES
	(1, 1, 'HDCT001', 2, 3000000, 1),
	(2, 2, 'HDCT002', 1, 2500000, 2),
	(3, 3, 'HDCT003', 3, 2800000, 3),
	(4, 4, 'HDCT004', 1, 2700000, 1),
	(5, 5, 'HDCT005', 2, 2200000, 0);



	INSERT INTO SanPham_KhuyenMai (IdSanPhamCT, IdKhuyenMai, GiaKhuyenMai) VALUES
	(1, 1, 2700000),
	(2, 2, 2000000),
	(3, 3, 2500000),
	(4, 4, 2300000),
	(5, 5, 1800000);



	INSERT INTO ThanhToan (IdTaiKhoan, IdHoaDon, Ma, TongTien, PhuongThucThanhToan, TrangThai) VALUES
	(1, 1, 'TT001', 6030000, 'Credit Card', 1),
	(2, 2, 'TT002', 2550000, 'Cash', 0),
	(3, 3, 'TT003', 8440000, 'Bank Transfer', 2),
	(4, 4, 'TT004', 2720000, 'Credit Card', 1),
	(5, 5, 'TT005', 4430000, 'Cash', 0);



	INSERT INTO KhachHang_Voucher (IdKhachHang, IdVoucher) VALUES
	(1, 1),
	(2, 2),
	(3, 3),
	(4, 4),
	(5, 5);



	INSERT INTO LichSuDonHang (IdTaiKhoan, IdHoaDon, MoTa, NgayTao, NgaySua, TrangThai) VALUES
	(1, 1, 'Đơn hàng đã được giao', '2024-09-01', '2024-09-02', 1),
	(2, 2, 'Đơn hàng đang trong quá trình vận chuyển', '2024-09-03', '2024-09-04', 2),
	(3, 3, 'Đơn hàng đã bị hủy', '2024-09-05', '2024-09-06', 3),
	(4, 4, 'Đơn hàng đã được giao', '2024-09-07', '2024-09-08', 1),
	(5, 5, 'Đơn hàng đang chờ xử lý', '2024-09-09', '2024-09-10', 0);






