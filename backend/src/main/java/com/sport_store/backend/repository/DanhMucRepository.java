package com.sport_store.backend.repository;

import com.sport_store.backend.entity.DanhMuc;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DanhMucRepository extends JpaRepository<DanhMuc, Integer> {
}