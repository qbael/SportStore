package com.sport_store.backend.dto;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AdminLoginRequestDTO {
    private String email;
    private String password;
}
