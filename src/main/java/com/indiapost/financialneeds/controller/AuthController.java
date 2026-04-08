package com.indiapost.financialneeds.controller;

import com.indiapost.financialneeds.dto.*;
import com.indiapost.financialneeds.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// @RestController = Controller + @ResponseBody (auto-converts return to JSON)
@RestController
// All methods in this class start with /api/auth
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/login
    // @RequestBody = read JSON from request body into LoginRequest object
    // @Valid = run the validation annotations on LoginRequest
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
