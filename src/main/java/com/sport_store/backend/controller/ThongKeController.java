package com.sport_store.backend.controller;

import com.sport_store.backend.dto.ThongKeSanPhamDTO;
import com.sport_store.backend.service.ThongKeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    
    @GetMapping("/san-pham/theo-gia-ban/ngay")
    public ResponseEntity<List<ThongKeSanPhamDTO>> thongKeSanPhamTheoGiaBanVaNgay(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay) {
        List<ThongKeSanPhamDTO> result = thongKeService.thongKeSanPhamTheoGiaBanVaNgay(tuNgay, denNgay);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/san-pham/theo-gia-ban/danh-muc/{danhMucId}")
    public ResponseEntity<List<ThongKeSanPhamDTO>> thongKeSanPhamTheoGiaBanVaDanhMuc(
            @PathVariable int danhMucId) {
        List<ThongKeSanPhamDTO> result = thongKeService.thongKeSanPhamTheoGiaBanVaDanhMuc(danhMucId);
        return ResponseEntity.ok(result);
    }
}