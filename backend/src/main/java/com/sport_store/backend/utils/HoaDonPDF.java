package com.sport_store.backend.utils;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.sport_store.backend.entity.CTHoaDon;
import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.entity.TTKhachHang;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;

public class HoaDonPDF {

    public static byte[] generatePDF(HoaDon hoaDon) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            // Tạo document
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            // Font hỗ trợ tiếng Việt
            BaseFont bf = BaseFont.createFont("fonts/arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font fontTitle = new Font(bf, 16, Font.BOLD);
            Font fontNormal = new Font(bf, 12);
            Font fontBold = new Font(bf, 12, Font.BOLD);

            // Tiêu đề
            Paragraph title = new Paragraph("HÓA ĐƠN BÁN HÀNG", fontTitle);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            // Thông tin hóa đơn
            document.add(new Paragraph("Mã hóa đơn: " + hoaDon.getId(), fontNormal));
            document.add(new Paragraph("Ngày: " + hoaDon.getNgay(), fontNormal));
            document.add(new Paragraph("Trạng thái: " + hoaDon.getTrangThai(), fontNormal));
            document.add(new Paragraph(" "));

            // Thông tin khách hàng
            TTKhachHang khachHang = hoaDon.getTtKhachHang();
            document.add(new Paragraph("THÔNG TIN KHÁCH HÀNG", fontBold));
            document.add(new Paragraph("Họ tên: " + khachHang.getHoTen(), fontNormal));
            document.add(new Paragraph("Địa chỉ: " + khachHang.getDiaChi(), fontNormal));
            document.add(new Paragraph("SĐT: " + khachHang.getSdt(), fontNormal));
            // document.add(new Paragraph("Tài khoản: " + khachHang.getTaiKhoan().getUsername(), fontNormal));
            document.add(new Paragraph(" "));

            // Bảng chi tiết hóa đơn
            PdfPTable table = new PdfPTable(5); // 5 cột: STT, Sản phẩm, Số lượng, Đơn giá, Thành tiền
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1, 4, 1, 2, 2});

            // Tiêu đề bảng
            addTableHeader(table, fontBold, "STT", "Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền");

            // Định dạng số tiền
            DecimalFormat formatter = new DecimalFormat("#,### VNĐ");

            // Dữ liệu sản phẩm
            int stt = 1;
            for (CTHoaDon ctHoaDon : hoaDon.getDsCTHoaDon()) {
                PdfPCell cell;
                cell = new PdfPCell(new Phrase(String.valueOf(stt++), fontNormal));
                table.addCell(cell);
                cell = new PdfPCell(new Phrase(ctHoaDon.getBienThe().getTenBienThe(), fontNormal));
                table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(ctHoaDon.getSoLuong()), fontNormal));
                table.addCell(cell);
                cell = new PdfPCell(new Phrase(formatter.format(ctHoaDon.getGiaBan()), fontNormal));
                table.addCell(cell);
                long thanhTien = (long) ctHoaDon.getSoLuong() * ctHoaDon.getGiaBan();
                cell = new PdfPCell(new Phrase(formatter.format(thanhTien), fontNormal));
                table.addCell(cell);
            }

            document.add(table);
            document.add(new Paragraph(" "));

            // Tổng tiền
            document.add(new Paragraph("Tổng giá bán: " + formatter.format(hoaDon.getTongGiaBan()), fontBold));

            document.close();
        } catch (DocumentException | IOException e) {
            e.printStackTrace();
        }
        return baos.toByteArray();
    }

    private static void addTableHeader(PdfPTable table, Font font, String... headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, font));
            cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
            table.addCell(cell);
        }
    }
}