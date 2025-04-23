package com.sport_store.backend.repository;

import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.projection.HoaDonFullProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.sport_store.backend.entity.Enum.TrangThaiHoaDon;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {

        // Sử dụng findAll với Pageable để phân trang
        Page<HoaDonFullProjection> findAllProjectedBy(Pageable pageable);

        List<HoaDonFullProjection> findAllBy();

        Optional<HoaDonFullProjection> findById(int id);
        Optional<HoaDon> findByid(int id);

        // tìm hóa đơn theo id khách hàng
        @Query("SELECT h FROM HoaDon h " +
                        "JOIN h.ttKhachHang tt " +
                        "JOIN tt.taiKhoan tk " +
                        "WHERE tk.username = :username")
        List<HoaDonFullProjection> findByIdKhachHang(@Param("username") String username);

        Optional<HoaDon> findById(Integer id);

        // all in one
        @Query("SELECT h FROM HoaDon h " +
                        "JOIN h.ttKhachHang kh " +
                        "WHERE (:id IS NULL OR h.id = :id) " +
                        "AND (:ngay IS NULL OR h.ngay = :ngay) " +
                        "AND (:ngayTu IS NULL OR h.ngay >= :ngayTu) " +
                        "AND (:ngayDen IS NULL OR h.ngay <= :ngayDen) " +
                        "AND (:tenKhachHang IS NULL OR LOWER(kh.hoTen) LIKE LOWER(CONCAT('%', :tenKhachHang, '%'))) " +
                        "AND (:trangThai IS NULL OR h.trangThai = :trangThai) " +
                        "AND (:soDienThoai IS NULL OR kh.sdt LIKE CONCAT('%', :soDienThoai, '%')) " +
                        "AND (:minTongGiaBan IS NULL OR h.tongGiaBan >= :minTongGiaBan) " +
                        "AND (:maxTongGiaBan IS NULL OR h.tongGiaBan <= :maxTongGiaBan)")
        Page<HoaDonFullProjection> searchHoaDon(
                        @Param("id") Integer id,
                        @Param("ngay") LocalDate ngay,
                        @Param("ngayTu") LocalDate ngayTu,
                        @Param("ngayDen") LocalDate ngayDen,
                        @Param("tenKhachHang") String tenKhachHang,
                        @Param("trangThai") TrangThaiHoaDon trangThai,
                        @Param("soDienThoai") String soDienThoai,
                        @Param("minTongGiaBan") Integer minTongGiaBan,
                        @Param("maxTongGiaBan") Integer maxTongGiaBan,
                        Pageable pageable);

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
                        @Param("sortDir") String sortDir);

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
                        @Param("to") LocalDate to);
}