import {HanhDong, TenChucVu} from "../Enum.tsx";

export type Quyen = {
    id: number;
    chucNang: {
        id: number;
        tenChucNang: string;
    }
    hanhDong: HanhDong;
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