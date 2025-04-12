package com.sport_store.backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "cthoadon")
public class CTHoaDon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "soluong")
    private int soLuong;

    @Column(name = "giaban")
    private int giaBan;

    @Column(name = "gianhap")
    private int giaNhap;

    @ManyToOne
    @JoinColumn(name = "bienthe")
    private BienThe bienThe;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "hoadon")
    private HoaDon hoaDon;
}