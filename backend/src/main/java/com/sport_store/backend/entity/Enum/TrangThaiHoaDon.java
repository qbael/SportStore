package com.sport_store.backend.entity.Enum;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum TrangThaiHoaDon {
    DANGXULY("Đang xử lý"),
    DANGGIAO("Đang giao"),
    DAGIAO("Đã giao"),
    DAHUY("Đã hủy");

    private final String value;

    TrangThaiHoaDon(String value) {
        this.value = value;
    }

    @JsonCreator
    public static TrangThaiHoaDon fromValue(String value) {
        for (TrangThaiHoaDon trangThaiHoaDon : TrangThaiHoaDon.values()) {
            if (trangThaiHoaDon.value.equalsIgnoreCase(value)) {
                return trangThaiHoaDon;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}