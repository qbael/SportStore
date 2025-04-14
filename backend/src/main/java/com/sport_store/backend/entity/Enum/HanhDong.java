package com.sport_store.backend.entity.Enum;

import lombok.Getter;

@Getter
public enum HanhDong {
    XEM("Xem"),
    THEM("Thêm"),
    SUA("Sửa"),
    XOA("Xóa");

    private final String value;

    HanhDong(String value) {
        this.value = value;
    }

    public static HanhDong fromValue(String value) {
        for (HanhDong hanhDong : HanhDong.values()) {
            if (hanhDong.value.equalsIgnoreCase(value)) {
                return hanhDong;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }

}
