package com.sport_store.backend.repository;

import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.projection.HoaDonFullProjection;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
       List<HoaDonFullProjection> findAllBy();
       Optional<HoaDonFullProjection> findById(int id);
}