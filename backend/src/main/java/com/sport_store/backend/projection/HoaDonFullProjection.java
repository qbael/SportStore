package com.sport_store.backend.projection;

import java.time.LocalDate;
import java.util.List;

public interface HoaDonFullProjection {
    Integer getId();
    LocalDate getNgay();
    Integer getTongGiaNhap();
    Integer getTongGiaBan();
    String getTrangThai();

    TTKhachHangInfo getTtKhachHang();

    List<ChiTietHoaDonInfo> getDsCTHoaDon();

    interface TTKhachHangInfo {
        Integer getId();
        String getHoTen();
        Integer getSdt();
        String getDiaChi();

        TaiKhoanInfo getTaiKhoan();

        interface TaiKhoanInfo {
            Integer getId();
            String getUsername();
        }
    }

    interface ChiTietHoaDonInfo {
        Integer getId();
        Integer getSoLuong();
        Integer getGiaBan();
        Integer getGiaNhap();

        BienTheInfo getBienThe();

        interface BienTheInfo {
            Integer getId();
            String getTenBienThe();
            String getHinhAnh();
            Integer getSoLuongTon();
        }
    }
}