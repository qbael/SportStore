package com.sport_store.backend.controller;

import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.projection.HoaDonFullProjection;
import com.sport_store.backend.service.HoaDonService;
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
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/hoadon")
@RequiredArgsConstructor
public class HoaDonController {

    private final HoaDonService hoaDonService;

    // @GetMapping
    // public ResponseEntity<Map<String, Object>> getAllHoaDon() {
    // Map<String, Object> res = new HashMap<>();
    // res.put("status", 200);
    // res.put("message", "Thành công");
    // res.put("data", hoaDonService.getHoaDons(Pageable.unpaged()).getContent());
    // // Lấy dữ liệu mà không phân trang
    // return ResponseEntity.ok(res);
    // }

    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> getAllHoaDonPage(Pageable pageable) {
        Map<String, Object> res = new HashMap<>();
        try {
            Page<HoaDonFullProjection> hoaDonPage = hoaDonService.getHoaDons(pageable);

            if (hoaDonPage.hasContent()) {
                res.put("status", 200);
                res.put("message", "Thành công");
                res.put("data", hoaDonPage.getContent());
                res.put("totalPages", hoaDonPage.getTotalPages());
                res.put("totalElements", hoaDonPage.getTotalElements());
                res.put("currentPage", hoaDonPage.getNumber());
                res.put("pageSize", hoaDonPage.getSize());
            } else {
                res.put("status", 404);
                res.put("message", "Không có dữ liệu");
            }

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("status", 500);
            res.put("message", "Lỗi hệ thống: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getHoaDonById(@PathVariable int id) {
        Map<String, Object> res = new HashMap<>();
        Optional<HoaDonFullProjection> hoaDonOptional = hoaDonService.getHoaDonById(id);

        if (hoaDonOptional.isPresent()) {
            res.put("status", 200);
            res.put("message", "Thành công");
            res.put("data", hoaDonOptional.get());
            return ResponseEntity.ok(res);
        } else {
            res.put("status", 404);
            res.put("message", "Không tìm thấy hóa đơn");
            res.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createHoaDon(@RequestBody HoaDon hoaDon) {
        Map<String, Object> response = new HashMap<>();
        try {
            HoaDon savedHoaDon = hoaDonService.createHoaDon(hoaDon);
            response.put("message", "Tạo hóa đơn thành công");
            response.put("hoaDonId", savedHoaDon.getId());
            response.put("ngay", savedHoaDon.getNgay());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Lỗi khi tạo hóa đơn: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchHoaDons(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTu,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayDen,
            @RequestParam(required = false) String tenKhachHang,
            @RequestParam(required = false) TrangThaiHoaDon trangThai,
            @RequestParam(required = false) String soDienThoai,
            @RequestParam(required = false) Integer minTongGiaBan,
            @RequestParam(required = false) Integer maxTongGiaBan,
            @RequestParam(required = false, defaultValue = "id") String sort,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir,
            @PageableDefault(size = 10) Pageable pageable) {

        Sort sortOrder = Sort.by(
                sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, sort);
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortOrder);

        Page<HoaDonFullProjection> page = hoaDonService.searchHoaDons(
                id, ngay, ngayTu, ngayDen, tenKhachHang, trangThai, soDienThoai,
                minTongGiaBan, maxTongGiaBan, sortedPageable);

        Map<String, Object> response = new HashMap<>();
        response.put("data", page.getContent());
        response.put("totalElements", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        response.put("currentPage", page.getNumber());
        response.put("pageSize", page.getSize());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteHoaDon(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            hoaDonService.deleteHoaDon(id);
            response.put("message", "Xóa hóa đơn thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Lỗi khi xóa hóa đơn: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateHoaDonStatus(
            @PathVariable int id, @RequestBody TrangThaiHoaDon trangThai) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean updatedHoaDon = hoaDonService.updateHoaDonStatus(id, trangThai);
            if (updatedHoaDon) {
                response.put("message", "Cập nhật trạng thái hóa đơn thành công");
                response.put("hoaDonId", id);
                response.put("trangThai", trangThai);
            } else {
                response.put("message", "Không tìm thấy hóa đơn với ID: " + id);
            }
            // response.put("hoaDon", updatedHoaDon);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Lỗi khi cập nhật trạng thái hóa đơn: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getbyUserID(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<HoaDonFullProjection> hoaDons = hoaDonService.getbyUserID(id);
            return ResponseEntity.ok(hoaDons);
        } catch (Exception e) {
            response.put("message", "Lỗi khi cập nhật trạng thái hóa đơn: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
