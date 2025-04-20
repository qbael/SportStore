package com.sport_store.backend.controller;

import com.sport_store.backend.dto.ChucVuDTO;
import com.sport_store.backend.dto.NhanVienDTO;
import com.sport_store.backend.dto.NhanVienTheoChucVuDTO;
import com.sport_store.backend.entity.ChucVu;
import com.sport_store.backend.entity.NhanVien;
import com.sport_store.backend.repository.ChucVuRepository;
import com.sport_store.backend.repository.NhanVienRepository;
import com.sport_store.backend.service.NhanVienService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/nhanvien")
@RequiredArgsConstructor
public class NhanVienController {
    private final NhanVienRepository nhanVienRepository;
    private final ChucVuRepository chucVuRepository;

    // Lấy danh sách nhân viên
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllNhanVien() {
        try {
            List<NhanVien> nhanViens = nhanVienRepository.findAll();
            List<NhanVienDTO> nhanVienDTOs = nhanViens.stream().map(this::mapToDTO).collect(Collectors.toList());
            return buildResponse(HttpStatus.OK, "Lấy danh sách nhân viên thành công", nhanVienDTOs);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lấy danh sách nhân viên: " + e.getMessage(), null);
        }
    }

    @GetMapping("/chucvu")
    public ResponseEntity<Map<String, List<NhanVienTheoChucVuDTO>>> getNhanVienTheoChucVu() {
        List<NhanVien> ds = nhanVienRepository.findAll();

        // Map sang DTO
        List<NhanVienTheoChucVuDTO> dsDTO = ds.stream().map(nv -> new NhanVienTheoChucVuDTO(
                nv.getId(),
                nv.getHoTen(),
                nv.getNgaySinh(),
                nv.isGioiTinh(),
                nv.getDiaChi(),
                nv.getEmail(),
                nv.getSdt(),
                new ChucVuDTO(nv.getChucVu().getId(), nv.getChucVu().getTenChucVu().getValue())
        )).toList();

        // Nhóm theo chức vụ
        Map<String, List<NhanVienTheoChucVuDTO>> result = dsDTO.stream()
                .collect(Collectors.groupingBy(dto -> dto.getChucVu().getTenChucVu()));

        return ResponseEntity.ok(result);
    }

    // Lấy danh sách nhân viên theo chức vụ
    @GetMapping("/chucvu/{chucVuId}")
    public ResponseEntity<Map<String, Object>> getNhanVienByChucVu(@PathVariable Integer chucVuId) {
        try {
            List<NhanVien> nhanViens;
            if (chucVuId == 0) {
                nhanViens = nhanVienRepository.findAll();
            } else {
                nhanViens = nhanVienRepository.findByChucVuId(chucVuId);
            }
            List<NhanVienDTO> nhanVienDTOs = nhanViens.stream().map(this::mapToDTO).collect(Collectors.toList());
            return buildResponse(HttpStatus.OK, "Lấy danh sách nhân viên theo chức vụ thành công", nhanVienDTOs);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lấy danh sách nhân viên theo chức vụ: " + e.getMessage(), null);
        }
    }

