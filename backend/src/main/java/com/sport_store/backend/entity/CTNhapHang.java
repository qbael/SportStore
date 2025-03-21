package com.sport_store.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "ctnhaphang")
public class CTNhapHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "soluong")
    private int soLuong;

    @Column(name = "gianhap")
    private int giaNhap;

    @ManyToOne
    @JoinColumn(name = "bienthe")
    private BienThe bienThe;

    @ManyToOne
    @JoinColumn(name = "nhaphang")
    private NhapHang nhapHang;
}