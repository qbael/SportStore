package com.sport_store.backend.repository;

import com.sport_store.backend.entity.CTNhapHang;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CTNhapHangRepository extends JpaRepository<CTNhapHang, Integer> {
    boolean existsByBienThe_SanPham_Id(int sanPhamId);
}