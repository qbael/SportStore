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

// trạng thái hóa đơn emun
enum TrangThaiHoaDon {
    DANGXULY = "Đang xử lý",
    DANGGIAO = "Đang giao",
    DAHUY = "Đã hủy",
    DAGIAO = "Đã giao"
}

type ThongTinKhachHang = {
    id: number;
    hoTen: string;
    diaChi: string;
    sdt: string;
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


export type { HoaDon, CTHoaDon, ThongTinKhachHang, TaiKhoan, ApiResponse , TrangThaiHoaDon, BienThe};