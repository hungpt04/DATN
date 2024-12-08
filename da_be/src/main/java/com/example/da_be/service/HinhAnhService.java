package com.example.da_be.service;

import com.example.da_be.entity.HinhAnh;
import com.example.da_be.entity.SanPhamCT;
import com.example.da_be.repository.HinhAnhRepository;
import com.example.da_be.repository.SanPhamCTRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HinhAnhService {
    @Autowired
    private HinhAnhRepository hinhAnhRepository;

    @Autowired
    private SanPhamCTRepository sanPhamCTRepository;

    public List<HinhAnh> getAllHinhAnh() {
        return hinhAnhRepository.findAll();
    }

    public HinhAnh getHinhAnhById(int id) {
        Optional<HinhAnh> hinhAnh = this.hinhAnhRepository.findById(id);
        return hinhAnh.orElseGet(HinhAnh::new);
    }

    public HinhAnh saveOrUpdateHinhAnh(HinhAnh hinhAnh) {
        return this.hinhAnhRepository.save(hinhAnh);
    }

    public void deleteHinhAnhById(int id) {
        this.hinhAnhRepository.deleteById(id);
    }

    public List<HinhAnh> uploadImages(MultipartFile[] files, int idSanPhamCT) {
        List<HinhAnh> hinhAnhs = new ArrayList<>();

        // Tìm kiếm sản phẩm theo ID
        Optional<SanPhamCT> sanPhamCTOptional = sanPhamCTRepository.findById(idSanPhamCT);
        if (!sanPhamCTOptional.isPresent()) {
            throw new RuntimeException("Sản phẩm không tồn tại với ID: " + idSanPhamCT);
        }
        SanPhamCT sanPhamCT = sanPhamCTOptional.get(); // Lấy đối tượng SanPhamCT

        for (MultipartFile file : files) {
            try {
                // Lưu tệp vào hệ thống tệp
                String fileName = file.getOriginalFilename();
                String filePath = "path/to/your/storage/directory/" + fileName; // Đường dẫn lưu trữ hình ảnh
                File destinationFile = new File(filePath);
                file.transferTo(destinationFile); // Lưu tệp vào hệ thống tệp

                // Tạo đối tượng HinhAnh và lưu vào cơ sở dữ liệu
                HinhAnh hinhAnh = new HinhAnh();
                hinhAnh.setLink(filePath); // Lưu đường dẫn hình ảnh
                hinhAnh.setTrangThai(1); // Ví dụ: 1 cho trạng thái hoạt động
                hinhAnh.setSanPhamCT(sanPhamCT); // Thiết lập sản phẩm liên quan

                hinhAnhs.add(hinhAnhRepository.save(hinhAnh)); // Lưu hình ảnh vào cơ sở dữ liệu
            } catch (IOException e) {
                e.printStackTrace(); // Xử lý lỗi
            }
        }
        return hinhAnhs; // Trả về danh sách hình ảnh đã lưu
    }
}