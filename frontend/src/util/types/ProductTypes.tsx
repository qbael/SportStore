export type danhMucType = {
    id: number;
    loai: string;
}

export type boMonType = {
    id: number;
    tenBoMon: string;
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
    danhMuc: danhMucType;
    thuongHieu: thuongHieuType
    boMon: boMonType
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
    dsDanhMuc: danhMucType[];
    dsBoMon: boMonType[];
}