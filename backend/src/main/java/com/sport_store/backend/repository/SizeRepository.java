package com.sport_store.backend.repository;

import com.sport_store.backend.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SizeRepository extends JpaRepository<Size, Integer> {
    boolean existsBySize(String tenSize);
}