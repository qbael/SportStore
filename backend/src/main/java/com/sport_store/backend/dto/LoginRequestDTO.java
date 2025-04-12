package com.sport_store.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor // taoo 1 contructor khong tham sp
public class LoginRequestDTO {  // dien form dang nhap
    private String username;
    private String password;


}
