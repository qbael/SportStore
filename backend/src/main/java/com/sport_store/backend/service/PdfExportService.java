package com.sport_store.backend.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.sport_store.backend.dto.ThongKeKhachHangDTO;
import com.sport_store.backend.dto.ThongKeNhapHangDTO;
import com.sport_store.backend.dto.ThongKeSanPhamDTO;
import com.sport_store.backend.repository.HoaDonRepository;
import com.sport_store.backend.repository.NhapHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfExportService {

    private static final Font TITLE_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 10, Font.NORMAL);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ThongKeService thongKeService;
    private final HoaDonRepository hoaDonRepository;
    private final NhapHangRepository nhapHangRepository;

    public byte[] exportSanPhamToPdf(LocalDate fromDate, LocalDate toDate, String sortBy, String sortDir) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();
            addMetadata(document, "Thong ke san pham");


            if (fromDate == null) {
                fromDate = hoaDonRepository.findMinNgay();
            }
            if (toDate == null) {
                toDate = LocalDate.now();
            }
            // Title
            addTitle(document, "Thong ke san pham ban chay", fromDate, toDate);

            // Sort info
            if (sortBy != null && !sortBy.isEmpty()) {
                String sortLabel = getSortByLabel(sortBy);
                String sortDirLabel = "ASC".equals(sortDir) ? "tang dan" : "giam dan";
                Paragraph sortInfo = new Paragraph(
                        "Sap xep theo: " + sortLabel + " (" + sortDirLabel + ")",
                        NORMAL_FONT
                );
                sortInfo.setSpacingAfter(10f);
                document.add(sortInfo);
            }

            // Table
            PdfPTable table = new PdfPTable(9);
            table.setWidthPercentage(100);
            table.setSpacingBefore(9f);

            // Set column widths
            float[] columnWidths = {0.6f, 0.6f, 2.0f, 1.2f, 1.2f, 1.0f, 1.2f, 1.2f, 1.0f};
            table.setWidths(columnWidths);

            // Headers
            addTableHeader(table, new String[]{
                    "Ma SP", "Ma BT", "Ten san pham", "Gia nhap (VND)",
                    "Gia ban (VND)", "SL ban", "Tong tien nhap (VND)",
                    "Tong tien ban (VND)", "% Loi nhuan"
            });

            // Data rows
            List<ThongKeSanPhamDTO> sanPhamList = thongKeService.thongKeSanPham(fromDate, toDate, sortBy, sortDir);
            for (ThongKeSanPhamDTO sp : sanPhamList) {
                table.addCell(new Phrase(String.valueOf(sp.getSanPhamId()), NORMAL_FONT));
                table.addCell(new Phrase(String.valueOf(sp.getBienTheId()), NORMAL_FONT));
                table.addCell(new Phrase(sp.getTenBienThe(), NORMAL_FONT));
                table.addCell(new Phrase(formatCurrency(sp.getGiaNhap()), NORMAL_FONT));
                table.addCell(new Phrase(formatCurrency(sp.getGiaBan()), NORMAL_FONT));
                table.addCell(new Phrase(String.valueOf(sp.getTongSoLuongBan()), NORMAL_FONT));
                table.addCell(new Phrase(formatCurrency(sp.getTongSoTienNhap()), NORMAL_FONT));
                table.addCell(new Phrase(formatCurrency(sp.getTongSoTienBan()), NORMAL_FONT));
                table.addCell(new Phrase(sp.getPhanTramLoiNhuan().toString() + "%", NORMAL_FONT));
            }

            document.add(table);

        } finally {
            document.close();
        }

        return out.toByteArray();
    }

    public byte[] exportKhachHangToPdf(LocalDate fromDate, LocalDate toDate) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();
            addMetadata(document, "Thong ke khach hang");

            if (fromDate == null) {
                fromDate = hoaDonRepository.findMinNgay();
            }
            if (toDate == null) {
                toDate = LocalDate.now();
            }
            // Title
            addTitle(document, "Thong ke khach hang theo tong tien mua", fromDate, toDate);

            // Table
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);

            // Set column widths
            float[] columnWidths = {0.5f, 2.0f, 1.5f, 2.5f, 1.0f, 1.5f};
            table.setWidths(columnWidths);

            // Headers
            addTableHeader(table, new String[]{
                    "STT", "Ho ten", "SDT", "Email", "So don hang", "Tong tien mua (VND)"
            });

            // Data rows
            List<ThongKeKhachHangDTO> khachHangList = thongKeService.thongKeKhachHang(fromDate, toDate);
            int stt = 1;
            for (ThongKeKhachHangDTO kh : khachHangList) {
                table.addCell(new Phrase(String.valueOf(stt++), NORMAL_FONT));
                table.addCell(new Phrase(kh.getHoTen(), NORMAL_FONT));
                table.addCell(new Phrase(kh.getSdt(), NORMAL_FONT));
                table.addCell(new Phrase(kh.getEmail(), NORMAL_FONT));
                table.addCell(new Phrase(String.valueOf(kh.getSoDonHang()), NORMAL_FONT));
                table.addCell(new Phrase(formatCurrency(kh.getTongTienMua()), NORMAL_FONT));
            }

            document.add(table);

        } finally {
            document.close();
        }

        return out.toByteArray();
    }

    public byte[] exportNhapHangToPdf(LocalDate fromDate, LocalDate toDate, String sortBy, String sortDir) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();
            addMetadata(document, "Thong ke nhap hang");

            if (fromDate == null) {
                fromDate = nhapHangRepository.findMinNgay();
            }
            if (toDate == null) {
                toDate = LocalDate.now();
            }
            // Title
            addTitle(document, "Thong ke nhap hang", fromDate, toDate);

            // Sort info
            if (sortBy != null && !sortBy.isEmpty()) {
                String sortLabel = getSortByLabelNhapHang(sortBy);
                String sortDirLabel = "ASC".equals(sortDir) ? "tang dan" : "giam dan";
                Paragraph sortInfo = new Paragraph(
                        "Sap xep theo: " + sortLabel + " (" + sortDirLabel + ")",
                        NORMAL_FONT
                );
                sortInfo.setSpacingAfter(10f);
                document.add(sortInfo);
            }

            // Table
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setSpacingBefore(9f);

            // Set column widths
            float[] columnWidths = {0.8f, 0.8f, 2.7f, 1.5f, 1.5f, 1.7f};
            table.setWidths(columnWidths);

            // Headers
            addTableHeader(table, new String[]{
                    "Ma SP", "Ma Bien The", "Ten Bien The",
                    "Gia nhap (VND)", "Tong SL nhap", "Tong tien nhap (VND)"
            });

            // Data rows
            List<ThongKeNhapHangDTO> nhapHangList = thongKeService.thongKeNhapHang(fromDate, toDate, sortBy, sortDir);
            for (ThongKeNhapHangDTO item : nhapHangList) {
                table.addCell(new Phrase(String.valueOf(item.getSanPhamId()), NORMAL_FONT));
                table.addCell(new Phrase(String.valueOf(item.getBienTheId()), NORMAL_FONT));
                table.addCell(new Phrase(item.getTenBienThe(), NORMAL_FONT));
                table.addCell(new Phrase(formatCurrency(item.getGiaNhap()), NORMAL_FONT));
                table.addCell(new Phrase(String.valueOf(item.getTongSoLuongNhap()), NORMAL_FONT));
                table.addCell(new Phrase(formatCurrency(item.getTongSoTienNhap()), NORMAL_FONT));
            }

            document.add(table);

        } finally {
            document.close();
        }

        return out.toByteArray();
    }

    private void addMetadata(Document document, String title) {
        document.addTitle(title);
        document.addCreator("Sport Store Application");
    }

    private void addTitle(Document document, String title, LocalDate fromDate, LocalDate toDate) throws DocumentException {
        Paragraph titleParagraph = new Paragraph(title, TITLE_FONT);
        titleParagraph.setAlignment(Element.ALIGN_CENTER);
        document.add(titleParagraph);

        String dateRange;
        if (fromDate != null && toDate != null) {
            dateRange = "Tu ngay " + fromDate.format(DATE_FORMATTER) + " den ngay " + toDate.format(DATE_FORMATTER);
        } else {
            dateRange = "Tat ca thoi gian";
        }

        Paragraph dateParagraph = new Paragraph(dateRange, HEADER_FONT);
        dateParagraph.setAlignment(Element.ALIGN_CENTER);
        dateParagraph.setSpacingAfter(20);
        document.add(dateParagraph);
    }

    private void addTableHeader(PdfPTable table, String[] headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, HEADER_FONT));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPaddingTop(5);
            cell.setPaddingBottom(5);
            table.addCell(cell);
        }
    }

    private String formatCurrency(int amount) {
        return String.format("%,d", amount);
    }

    private String getSortByLabel(String sortBy) {
        return switch (sortBy) {
            case "tongSoLuongBan" -> "So luong ban";
            case "tongSoTienNhap" -> "Tong tien nhap";
            case "tongSoTienBan" -> "Tong tien ban";
            case "phanTramLoiNhuan" -> "Phan tram loi nhuan";
            default -> sortBy;
        };
    }

    private String getSortByLabelNhapHang(String sortBy) {
        return switch (sortBy) {
            case "giaNhap" -> "Gia nhap";
            case "tongSoLuongNhap" -> "Tong so luong nhap";
            case "tongSoTienNhap" -> "Tong tien nhap";
            default -> sortBy;
        };
    }
}