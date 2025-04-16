package com.sport_store.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sport_store.backend.entity.Enum.TenChucVu;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "chucvu")
@NoArgsConstructor
@AllArgsConstructor
public class ChucVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tenchucvu", nullable = false)
    private TenChucVu tenChucVu;

    @OneToMany(mappedBy = "chucVu", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Quyen> quyenList;
}
