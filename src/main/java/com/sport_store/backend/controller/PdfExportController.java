package com.sport_store.backend.controller;

import com.itextpdf.text.DocumentException;
import com.sport_store.backend.service.PdfExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/export-pdf")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PdfExportController {

    private final PdfExportService pdfExportService;

    @GetMapping("/doanh-thu")
    public ResponseEntity<byte[]> exportDoanhThuPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        try {
            byte[] pdfBytes = pdfExportService.exportDoanhThuToPdf(fromDate, toDate);
            return createPdfResponse(pdfBytes, "thong_ke_doanh_thu.pdf");
        } catch (DocumentException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/san-pham")
    public ResponseEntity<byte[]> exportSanPhamPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false, defaultValue = "tongSoLuongBan") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir) {
        try {
            byte[] pdfBytes = pdfExportService.exportSanPhamToPdf(fromDate, toDate, sortBy, sortDir);
            return createPdfResponse(pdfBytes, "thong_ke_san_pham.pdf");
        } catch (DocumentException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/khach-hang")
    public ResponseEntity<byte[]> exportKhachHangPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        try {
            byte[] pdfBytes = pdfExportService.exportKhachHangToPdf(fromDate, toDate);
            return createPdfResponse(pdfBytes, "thong_ke_khach_hang.pdf");
        } catch (DocumentException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/nhap-hang")
    public ResponseEntity<byte[]> exportNhapHangPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false, defaultValue = "tongSoTienNhap") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir) {
        try {
            byte[] pdfBytes = pdfExportService.exportNhapHangToPdf(fromDate, toDate, sortBy, sortDir);
            return createPdfResponse(pdfBytes, "thong_ke_nhap_hang.pdf");
        } catch (DocumentException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ResponseEntity<byte[]> createPdfResponse(byte[] pdfBytes, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}