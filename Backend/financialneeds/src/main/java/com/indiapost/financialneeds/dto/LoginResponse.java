package com.indiapost.financialneeds.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// This is what React receives after a successful login
@Data
@AllArgsConstructor  // constructor with all fields for easy creation
public class LoginResponse {
    private String token;  // JWT token — React attaches this to every request
    private String role;   // "USER" or "ADMIN" — React uses this for routing
    private String name;   // display name shown in sidebar
}
