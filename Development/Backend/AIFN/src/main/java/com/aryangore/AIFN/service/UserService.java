package com.aryangore.AIFN.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.aryangore.AIFN.entity.User;
import com.aryangore.AIFN.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public String register(User user) {

        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            return "User already exists!";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if(user.getRole() == null){
            user.setRole("USER");
        }

        userRepository.save(user);

        return "Registered Successfully!";
    }
}