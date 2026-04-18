package com.indiapost.financialneeds;

import com.indiapost.financialneeds.model.User;
import com.indiapost.financialneeds.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

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
        if (userRepository.count() == 0) {

            User user = User.builder()
                    .name("Post User")
                    .email("user@indiapost.gov.in")
                    .passwordHash(passwordEncoder.encode("user123"))
                    .role("USER")
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(user);

            User admin = User.builder()
                    .name("Post Admin")
                    .email("admin@indiapost.gov.in")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);

            System.out.println("====================================");
            System.out.println("Default users created:");
            System.out.println("  user@indiapost.gov.in  / user123");
            System.out.println("  admin@indiapost.gov.in / admin123");
            System.out.println("====================================");
        }
    }
}