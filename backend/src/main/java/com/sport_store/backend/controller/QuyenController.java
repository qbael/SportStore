package com.sport_store.backend.controller;

import com.sport_store.backend.dto.QuyenDTO;
import com.sport_store.backend.entity.ChucNang;
import com.sport_store.backend.entity.ChucVu;
import com.sport_store.backend.entity.Enum.HanhDong;
import com.sport_store.backend.entity.Quyen;
import com.sport_store.backend.repository.ChucNangRepository;
import com.sport_store.backend.repository.ChucVuRepository;
import com.sport_store.backend.repository.QuyenRepository;
import com.sport_store.backend.service.QuyenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/quyen")
@RequiredArgsConstructor
public class QuyenController {

    private final QuyenRepository quyenRepository;
    private final ChucNangRepository chucNangRepository;
    private final ChucVuRepository chucVuRepository;
    private final QuyenService quyenService;

    @GetMapping("/chucnang")
    public ResponseEntity<?> getAllChucNang() {
        List<ChucNang> chucNangList = chucNangRepository.findAll();
        return ResponseEntity.ok(chucNangList);
    }

    @PostMapping
    public ResponseEntity<?> themQuyen(@RequestBody QuyenDTO quyen) {
        try {
            ChucVu chucVu = chucVuRepository.findById(quyen.getChucVuId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chức vụ"));

            ChucNang chucNang = chucNangRepository.findById(quyen.getChucNangId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chức năng"));

            HanhDong hanhDong = HanhDong.fromValue(quyen.getHanhDong());

            boolean exists = quyenRepository.existsByChucVuAndChucNangAndHanhDong(chucVu, chucNang, hanhDong);
            if (exists) {
                return ResponseEntity.badRequest().body("Quyền đã tồn tại");
            }

            Quyen newQuyen = new Quyen();
            newQuyen.setChucVu(chucVu);
            newQuyen.setChucNang(chucNang);
            newQuyen.setHanhDong(hanhDong);

            quyenRepository.save(newQuyen);
            return ResponseEntity.ok("Thêm quyền thành công");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<?> xoaQuyen(@RequestBody QuyenDTO quyen) {
        try {
            ChucVu chucVu = chucVuRepository.findById(quyen.getChucVuId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chức vụ"));

            ChucNang chucNang = chucNangRepository.findById(quyen.getChucNangId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chức năng"));

            HanhDong hanhDong = HanhDong.fromValue(quyen.getHanhDong());

            Optional<Quyen> quyenOptional = quyenRepository.findByChucVuAndChucNangAndHanhDong(chucVu, chucNang, hanhDong);

            if (quyenOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Không tồn tại quyền cần xóa");
            }

            quyenRepository.delete(quyenOptional.get());

            return ResponseEntity.ok("Xóa quyền thành công");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/chucvu/{id}")
    public ResponseEntity<Map<String, List<String>>> getQuyenTheoChucVu(@PathVariable Integer id) {
        Map<String, List<String>> quyenMap = quyenService.getQuyenByChucVu(id);
        return ResponseEntity.ok(quyenMap);
    }

}
