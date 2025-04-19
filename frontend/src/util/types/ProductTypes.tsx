export type DanhMucType = {
    id: number;
    loai: string;
}

export type BoMonType = {
    id: number;
    tenBoMon: string;
}

export type NhaCungCapType = {
    id: number;
    tenNCC: string;
    diaChi: string;
    sdt: string;
    email: string;
}

export type thuongHieuType = {
    id: number;
    tenThuongHieu: string;
}

export type ProductType = {
    id: number;
    tenSanPham: string;
    hinhAnh: string;
    giaBan?: number;
    giaNhap?: number;
    moTa: string;
    trangThai: boolean;
    danhMuc: DanhMucType;
    thuongHieu: thuongHieuType
    boMon: BoMonType
    nhaCungCap: NhaCungCapType;
}

export type SizeType = {
    id: number;
    size: string;
}

export type MauType = {
    id: number;
    tenMau: string;
}

export type BienTheType = {
    id: number;
    tenBienThe: string;
    hinhAnh: string;
    soLuongTon: number;
    size: SizeType | null;
    mau: MauType | null;
}

export type ChiTietSanPhamType = {
    sanPham: ProductType | null;
    bienThe: BienTheType[];
}

export type dsFull = {
    dsThuongHieu: thuongHieuType[];
    dsDanhMuc: DanhMucType[];
    dsBoMon: BoMonType[];
    dsNhaCungCap: NhaCungCapType[];
}