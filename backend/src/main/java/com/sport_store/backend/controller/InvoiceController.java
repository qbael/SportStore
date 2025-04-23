package com.sport_store.backend.controller;

import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.repository.HoaDonRepository;
import com.sport_store.backend.utils.HoaDonPDF;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @GetMapping("/{id}/download-pdf")
    public ResponseEntity<Resource> downloadInvoicePDF(@PathVariable int id) {
        // Lấy HoaDon từ database
        HoaDon hoaDon = hoaDonRepository.findByid(id)
                .orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại"));

        // Tạo PDF từ HoaDon
        byte[] pdfBytes = HoaDonPDF.generatePDF(hoaDon);

        // Chuẩn bị file PDF để tải
        ByteArrayResource resource = new ByteArrayResource(pdfBytes);

        // Thiết lập header để tải file
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=HoaDon_" + id + ".pdf");
        headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
        headers.add(HttpHeaders.PRAGMA, "no-cache");
        headers.add(HttpHeaders.EXPIRES, "0");

        // Trả về response với file PDF
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(pdfBytes.length)
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}