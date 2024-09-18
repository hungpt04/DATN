package com.example.da_be.controller;

import com.example.da_be.entity.ThuongHieu;
import com.example.da_be.service.ThuongHieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/thuonghieu")
public class ThuongHieuController {
    @Autowired
    private ThuongHieuService thuongHieuService;

    @GetMapping
    public List<ThuongHieu> getAllThuongHieu() {
        return thuongHieuService.getAllThuongHieu();
    }

    @DeleteMapping("{id}")
    public void deleteThuongHieu(@PathVariable int id) {
        this.thuongHieuService.deleteThuongHieuById(id);
    }

    @PostMapping
    public ThuongHieu addThuongHieu(@RequestBody ThuongHieu thuongHieu) {
        return this.thuongHieuService.saveOrUpdateThuongHieu(thuongHieu);
    }

    @PutMapping
    public ThuongHieu updateThuongHieu(@RequestBody ThuongHieu thuongHieu) {
        return this.thuongHieuService.saveOrUpdateThuongHieu(thuongHieu);
    }
}
