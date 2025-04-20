package com.sport_store.backend.repository;

import com.sport_store.backend.entity.ChucNang;
import com.sport_store.backend.entity.ChucVu;
import com.sport_store.backend.entity.Enum.HanhDong;
import com.sport_store.backend.entity.Quyen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuyenRepository extends JpaRepository<Quyen, Integer> {

    boolean existsByChucVuAndChucNangAndHanhDong(ChucVu chucVu, ChucNang chucNang, HanhDong hanhDong);

    Optional<Quyen> findByChucVuAndChucNangAndHanhDong(ChucVu chucVu, ChucNang chucNang, HanhDong hanhDong);

    @Query("SELECT q.chucNang.tenChucNang, q.hanhDong FROM Quyen q WHERE q.chucVu.id = :chucVuId")
    List<Object[]> findByChucVuGroupByChucNang(@Param("chucVuId") Integer chucVuId);
}