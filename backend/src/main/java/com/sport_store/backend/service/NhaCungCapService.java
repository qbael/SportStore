package com.sport_store.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sport_store.backend.dto.NhaCungCapDTO;
import com.sport_store.backend.entity.NhaCungCap;
import com.sport_store.backend.repository.NhaCungCapRepository;

@Service
public class NhaCungCapService {
    @Autowired
    private NhaCungCapRepository nhaCungCapRepository;

    @Transactional
    public Page<NhaCungCapDTO> getNhaCungCaps(String keyword, Pageable pageable) {
        Specification<NhaCungCap> spec = (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return cb.conjunction(); // Không lọc
            }

            String likeKeyword = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("tenNCC")), likeKeyword),
                    cb.like(cb.lower(root.get("diaChi")), likeKeyword),
                    cb.like(cb.lower(root.get("sdt")), likeKeyword),
                    cb.like(cb.lower(root.get("email")), likeKeyword));
        };

        Page<NhaCungCap> page = nhaCungCapRepository.findAll(spec, pageable);

        return page.map(nhaCungCap -> {
            NhaCungCapDTO dto = new NhaCungCapDTO();
            dto.setId(nhaCungCap.getId());
            dto.setTenNhaCungCap(nhaCungCap.getTenNCC());
            dto.setDiaChi(nhaCungCap.getDiaChi());
            dto.setSdt(nhaCungCap.getSdt());
            dto.setEmail(nhaCungCap.getEmail());
            return dto;
        });
    }

    // lấy tất cả sản phẩm không phân trang 
    public List<NhaCungCapDTO> getAllNhaCungCap() {
        return nhaCungCapRepository.findAll().stream().map(nhaCungCap -> {
            NhaCungCapDTO dto = new NhaCungCapDTO();
            dto.setId(nhaCungCap.getId());
            dto.setTenNhaCungCap(nhaCungCap.getTenNCC());
            dto.setDiaChi(nhaCungCap.getDiaChi());
            dto.setSdt(nhaCungCap.getSdt());
            dto.setEmail(nhaCungCap.getEmail());
            return dto;
        }).toList();
    }

}
