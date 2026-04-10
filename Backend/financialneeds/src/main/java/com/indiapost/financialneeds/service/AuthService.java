package com.indiapost.financialneeds.service;

import com.indiapost.financialneeds.config.JwtUtil;
import com.indiapost.financialneeds.dto.*;
import com.indiapost.financialneeds.model.User;
import com.indiapost.financialneeds.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// @Service tells Spring to manage this class
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection — Spring provides all three automatically
    public AuthService(UserRepository userRepository,
                       JwtUtil jwtUtil,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        // 1. Find user by email — throws exception if not found
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        // 2. Check account is active
        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        // 3. Check password — BCrypt compares hash, never the plain password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // 4. Generate JWT token containing userId and role
        String token = jwtUtil.generateToken(user.getId(), user.getRole());

        // 5. Return token + role + name to React
        return new LoginResponse(token, user.getRole(), user.getName());
    }
}
