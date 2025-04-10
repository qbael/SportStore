package com.sport_store.backend.entity.Enum;

public enum TrangThaiHoaDon {
    DANGXULY("Đang xử lý"),
    DANGGIAO("Đang giao"),
    DAGIAO("Đã giao"),
    DAHUY("Đã hủy");

    private final String value;


    TrangThaiHoaDon(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }

    public static TrangThaiHoaDon fromValue(String value) {
        for (TrangThaiHoaDon trangThaiHoaDon : TrangThaiHoaDon.values()) {
            if (trangThaiHoaDon.value.equalsIgnoreCase(value)) {
                return trangThaiHoaDon;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
