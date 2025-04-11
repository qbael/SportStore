package com.sport_store.backend.controller;

import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.entity.CTHoaDon;
import com.sport_store.backend.repository.HoaDonRepository;
import com.sport_store.backend.repository.TTKhachHangRepository;
import com.sport_store.backend.repository.CTHoaDonRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/hoadon")
@RequiredArgsConstructor
public class HoaDonController {

    private final HoaDonRepository hoaDonRepository;
    private final TTKhachHangRepository ttKhachHangRepository;
    private final CTHoaDonRepository ctHoaDonRepository; // Thêm repository CTHoaDon

    @GetMapping
    public ResponseEntity getAllHoaDon() {

        Map<String, Object> res = new HashMap<>();
        res.put("status", 200);
        res.put("message", "Thành công");
        res.put("data", hoaDonRepository.findAllBy());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getHoaDonById(@PathVariable int id) {
        Map<String, Object> res = new HashMap<>();

        return hoaDonRepository.findById(id)
                .map(HoaDonFullProjection -> {
                    res.put("status", 200);
                    res.put("message", "Thành công");
                    res.put("data", HoaDonFullProjection);
                    return ResponseEntity.ok(res);
                })
                .orElseGet(() -> {
                    res.put("status", 404);
                    res.put("message", "Không tìm thấy hóa đơn");
                    res.put("data", null);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
                });
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> createHoaDon(@RequestBody HoaDon hoaDon) {

        if (hoaDon.getNgay() == null) {
            hoaDon.setNgay(LocalDate.now());
        }

        if (hoaDon.getDsCTHoaDon() != null) {
            for (CTHoaDon ct : hoaDon.getDsCTHoaDon()) {
                ct.setHoaDon(hoaDon);
            }
        }
        // int kiểu dữ liệu (không có null) interger lớp dữ liệu (có thể null);&&
        // hoaDon.getTtKhachHang().getId() != null
        if (hoaDon.getTtKhachHang() != null) {
            hoaDon.setTtKhachHang(
                    ttKhachHangRepository.findById(hoaDon.getTtKhachHang().getId()).orElse(null));
        }

        HoaDon saved = hoaDonRepository.save(hoaDon);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Tạo hóa đơn thành công");
        response.put("hoaDonId", saved.getId());
        response.put("ngay", saved.getNgay());

        return ResponseEntity.ok(response);
    }

    // @PutMapping("/{id}")
    // public ResponseEntity<HoaDon> updateHoaDon(@PathVariable int id, @RequestBody HoaDon hoaDon) {
    //     HoaDon existingHoaDon = hoaDonRepository.findById(id).orElse(null);

    //     if (existingHoaDon == null) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     existingHoaDon.setTongGiaNhap(hoaDon.getTongGiaNhap());
    //     existingHoaDon.setTongGiaBan(hoaDon.getTongGiaBan());
    //     existingHoaDon.setTrangThai(hoaDon.getTrangThai());

    //     if (hoaDon.getDsCTHoaDon() != null) {
    //         for (CTHoaDon ct : hoaDon.getDsCTHoaDon()) {
    //             ct.setHoaDon(existingHoaDon);
    //         }
    //         existingHoaDon.setDsCTHoaDon(hoaDon.getDsCTHoaDon());
    //     }

    //     HoaDon updated = hoaDonRepository.save(existingHoaDon);
    //     return ResponseEntity.ok(updated);
    // }
    // có thể không dùng <note>
    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteHoaDon(@PathVariable int id) {
    // hoaDonRepository.deleteById(id);
    // return ResponseEntity.noContent().build();
    // }

    // @GetMapping("/{id}/chitiet")
    // public List<CTHoaDon> getCTHoaDonByHoaDonId(@PathVariable int id) {
    // return ctHoaDonRepository.findByHoaDonId(id);
    // }
}