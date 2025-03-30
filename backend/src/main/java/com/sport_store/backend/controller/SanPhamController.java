package com.sport_store.backend.controller;

import com.sport_store.backend.entity.SanPham;
import com.sport_store.backend.service.SanPhamService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("api/sanpham")
public class SanPhamController {
    public SanPhamService sanPhamService;

    public SanPhamController(SanPhamService sanPhamService) {
        this.sanPhamService = sanPhamService;
    }

    @GetMapping
    public Page<SanPham> getProducts(
            @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(name = "limit", required = false, defaultValue = "12") Integer limit,
            @RequestParam(name = "bomon", required = false) String bomon,
            @RequestParam(name = "danhmuc", required = false) String danhmuc,
            @RequestParam(name = "thuonghieu", required = false) String thuonghieu,
            @RequestParam(name = "minprice", required = false, defaultValue = "0") Integer minprice,
            @RequestParam(name = "maxprice", required = false) Integer maxprice,
            @RequestParam(name = "sort", required = false, defaultValue = "id") String sort,
            @RequestParam(name = "sortDir", required = false, defaultValue = "ASC") String sortDir,
            @RequestParam(name = "search", required = false) String search
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, sort
        ));

        return sanPhamService.getFilteredProducts(bomon, danhmuc, thuonghieu, minprice, maxprice, search, pageable);
    }
}
