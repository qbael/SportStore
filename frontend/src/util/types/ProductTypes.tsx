export type ProductType = {
    id: number,
    tenSanPham: string,
    hinhAnh: string,
    giaBan: number,
    giaNhap: number,
    moTa: string,
    trangThai: boolean,
    danhMuc: {
        id: number,
        loai: string
    },
    thuongHieu: {
        id: number,
        tenThuongHieu: string
    },
    boMon: {
        id: number,
        tenBoMon: string
    }
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