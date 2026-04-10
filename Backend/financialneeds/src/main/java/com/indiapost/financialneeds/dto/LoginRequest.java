package com.indiapost.financialneeds.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// @Data = Lombok generates getters/setters
@Data
public class LoginRequest {

    // @Email validates format. @NotBlank means cannot be null or empty string.
    @Email(message = "Must be a valid email address")
    @NotBlank(message = "Email is required")
    private String email;


    @NotBlank(message = "Password is required")
    private String password;
}
