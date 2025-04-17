package com.sport_store.backend.repository;

import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.projection.HoaDonFullProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {

    // Sử dụng findAll với Pageable để phân trang
    Page<HoaDonFullProjection> findAllProjectedBy(Pageable pageable);

    List<HoaDonFullProjection> findAllBy();

    Optional<HoaDonFullProjection> findById(int id);
}