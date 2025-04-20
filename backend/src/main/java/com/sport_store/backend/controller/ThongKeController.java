package com.sport_store.backend.controller;

import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.repository.HoaDonRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/thongke")
@RequiredArgsConstructor
public class ThongKeController {

    private final HoaDonRepository hoaDonRepository;

    @GetMapping("/doanhthu")
    public List<Map<String, Object>> thongKeDoanhThuTheoNgay(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to
    ) {
        List<HoaDon> hoaDons;
        if (from != null && to != null) {
            hoaDons = hoaDonRepository.findByNgayBetween(from, to);
        } else {
            hoaDons = hoaDonRepository.findAll();
        }

        return hoaDons.stream()
                .collect(Collectors.groupingBy(
                        HoaDon::getNgay,
                        TreeMap::new,
                        Collectors.reducing(
                                new int[]{0, 0},
                                hd -> new int[]{hd.getTongGiaNhap(), hd.getTongGiaBan()},
                                (a, b) -> new int[]{a[0] + b[0], a[1] + b[1]}
                        )
                ))
                .entrySet()
                .stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("ngay", e.getKey());
                    map.put("doanhThu", e.getValue()[1]);
                    map.put("loiNhuan", e.getValue()[1] - e.getValue()[0]);
                    return map;
                })
                .toList();
    }
}
