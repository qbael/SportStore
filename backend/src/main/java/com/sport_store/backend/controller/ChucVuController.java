package com.sport_store.backend.controller;

import com.sport_store.backend.dto.ChucVuDTO;
import com.sport_store.backend.entity.ChucVu;
import com.sport_store.backend.repository.ChucVuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/chucvu")
@RequiredArgsConstructor
public class ChucVuController {
    private final ChucVuRepository chucVuRepository;

    // Lấy danh sách chức vụ
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllChucVu() {
        try {
            List<ChucVu> chucVus = chucVuRepository.findAll();
            List<ChucVuDTO> chucVuDTOs = chucVus.stream().map(this::mapToDTO).collect(Collectors.toList());
            return buildResponse(HttpStatus.OK, "Lấy danh sách chức vụ thành công", chucVuDTOs);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lấy danh sách chức vụ: " + e.getMessage(), null);
        }
    }

    // Ánh xạ Entity sang DTO
    private ChucVuDTO mapToDTO(ChucVu chucVu) {
        ChucVuDTO dto = new ChucVuDTO();
        dto.setId(chucVu.getId());
        dto.setTenChucVu(chucVu.getTenChucVu().name());
        return dto;
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
