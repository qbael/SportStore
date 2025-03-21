package com.sport_store.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "thuonghieu")
public class ThuongHieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ten")
    private String tenThuongHieu;

    @OneToMany(mappedBy = "thuongHieu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SanPham> dsSanPham;
}
