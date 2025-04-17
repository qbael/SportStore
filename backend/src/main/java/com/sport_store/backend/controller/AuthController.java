package com.sport_store.backend.controller;

import com.sport_store.backend.dto.LoginRequestDTO;
import com.sport_store.backend.dto.LoginResponseDTO;
import com.sport_store.backend.dto.RegisterRequestDTO;
import com.sport_store.backend.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO response = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (response.getError() != null) {
            return ResponseEntity.status(401).body(response); // 401 Unauthorized nếu lỗi
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(@RequestBody RegisterRequestDTO registerRequest) {
        LoginResponseDTO response = authService.register(
                registerRequest.getUsername(),
                registerRequest.getPassword(),
                registerRequest.getEmail(),
                registerRequest.getHoTen(),
                registerRequest.getDiaChi(),
                registerRequest.getSdt(),
                registerRequest.getIs_active()
        );
        if (response.getError() != null) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

}