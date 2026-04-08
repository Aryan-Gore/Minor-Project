package com.indiapost.financialneeds;

import com.indiapost.financialneeds.model.User;
import com.indiapost.financialneeds.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

// CommandLineRunner runs once after Spring Boot finishes starting
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only seed if no users exist yet
        if (userRepository.count() == 0) {
            // Create default USER account
            User user = User.builder()
                    .name("Post User")
                    .email("user@indiapost.gov.in")
                    .passwordHash(passwordEncoder.encode("user123"))
                    .role("USER")
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(user);

            // Create default ADMIN account
            User admin = User.builder()
                    .name("Post Admin")
                    .email("admin@indiapost.gov.in")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);

            System.out.println("Default users created:");
            System.out.println("  user@indiapost.gov.in  / user123");
            System.out.println("  admin@indiapost.gov.in / admin123");
        }
    }
}
