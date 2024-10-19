package com.example.da_be.service;

import com.example.da_be.dto.SanPhamCTWithImagesDTO;
import com.example.da_be.entity.HinhAnh;
import com.example.da_be.entity.SanPham;
import com.example.da_be.entity.SanPhamCT;
import com.example.da_be.exception.ResourceNotFoundException;
import com.example.da_be.repository.SanPhamCTRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SanPhamCTService {
    @Autowired
    private SanPhamCTRepository sanPhamCTRepository;

    public List<SanPhamCT> getAllSanPhamCT() {
        return sanPhamCTRepository.findAll();
    }

    public SanPhamCT getSanPhamCTById(int id) {
        Optional<SanPhamCT> sanPhamCT = this.sanPhamCTRepository.findById(id);
        return sanPhamCT.orElseGet(SanPhamCT::new);
    }

    public SanPhamCT saveOrUpdateSanPhamCT(SanPhamCT sanPhamCT) {
        return this.sanPhamCTRepository.save(sanPhamCT);
    }

    public void deleteSanPhamCTById(int id) {
        this.sanPhamCTRepository.deleteById(id);
    }




    public SanPhamCTWithImagesDTO getSanPhamCTWithImages(Long id) {
        SanPhamCT sanPhamCT = sanPhamCTRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SanPhamCT not found with id " + id));

        List<String> hinhAnhUrls = sanPhamCT.getHinhAnh().stream()
                .map(HinhAnh::getLink)
                .collect(Collectors.toList());

        return new SanPhamCTWithImagesDTO(
                sanPhamCT.getId(),
                sanPhamCT.getSanPham().getTen(),
                sanPhamCT.getMa(),
                sanPhamCT.getSoLuong(),
                sanPhamCT.getDonGia(),
                sanPhamCT.getSanPham().getTen(),
                sanPhamCT.getSanPham().getMa(),
                sanPhamCT.getThuongHieu().getTen(),
                sanPhamCT.getMauSac().getTen(),
                sanPhamCT.getChatLieu().getTen(),
                sanPhamCT.getTrongLuong().getTen(),
                sanPhamCT.getDiemCanBang().getTen(),
                hinhAnhUrls
        );
    }



    public List<SanPhamCTWithImagesDTO> getAllSanPhamCTWithImages() {
        List<SanPhamCT> sanPhamCTList = sanPhamCTRepository.findAll(); // Lấy tất cả sản phẩm

        return sanPhamCTList.stream().map(sanPhamCT -> {
            List<String> hinhAnhUrls = sanPhamCT.getHinhAnh().stream()
                    .map(HinhAnh::getLink)
                    .collect(Collectors.toList());

            return new SanPhamCTWithImagesDTO(
                    sanPhamCT.getId(),
                    sanPhamCT.getSanPham().getTen(),
                    sanPhamCT.getMa(),
                    sanPhamCT.getSoLuong(),
                    sanPhamCT.getDonGia(),
                    sanPhamCT.getSanPham().getTen(),
                    sanPhamCT.getSanPham().getMa(),
                    sanPhamCT.getThuongHieu().getTen(),
                    sanPhamCT.getMauSac().getTen(),
                    sanPhamCT.getChatLieu().getTen(),
                    sanPhamCT.getTrongLuong().getTen(),
                    sanPhamCT.getDiemCanBang().getTen(),
                    hinhAnhUrls
            );
        }).collect(Collectors.toList()); // Trả về danh sách DTO
    }


}
