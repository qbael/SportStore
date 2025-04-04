package com.sport_store.backend.repository;

import com.sport_store.backend.entity.BienThe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BienTheRepository extends JpaRepository<BienThe, Integer> {
    @Query(value = "SELECT b.* FROM bienthe b " +
            "WHERE b.sanpham = :sanPhamId", nativeQuery = true)
    List<BienThe> findAllBySanPhamId(@Param("sanPhamId") int sanPhamId);
}