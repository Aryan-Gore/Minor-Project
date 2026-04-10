package com.indiapost.financialneeds.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank private String name;
    @Email @NotBlank private String email;
    private String password;  // optional on edit, required on create
    @NotBlank private String role;  // "USER" or "ADMIN"
}
