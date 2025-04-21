package com.sport_store.backend.controller;

import com.sport_store.backend.dto.NhapHangDTO;
import com.sport_store.backend.dto.NhapHangRequestDTO;
import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.entity.NhapHang;
import com.sport_store.backend.projection.HoaDonFullProjection;
import com.sport_store.backend.service.HoaDonService;
import com.sport_store.backend.service.NhaphangService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sport_store.backend.entity.Enum.TrangThaiHoaDon;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/nhaphang")
@RequiredArgsConstructor

public class NhapHangController {
    private final NhaphangService nhapHangService;
    
    // tạo nhập hàng 
    @PostMapping
    public ResponseEntity<Map<String, Object>> createNhapHang(@RequestBody NhapHangRequestDTO nhapHang) {
        Map<String, Object> res = new HashMap<>();
        try {
            NhapHang createdNhapHang = nhapHangService.createNhapHang(nhapHang);
            res.put("status", 200);
            res.put("message", "Thành công");
            res.put("id", createdNhapHang.getId());
            res.put("ngay", createdNhapHang.getNgay());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("status", 500);
            res.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<NhapHangDTO>> searchNhapHang(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String filterField,
            @RequestParam(required = false) String filterValue,
            @RequestParam(defaultValue = "ngay") String sortField,
            @RequestParam(defaultValue = "ASC") String sortDirection,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Validate date range
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("startDate phải nhỏ hơn hoặc bằng endDate");
        }

        // Validate sortDirection
        if (!sortDirection.equalsIgnoreCase("ASC") && !sortDirection.equalsIgnoreCase("DESC")) {
            throw new IllegalArgumentException("sortDirection phải là 'ASC' hoặc 'DESC'");
        }

        // Create Pageable with sort
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Call service
        Page<NhapHangDTO> result = nhapHangService.getFilteredNhapHang(
                startDate, endDate, filterField, filterValue, pageable);

        return ResponseEntity.ok(result);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateNhapHang(
            @PathVariable int id,
            @RequestBody TrangThaiHoaDon status) {
        Map<String, Object> res = new HashMap<>();
        try {
            boolean isUpdated = nhapHangService.updatestatus(id, status);
            if (isUpdated) {
                res.put("status", 200);
                res.put("message", "Thành công sản phẩm được cập nhập trạng thái");
            } else {
                res.put("status", 404);
                res.put("message", "Nhập hàng không tồn tại");
            }
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("status", 500);
            res.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }
}
