package com.example.da_be.service;

import com.example.da_be.entity.DiaChi;
import com.example.da_be.entity.DiemCanBang;
import com.example.da_be.repository.DiaChiRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiaChiService {

    @Autowired
    private DiaChiRepository diaChiRepository;

    public List<DiaChi> getAllDiaChi() {
        return diaChiRepository.findAll();
    }

    public DiaChi getDiaChiById(Long id) {
        Optional<DiaChi> diaChi = diaChiRepository.findById(id);
        return diaChi.orElseGet(DiaChi::new);
    }

    public DiaChi saveOrUpdateDiaChii(DiaChi diaChi) {
        return this.diaChiRepository.save(diaChi);
    }

    public DiaChi saveOrUpdateDiaChi(DiaChi diaChi) {
        // In ra log để kiểm tra dữ liệu đầu vào
        System.out.println("Received DiaChi: " + diaChi);

        // Tìm địa chỉ theo tài khoản ID
        List<DiaChi> existingDiaChiList = diaChiRepository.findByTaiKhoan_Id(Long.valueOf(diaChi.getTaiKhoan().getId()));

        DiaChi diaChiToSave;
        if (!existingDiaChiList.isEmpty()) {
            // Nếu đã có địa chỉ, cập nhật địa chỉ đầu tiên
            diaChiToSave = existingDiaChiList.get(0);

            // Cập nhật từng trường
            diaChiToSave.setTen(diaChi.getTen());
            diaChiToSave.setSdt(diaChi.getSdt());
            diaChiToSave.setIdTinh(diaChi.getIdTinh());
            diaChiToSave.setIdHuyen(diaChi.getIdHuyen());
            diaChiToSave.setIdXa(diaChi.getIdXa());
            diaChiToSave.setDiaChiCuThe(diaChi.getDiaChiCuThe());
        } else {
            // Nếu chưa có địa chỉ, tạo mới
            diaChiToSave = diaChi;
        }

        // In ra log trước khi lưu
        System.out.println("DiaChi to save: " + diaChiToSave);

        return diaChiRepository.save(diaChiToSave);
    }

    public void deleteDiaChiById(Long id) {
        diaChiRepository.deleteById(id);
    }

    // Thêm phương thức để lấy địa chỉ theo IdTaiKhoan
    public List<DiaChi> getDiaChiByTaiKhoanId(Long idTaiKhoan) {
        return diaChiRepository.findByTaiKhoan_Id(idTaiKhoan);
    }
}