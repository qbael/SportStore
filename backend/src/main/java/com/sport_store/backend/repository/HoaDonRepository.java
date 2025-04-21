package com.sport_store.backend.repository;

import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.projection.HoaDonFullProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HoaDonRepository extends JpaRepository<HoaDon, Integer>, JpaSpecificationExecutor<HoaDon> {
    List<HoaDonFullProjection> findAllBy();

    Optional<HoaDonFullProjection> findById(int id);

    List<HoaDon> findByNgayBetween(LocalDate from, LocalDate to);

    @Query("SELECT MIN(h.ngay) FROM HoaDon h")
    LocalDate findMinNgay();

    @Query(value = """
            SELECT bt.sanpham AS sanPhamId,
                   bt.id AS bienTheId,
                   bt.tenbienthe AS tenBienThe,
                   bt.hinhanh AS hinhAnh,
                   ct.gianhap AS giaNhap,
                   ct.giaban AS giaBan,
                   SUM(ct.soluong) AS tongSoLuongBan,
                   SUM(ct.gianhap * ct.soluong) AS tongSoTienNhap,
                   SUM(ct.giaban * ct.soluong) AS tongSoTienBan,
                   ((SUM(ct.giaban * ct.soluong) - SUM(ct.gianhap * ct.soluong)) * 100.0 / SUM(ct.gianhap * ct.soluong)) AS phanTramLoiNhuan
            FROM hoadon hd
                JOIN cthoadon ct ON hd.id = ct.hoadon
                JOIN bienthe bt ON ct.bienthe = bt.id
            WHERE hd.trangthai = 'DAGIAO'
                AND hd.ngay BETWEEN :from AND :to
            GROUP BY bt.sanpham, bt.id, ct.giaban, ct.gianhap
            ORDER BY
            CASE WHEN :sortBy = 'sanPhamId' AND :sortDir = 'ASC' THEN sanPhamId END ,
            CASE WHEN :sortBy = 'tongSoLuongBan' AND :sortDir = 'ASC' THEN tongSoLuongBan END ,
            CASE WHEN :sortBy = 'tongSoLuongBan' AND :sortDir = 'DESC' THEN tongSoLuongBan END DESC,
            CASE WHEN :sortBy = 'tongSoTienNhap' AND :sortDir = 'ASC' THEN tongSoTienNhap END ,
            CASE WHEN :sortBy = 'tongSoTienNhap' AND :sortDir = 'DESC' THEN tongSoTienNhap END DESC,
            CASE WHEN :sortBy = 'tongSoTienBan' AND :sortDir = 'ASC' THEN tongSoTienBan END ,
            CASE WHEN :sortBy = 'tongSoTienBan' AND :sortDir = 'DESC' THEN tongSoTienBan END DESC,
            CASE WHEN :sortBy = 'phanTramLoiNhuan' AND :sortDir = 'ASC' THEN phanTramLoiNhuan END ,
            CASE WHEN :sortBy = 'phanTramLoiNhuan' AND :sortDir = 'DESC' THEN phanTramLoiNhuan END DESC
            """, nativeQuery = true)
    List<Object[]> thongKeTheoGiaBanSanPham(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("sortBy") String sortBy,
            @Param("sortDir") String sortDir
    );

    @Query(value = """
            SELECT kh.id AS id,
                   kh.hoten AS hoTen,
                   kh.sdt AS sdt,
                   tk.email AS email,
                   COUNT(hd.id) AS soDonHang,
                   SUM(hd.tonggiaban) AS tongTienMua
            FROM hoadon hd
            JOIN ttkhachhang kh ON hd.ttkhachhang = kh.id
            JOIN taikhoan tk ON kh.taikhoan = tk.id
            WHERE hd.trangthai = 'DAGIAO'
                AND hd.ngay BETWEEN :from AND :to
            GROUP BY kh.id
            ORDER BY tongTienMua DESC
            """, nativeQuery = true)
    List<Object[]> thongKeKhachHangTheoTienMua(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
}