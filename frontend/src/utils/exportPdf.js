/**
 * Các hàm hỗ trợ xuất PDF từ backend
 */

import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * Tải file PDF từ API và hiển thị cho người dùng lưu hoặc mở
 * @param {Blob} blob - Nội dung file PDF
 * @param {string} filename - Tên file được đề xuất 
 */
const downloadPdf = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Xuất báo cáo doanh thu dưới dạng PDF
 * @param {Date|null} fromDate - Ngày bắt đầu thống kê
 * @param {Date|null} toDate - Ngày kết thúc thống kê
 */
export const exportDoanhThuPdf = async (fromDate, toDate) => {
  try {
    // Chuyển đổi date object sang chuỗi theo định dạng ISO (YYYY-MM-DD)
    const fromDateStr = fromDate ? fromDate.toISOString().split('T')[0] : null;
    const toDateStr = toDate ? toDate.toISOString().split('T')[0] : null;
    
    // Tạo chuỗi query params
    let url = `${API_BASE_URL}/export-pdf/doanh-thu`;
    const params = [];
    if (fromDateStr) params.push(`fromDate=${fromDateStr}`);
    if (toDateStr) params.push(`toDate=${toDateStr}`);
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    const response = await axios.get(url, {
      responseType: 'blob'
    });
    
    downloadPdf(response.data, 'thong_ke_doanh_thu.pdf');
    return true;
  } catch (error) {
    console.error('Error exporting doanh thu PDF:', error);
    return false;
  }
};

/**
 * Xuất báo cáo sản phẩm dưới dạng PDF
 * @param {Date|null} fromDate - Ngày bắt đầu thống kê
 * @param {Date|null} toDate - Ngày kết thúc thống kê
 * @param {string} sortBy - Trường sắp xếp
 * @param {string} sortDir - Hướng sắp xếp (ASC/DESC)
 */
export const exportSanPhamPdf = async (fromDate, toDate, sortBy = 'tongSoLuongBan', sortDir = 'DESC') => {
  try {
    // Chuyển đổi date object sang chuỗi theo định dạng ISO (YYYY-MM-DD)
    const fromDateStr = fromDate ? fromDate.toISOString().split('T')[0] : null;
    const toDateStr = toDate ? toDate.toISOString().split('T')[0] : null;
    
    // Tạo chuỗi query params
    let url = `${API_BASE_URL}/export-pdf/san-pham`;
    const params = [];
    if (fromDateStr) params.push(`fromDate=${fromDateStr}`);
    if (toDateStr) params.push(`toDate=${toDateStr}`);
    params.push(`sortBy=${sortBy}`);
    params.push(`sortDir=${sortDir}`);
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    const response = await axios.get(url, {
      responseType: 'blob'
    });
    
    downloadPdf(response.data, 'thong_ke_san_pham.pdf');
    return true;
  } catch (error) {
    console.error('Error exporting san pham PDF:', error);
    return false;
  }
};

/**
 * Xuất báo cáo khách hàng dưới dạng PDF
 * @param {Date|null} fromDate - Ngày bắt đầu thống kê
 * @param {Date|null} toDate - Ngày kết thúc thống kê
 */
export const exportKhachHangPdf = async (fromDate, toDate) => {
  try {
    // Chuyển đổi date object sang chuỗi theo định dạng ISO (YYYY-MM-DD)
    const fromDateStr = fromDate ? fromDate.toISOString().split('T')[0] : null;
    const toDateStr = toDate ? toDate.toISOString().split('T')[0] : null;
    
    // Tạo chuỗi query params
    let url = `${API_BASE_URL}/export-pdf/khach-hang`;
    const params = [];
    if (fromDateStr) params.push(`fromDate=${fromDateStr}`);
    if (toDateStr) params.push(`toDate=${toDateStr}`);
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    const response = await axios.get(url, {
      responseType: 'blob'
    });
    
    downloadPdf(response.data, 'thong_ke_khach_hang.pdf');
    return true;
  } catch (error) {
    console.error('Error exporting khach hang PDF:', error);
    return false;
  }
};

/**
 * Xuất báo cáo nhập hàng dưới dạng PDF
 * @param {Date|null} fromDate - Ngày bắt đầu thống kê
 * @param {Date|null} toDate - Ngày kết thúc thống kê
 * @param {string} sortBy - Trường sắp xếp
 * @param {string} sortDir - Hướng sắp xếp (ASC/DESC)
 */
export const exportNhapHangPdf = async (fromDate, toDate, sortBy = 'tongSoTienNhap', sortDir = 'DESC') => {
  try {
    // Chuyển đổi date object sang chuỗi theo định dạng ISO (YYYY-MM-DD)
    const fromDateStr = fromDate ? fromDate.toISOString().split('T')[0] : null;
    const toDateStr = toDate ? toDate.toISOString().split('T')[0] : null;
    
    // Tạo chuỗi query params
    let url = `${API_BASE_URL}/export-pdf/nhap-hang`;
    const params = [];
    if (fromDateStr) params.push(`fromDate=${fromDateStr}`);
    if (toDateStr) params.push(`toDate=${toDateStr}`);
    params.push(`sortBy=${sortBy}`);
    params.push(`sortDir=${sortDir}`);
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    const response = await axios.get(url, {
      responseType: 'blob'
    });
    
    downloadPdf(response.data, 'thong_ke_nhap_hang.pdf');
    return true;
  } catch (error) {
    console.error('Error exporting nhap hang PDF:', error);
    return false;
  }
};