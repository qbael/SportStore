package com.sport_store.backend.controller;

import com.sport_store.backend.dto.ThongKeSanPhamDTO;
import com.sport_store.backend.service.ThongKeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/thong-ke")
public class ThongKeController {

    private final ThongKeService thongKeService;

    @Autowired
    public ThongKeController(ThongKeService thongKeService) {
        this.thongKeService = thongKeService;
    }

    @GetMapping("/san-pham/theo-gia-ban")
    public ResponseEntity<List<ThongKeSanPhamDTO>> thongKeSanPhamTheoGiaBan() {
        List<ThongKeSanPhamDTO> result = thongKeService.thongKeSanPhamTheoGiaBan();
        return ResponseEntity.ok(result);
    }
}