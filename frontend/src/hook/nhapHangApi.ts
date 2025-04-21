import { NhapHangResponse, NhaCungCapResponse } from "../util/types/NhapHangType";

type Params = {
  startDate?: string;       // yyyy-MM-dd
  endDate?: string;
  filterField?: string;
  filterValue?: string;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  page?: number;
  size?: number;
};

export async function fetchNhapHang(params: Params): Promise<NhapHangResponse> {
  const query = new URLSearchParams();

  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  if (params.filterField) query.append("filterField", params.filterField);
  if (params.filterValue) query.append("filterValue", params.filterValue);
  if (params.sortField) query.append("sortField", params.sortField);
  if (params.sortDirection) query.append("sortDirection", params.sortDirection);
  query.append("page", String(params.page ?? 0));
  query.append("size", String(params.size ?? 10));

  const response = await fetch(`http://localhost:8080/api/nhaphang/search?${query.toString()}`);

  if (!response.ok) {
    throw new Error("Lỗi khi fetch danh sách nhập hàng");
  }

  return await response.json();
}

// tạo pram khác 
type ParamsNhaCungCap = {
  keyword?: string;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  page?: number;
  size?: number;
};

export async function fetchNhaCungCap(params: ParamsNhaCungCap): Promise<NhaCungCapResponse> {
  const query = new URLSearchParams();

  // Cập nhật các tham số URL
  if (params.keyword) query.append("keyword", params.keyword);
  query.append("page", String(params.page ?? 0));
  query.append("size", String(params.size ?? 10));
  if (params.sortField && params.sortDirection) {
      query.append("sort", `${params.sortField},${params.sortDirection}`);
  }

  // Tạo URL với query string
  const response = await fetch(`http://localhost:8080/api/nhacungcap?${query.toString()}`);

  if (!response.ok) {
      throw new Error("Lỗi khi fetch danh sách nhà cung cấp");
  }

  return await response.json();
}

