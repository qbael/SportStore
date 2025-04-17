package com.sport_store.backend.service;

import com.sport_store.backend.dto.TTKhachHangDTO;
import com.sport_store.backend.entity.TTKhachHang;
import com.sport_store.backend.repository.TTKhachHangRepository;
import com.sport_store.backend.repository.TaiKhoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TTKhachHangService {
    private final TTKhachHangRepository ttKhachHangRepository;
    private final TaiKhoanRepository taiKhoanRepository;

    public List<TTKhachHangDTO> getAllKhachHang() {
        return ttKhachHangRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean updateAccountStatus(Integer khachHangId, boolean isActive) {
        if (khachHangId == null) {
            return false;
        }

        Optional<TTKhachHang> khachHangOpt = ttKhachHangRepository.findById(khachHangId);
        if (khachHangOpt.isPresent()) {
            TTKhachHang khachHang = khachHangOpt.get();
            khachHang.getTaiKhoan().setIsActive(isActive);
            taiKhoanRepository.save(khachHang.getTaiKhoan());
            return true;
        }
        return false;
    }

    private TTKhachHangDTO convertToDTO(TTKhachHang khachHang) {
        TTKhachHangDTO dto = new TTKhachHangDTO();
        dto.setId(khachHang.getId());
        dto.setHoTen(khachHang.getHoTen());
        dto.setSdt(khachHang.getSdt());
        dto.setDiaChi(khachHang.getDiaChi());
        dto.setTaiKhoanId(khachHang.getTaiKhoan().getId());
        return dto;
    }
}