package com.sport_store.backend.repository;

import com.sport_store.backend.entity.NhapHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface NhapHangRepository extends JpaRepository<NhapHang, Integer>, JpaSpecificationExecutor<NhapHang> {
    @Query("SELECT MIN(n.ngay) FROM NhapHang n")
    LocalDate findMinNgay();

    @Query(value = """
            SELECT bt.sanpham AS sanPhamId,
                   bt.id AS bienTheId,
                   bt.tenbienthe AS tenBienThe,
                   bt.hinhanh AS hinhAnh,
                   ctnh.gianhap AS giaNhap,
                   SUM(ctnh.soluong) AS tongSoLuongNhap,
                   SUM(ctnh.soluong * ctnh.gianhap) AS tongSoTienNhap
            FROM nhaphang n
                JOIN ctnhaphang ctnh ON n.id = ctnh.nhaphang
                JOIN bienthe bt ON ctnh.bienthe = bt.id
            WHERE n.trangthai = 'DAGIAO'
                AND n.ngay BETWEEN :from AND :to
            GROUP BY bt.sanpham, bt.id, ctnh.gianhap
            ORDER BY
            CASE WHEN :sortBy = 'sanPhamId' AND :sortDir = 'ASC' THEN sanPhamId END ,
            CASE WHEN :sortBy = 'giaNhap' AND :sortDir = 'ASC' THEN giaNhap END ,
            CASE WHEN :sortBy = 'giaNhap' AND :sortDir = 'DESC' THEN giaNhap END DESC,
            CASE WHEN :sortBy = 'tongSoLuongNhap' AND :sortDir = 'ASC' THEN tongSoLuongNhap END ,
            CASE WHEN :sortBy = 'tongSoLuongNhap' AND :sortDir = 'DESC' THEN tongSoLuongNhap END DESC,
            CASE WHEN :sortBy = 'tongSoTienNhap' AND :sortDir = 'ASC' THEN tongSoTienNhap END ,
            CASE WHEN :sortBy = 'tongSoTienNhap' AND :sortDir = 'DESC' THEN tongSoTienNhap END DESC
            """, nativeQuery = true)
    List<Object[]> thongKeNhapHangTheoGiaNhap(@Param("from") LocalDate from,
                                              @Param("to") LocalDate to,
                                              @Param("sortBy") String sortBy,
                                              @Param("sortDir") String sortDir);
}