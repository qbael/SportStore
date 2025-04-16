export enum HanhDong {
    XEM = "Xem",
    THEM = "Thêm",
    SUA = "Sửa",
    XOA = "Xóa"
}

export enum TenChucVu {
    ADMIN = "Admin",
    NHAN_VIEN_BAN_HANG = "Nhân viên bán hàng",
    NHAN_VIEN_KHO = "Nhân viên kho",
    QUAN_LY_DOANH_NGHIEP = "Quản lý doanh nghiệp"
}

export enum TenChucNang {
    QUAN_LY_SAN_PHAM = "Quản lý sản phẩm",
    QUAN_LY_NHAP_HANG = "Quản lý nhập hàng",
    QUAN_LY_HOA_DON = "Quản lý hóa đơn",
    QUAN_LY_TAI_KHOAN = "Quản lý tài khoản",
    QUAN_LY_QUYEN_HAN = "Quản lý quyền hạn",
    QUAN_LY_KHACH_HANG = "Quản lý khách hàng",
}

export const iconMap = new Map([
    [TenChucNang.QUAN_LY_SAN_PHAM, 'fa-solid fa-box-open'],
    [TenChucNang.QUAN_LY_NHAP_HANG, 'fa-solid fa-truck-field'],
    [TenChucNang.QUAN_LY_HOA_DON, 'fa-solid fa-file-invoice'],
    [TenChucNang.QUAN_LY_TAI_KHOAN, 'fa-solid fa-user'],
    [TenChucNang.QUAN_LY_QUYEN_HAN, 'fa-solid fa-user-shield'],
    [TenChucNang.QUAN_LY_KHACH_HANG, 'fa-solid fa-users'],
]);

export const getIconFromChucNang = (value: string): string | undefined => {
    return iconMap.get(value as TenChucNang);
}

export const mapToTenChucVu = (key: string): TenChucVu | undefined => {
    if (key in TenChucVu) {
        return TenChucVu[key as keyof typeof TenChucVu];
    }
    return undefined;
}

export const mapToHanhDong = (key: string): HanhDong | undefined => {
    if (key in HanhDong) {
        return HanhDong[key as keyof typeof HanhDong];
    }
    return undefined;
}