    // Lấy thông tin nhân viên theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getNhanVien(@PathVariable Integer id) {
        try {
            Optional<NhanVien> nhanVienOpt = nhanVienRepository.findById(id);
            if (nhanVienOpt.isPresent()) {
                NhanVienDTO nhanVienDTO = mapToDTO(nhanVienOpt.get());
                return buildResponse(HttpStatus.OK, "Lấy thông tin nhân viên thành công", nhanVienDTO);
            }
            return buildResponse(HttpStatus.NOT_FOUND, "Không tìm thấy nhân viên", null);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lấy thông tin nhân viên: " + e.getMessage(), null);
        }
    }

    // Thêm nhân viên
    @PostMapping
    public ResponseEntity<Map<String, Object>> createNhanVien(@RequestBody NhanVienDTO nhanVienDTO) {
        try {
            NhanVien nhanVien = mapToEntity(nhanVienDTO);
            nhanVienRepository.save(nhanVien);
            return buildResponse(HttpStatus.CREATED, "Thêm nhân viên thành công", mapToDTO(nhanVien));
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi thêm nhân viên: " + e.getMessage(), null);
        }
    }

    // Sửa nhân viên
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateNhanVien(@PathVariable Integer id, @RequestBody NhanVienDTO nhanVienDTO) {
        try {
            Optional<NhanVien> nhanVienOpt = nhanVienRepository.findById(id);
            if (nhanVienOpt.isPresent()) {
                NhanVien nhanVien = nhanVienOpt.get();
                nhanVien.setHoTen(nhanVienDTO.getHoTen());
                nhanVien.setNgaySinh(nhanVienDTO.getNgaySinh());
                nhanVien.setGioiTinh(nhanVienDTO.isGioiTinh());
                nhanVien.setDiaChi(nhanVienDTO.getDiaChi());
                nhanVien.setEmail(nhanVienDTO.getEmail());
                nhanVien.setSdt(nhanVienDTO.getSdt());
                if (nhanVienDTO.getPassword() != null && !nhanVienDTO.getPassword().isEmpty()) {
                    nhanVien.setPassword(nhanVienDTO.getPassword());
                }
                chucVuRepository.findById(nhanVienDTO.getChucVuId()).ifPresent(nhanVien::setChucVu);
                nhanVienRepository.save(nhanVien);
                return buildResponse(HttpStatus.OK, "Cập nhật nhân viên thành công", mapToDTO(nhanVien));
            }
            return buildResponse(HttpStatus.NOT_FOUND, "Không tìm thấy nhân viên", null);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi cập nhật nhân viên: " + e.getMessage(), null);
        }
    }

    // Xóa nhân viên
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNhanVien(@PathVariable Integer id) {
        try {
            Optional<NhanVien> nhanVienOpt = nhanVienRepository.findById(id);
            if (nhanVienOpt.isPresent()) {
                nhanVienRepository.deleteById(id);
                return buildResponse(HttpStatus.OK, "Xóa nhân viên thành công", null);
            }
            return buildResponse(HttpStatus.NOT_FOUND, "Không tìm thấy nhân viên", null);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi xóa nhân viên: " + e.getMessage(), null);
        }
    }

    // Ánh xạ Entity sang DTO
    private NhanVienDTO mapToDTO(NhanVien nhanVien) {
        NhanVienDTO dto = new NhanVienDTO();
        dto.setId(nhanVien.getId());
        dto.setHoTen(nhanVien.getHoTen());
        dto.setNgaySinh(nhanVien.getNgaySinh());
        dto.setGioiTinh(nhanVien.isGioiTinh());
        dto.setDiaChi(nhanVien.getDiaChi());
        dto.setEmail(nhanVien.getEmail());
        dto.setSdt(nhanVien.getSdt());
        dto.setChucVuId(nhanVien.getChucVu().getId());
        dto.setTenChucVu(nhanVien.getChucVu().getTenChucVu().name());
        dto.setPassword(nhanVien.getPassword());  //trả về api mật khẩu có thể để tróng ?
        return dto;
    }

    // Ánh xạ DTO sang Entity
    private NhanVien mapToEntity(NhanVienDTO dto) {
        NhanVien nhanVien = new NhanVien();
        nhanVien.setHoTen(dto.getHoTen());
        nhanVien.setNgaySinh(dto.getNgaySinh());
        nhanVien.setGioiTinh(dto.isGioiTinh());
        nhanVien.setDiaChi(dto.getDiaChi());
        nhanVien.setEmail(dto.getEmail());
        nhanVien.setSdt(dto.getSdt());
        nhanVien.setPassword(dto.getPassword());
        chucVuRepository.findById(dto.getChucVuId()).ifPresent(nhanVien::setChucVu);
        return nhanVien;
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status.value());
        response.put("message", message);
        if (data != null) {
            response.put("data", data);
        }
        return new ResponseEntity<>(response, status);
    }
}
