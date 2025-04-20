type CTNhapHang = {
    id: number;
    soLuong: number;
    giaNhap: number;
    idbienthe: number;
    tenBienthe: string;
    hinhanh: string;
  };
  
  type NhanVien = {
    id: number;
    hoTen: string;
    ngaySinh: string;
    diaChi: string;
    email: string;
    sdt: number;
  };
  
  type NhaCungCap = {
    id: number;
    tenNhaCungCap: string;
    diaChi: string;
    sdt: string;
  };
  
  type NhapHang = {
    id: number;
    ngay: string;
    tongGiaNhap: number;
    nhanVien: NhanVien;
    nhaCungCap: NhaCungCap;
    dsCTNhapHang: CTNhapHang[];
  };
  
  type NhapHangResponse = {
    content: NhapHang[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      offset: number;
      paged: boolean;
      unpaged: boolean;
      sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
      };
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
  
  export type {
    NhapHang,
    CTNhapHang,
    NhanVien,
    NhaCungCap,
    NhapHangResponse,
  };
  