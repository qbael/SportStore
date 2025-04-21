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
  email: string;
};

type NhapHang = {
  id: number;
  ngay: string;
  tongGiaNhap: number;
  nhanVien: NhanVien;
  nhaCungCap: NhaCungCap;
  trangThai: string;
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

type NhaCungCapResponse = {
  content: NhaCungCap[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
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
  NhaCungCapResponse,
};
