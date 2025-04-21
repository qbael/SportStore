package com.sport_store.backend.repository;

import com.sport_store.backend.entity.CTHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CTHoaDonRepository extends JpaRepository<CTHoaDon, Integer> {
    boolean existsByBienThe_SanPham_Id(int sanPhamId);
    boolean existsByBienThe_Id(int bienTheId);
}