package com.sport_store.backend.controller;


import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.entity.CTHoaDon;
import com.sport_store.backend.repository.HoaDonRepository;
import com.sport_store.backend.repository.TTKhachHangRepository;
import com.sport_store.backend.repository.CTHoaDonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/hoadon")
@RequiredArgsConstructor
public class HoaDonController {

    private final HoaDonRepository hoaDonRepository;
    private final TTKhachHangRepository ttKhachHangRepository;
    private final CTHoaDonRepository ctHoaDonRepository; // Thêm repository CTHoaDon

    @GetMapping
    public List<HoaDon> getAllHoaDon() {
        return hoaDonRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HoaDon> getHoaDonById(@PathVariable int id) {
        return hoaDonRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<HoaDon> createHoaDon(@RequestBody HoaDon hoaDon) {
        System.out.println("---------------------------------------------------------------");
        System.out.println(hoaDon.toString());
        if (hoaDon.getNgay() == null) {
            hoaDon.setNgay(LocalDate.now());
        }

        if (hoaDon.getDsCTHoaDon() != null) {
            for (CTHoaDon ct : hoaDon.getDsCTHoaDon()) {
                ct.setHoaDon(hoaDon);
            }
        }
        // int kiểu dữ liệu (không có null) interger lớp dữ liệu (có thể null);&& hoaDon.getTtKhachHang().getId() != null
        if (hoaDon.getTtKhachHang() != null ) {
            hoaDon.setTtKhachHang(
                ttKhachHangRepository.findById(hoaDon.getTtKhachHang().getId()).orElse(null)
            );
        }

        HoaDon saved = hoaDonRepository.save(hoaDon);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HoaDon> updateHoaDon(@PathVariable int id, @RequestBody HoaDon hoaDon) {
        HoaDon existingHoaDon = hoaDonRepository.findById(id).orElse(null);

        if (existingHoaDon == null) {
            return ResponseEntity.notFound().build();
        }

        existingHoaDon.setTongGiaNhap(hoaDon.getTongGiaNhap());
        existingHoaDon.setTongGiaBan(hoaDon.getTongGiaBan());
        existingHoaDon.setTrangThai(hoaDon.getTrangThai());

        if (hoaDon.getDsCTHoaDon() != null) {
            for (CTHoaDon ct : hoaDon.getDsCTHoaDon()) {
                ct.setHoaDon(existingHoaDon);  
            }
            existingHoaDon.setDsCTHoaDon(hoaDon.getDsCTHoaDon());  
        }

        HoaDon updated = hoaDonRepository.save(existingHoaDon);
        return ResponseEntity.ok(updated);
    }
    // có thể không dùng <note>
    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteHoaDon(@PathVariable int id) {
    //     hoaDonRepository.deleteById(id);
    //     return ResponseEntity.noContent().build();
    // }

    // @GetMapping("/{id}/chitiet")
    // public List<CTHoaDon> getCTHoaDonByHoaDonId(@PathVariable int id) {
    //     return ctHoaDonRepository.findByHoaDonId(id);
    // }
}