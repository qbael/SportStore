package com.sport_store.backend.repository;

import com.sport_store.backend.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {
}