package com.sport_store.backend.repository;

import com.sport_store.backend.entity.BienThe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BienTheRepository extends JpaRepository<BienThe, Integer> {
    @Query("SELECT b FROM BienThe b WHERE b.sanPham.id = :id")
    List<BienThe> findAllBySanPhamId(@Param("id") int sanPhamId);
}