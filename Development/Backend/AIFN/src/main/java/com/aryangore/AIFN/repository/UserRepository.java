package com.aryangore.AIFN.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.aryangore.AIFN.entity.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}