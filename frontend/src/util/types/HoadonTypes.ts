type BienThe = {
    id: number;
    tenBienThe: string;
    hinhAnh: string;
    soLuongTon: number;
};

type CTHoaDon = {
    id: number;
    soLuong: number;
    giaBan: number;
    giaNhap: number;
    bienThe: BienThe;
};

type TaiKhoan = {
    id: number;
    username: string;
};

type ThongTinKhachHang = {
    id: number;
    hoTen: string;
    diaChi: string;
    sdt: number;
    taiKhoan: TaiKhoan;
};

type HoaDon = {
    id: number;
    ngay: string;
    dsCTHoaDon: CTHoaDon[];
    ttKhachHang: ThongTinKhachHang;
    tongGiaNhap: number;
    tongGiaBan: number;
    trangThai: string;
};

type ApiResponse = {
    data: HoaDon[];
    message: string;
    status: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    totalElements: number;
  };


export type { HoaDon, CTHoaDon, ThongTinKhachHang, TaiKhoan, ApiResponse };