package com.sport_store.backend.controller;

import com.sport_store.backend.dto.ThongKeKhachHangDTO;
import com.sport_store.backend.dto.ThongKeNhapHangDTO;
import com.sport_store.backend.dto.ThongKeSanPhamDTO;
import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.repository.HoaDonRepository;
import com.sport_store.backend.service.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/thongke")
@RequiredArgsConstructor
public class ThongKeController {

    private final HoaDonRepository hoaDonRepository;
    private final ThongKeService thongKeService;

    @GetMapping("/doanhthu")
    public Map<String, Object> thongKeDoanhThuTheoNgay(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to
    ) {
        List<HoaDon> hoaDons;
        if (from != null && to != null) {
            hoaDons = hoaDonRepository.findByNgayBetween(from, to);
        } else {
            hoaDons = hoaDonRepository.findAll();
        }

        Map<LocalDate, int[]> grouped = hoaDons.stream()
                .collect(Collectors.groupingBy(
                        HoaDon::getNgay,
                        TreeMap::new,
                        Collectors.reducing(
                                new int[]{0, 0},
                                hd -> new int[]{hd.getTongGiaNhap(), hd.getTongGiaBan()},
                                (a, b) -> new int[]{a[0] + b[0], a[1] + b[1]}
                        )
                ));

        List<Map<String, Object>> data = new ArrayList<>();
        int tongDoanhThu = 0;
        int tongLoiNhuan = 0;

        for (Map.Entry<LocalDate, int[]> entry : grouped.entrySet()) {
            int giaNhap = entry.getValue()[0];
            int giaBan = entry.getValue()[1];
            int loiNhuan = giaBan - giaNhap;

            Map<String, Object> map = new HashMap<>();
            map.put("ngay", entry.getKey());
            map.put("doanhThu", giaBan);
            map.put("loiNhuan", loiNhuan);
            data.add(map);

            tongDoanhThu += giaBan;
            tongLoiNhuan += loiNhuan;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("tongDoanhThu", tongDoanhThu);
        result.put("tongLoiNhuan", tongLoiNhuan);
        result.put("data", data);

        return result;
    }

    @GetMapping("/sanpham")
    public ResponseEntity<List<ThongKeSanPhamDTO>> thongKeSanPham(@RequestParam(required = false) LocalDate from,
                                                                  @RequestParam(required = false) LocalDate to,
                                                                  @RequestParam(required = false, defaultValue = "sanPhamId") String sortBy,
                                                                  @RequestParam(required = false, defaultValue = "ASC") String sortDir) {

        return ResponseEntity.ok(thongKeService.thongKeSanPham(from, to, sortBy, sortDir));
    }

    @GetMapping("/khachhang")
    public ResponseEntity<List<ThongKeKhachHangDTO>> thongKeKhachHang(@RequestParam(required = false) LocalDate from,
                                                                      @RequestParam(required = false) LocalDate to) {
        return ResponseEntity.ok(thongKeService.thongKeKhachHang(from, to));
    }

    @GetMapping("/nhaphang")
    public ResponseEntity<List<ThongKeNhapHangDTO>> thongKeNhapHang(@RequestParam(required = false) LocalDate from,
                                                                    @RequestParam(required = false) LocalDate to,
                                                                    @RequestParam(required = false, defaultValue = "sanPhamId") String sortBy,
                                                                    @RequestParam(required = false, defaultValue = "ASC") String sortDir) {
        return ResponseEntity.ok(thongKeService.thongKeNhapHang(from, to, sortBy, sortDir));
    }
}
