package com.indiapost.financialneeds.controller;

import com.indiapost.financialneeds.dto.UserRequest;
import com.indiapost.financialneeds.model.User;
import com.indiapost.financialneeds.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

// All /api/users routes are restricted to ADMIN in SecurityConfig
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<User> createUser(
            @Valid @RequestBody UserRequest request) {
        String adminId = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ResponseEntity.ok(userService.createUser(request, adminId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // PATCH /api/users/abc123/deactivate
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, Object>> deactivate(
            @PathVariable String id) {
        String adminId = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        userService.deactivateUser(id, adminId);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
