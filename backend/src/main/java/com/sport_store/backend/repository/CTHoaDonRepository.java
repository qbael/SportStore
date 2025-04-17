package com.sport_store.backend.repository;

import com.sport_store.backend.entity.CTHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CTHoaDonRepository extends JpaRepository<CTHoaDon, Integer> {
    boolean existsByBienThe_SanPham_Id(int sanPhamId);
}