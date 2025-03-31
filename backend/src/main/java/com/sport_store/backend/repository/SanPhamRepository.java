package com.sport_store.backend.repository;

import com.sport_store.backend.entity.SanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer>, JpaSpecificationExecutor<SanPham> {
    @Query("SELECT s, b.tenBoMon, d.loai, t.tenThuongHieu FROM SanPham s " +
            "JOIN s.boMon b " +
            "JOIN s.danhMuc d " +
            "JOIN s.thuongHieu t ")
    @Override
    Page<SanPham> findAll(Specification<SanPham> spec, Pageable pageable);
}