package com.sport_store.backend.entity.Enum;

import lombok.Getter;

@Getter
public enum TenChucVu {
    ADMIN("Admin"),
    NHAN_VIEN_BAN_HANG("Nhân viên bán hàng"),
    NHAN_VIEN_KHO("Nhân viên kho"),
    QUAN_LY_DOANH_NGHIEP("Quản lý doanh nghiệp");

    private final String value;

    TenChucVu(String value) {
        this.value = value;
    }

    public static TenChucVu fromValue(String value) {
        for (TenChucVu role : TenChucVu.values()) {
            if (role.value.equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
