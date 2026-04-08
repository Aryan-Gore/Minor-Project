package com.indiapost.financialneeds.service;

import com.indiapost.financialneeds.dto.UserRequest;
import com.indiapost.financialneeds.model.User;
import com.indiapost.financialneeds.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Return all users — admin sees everyone
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Create a new user account (admin only)
    public User createUser(UserRequest req, String adminId) {
        // Check email not already taken
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                // Always hash password before saving — never store plain text
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .createdBy(adminId)
                .build();

        return userRepository.save(user);
    }

    // Edit user name, email, or role
    public User updateUser(String id, UserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setRole(req.getRole());

        // Only update password if a new one was provided
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }

        return userRepository.save(user);
    }

    // Soft delete — just set isActive = false
    public void deactivateUser(String id, String requestingAdminId) {
        // Admin cannot deactivate themselves
        if (id.equals(requestingAdminId)) {
            throw new RuntimeException("Cannot deactivate your own account");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }
}
