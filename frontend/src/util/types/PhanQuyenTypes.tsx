import {HanhDong, TenChucVu} from "../Enum.tsx";

export type ChucNang = {
    id: number;
    tenChucNang: string;
};

export type Quyen = {
    [tenChucNang: string]: HanhDong[];
}

export type ChucVu = {
    id: number;
    tenChucVu: TenChucVu;
    quyenList: Quyen[];
}

export type TaiKhoanNhanVien = {
    id: number,
    hoTen: string;
    ngaySinh: Date;
    gioiTinh: boolean;
    diaChi: string;
    email: string;
    soDienThoai: number;
    chucVu: ChucVu;
    error: string;
}

export type NhanVien = {
    id: number;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: boolean;
    diaChi: string;
    email: string;
    sdt: number;
    chucVu: ChucVu;
}

export type NhanVienTheoChucVu = {
    [tenChucVu: string]: NhanVien[];
}