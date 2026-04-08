package com.indiapost.financialneeds.repository;

import com.indiapost.financialneeds.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

// MongoRepository gives you for free:
// save(user), findById(id), findAll(), deleteById(id), count()
public interface UserRepository extends MongoRepository<User, String> {

    // Spring generates: db.users.findOne({ email: email })
    // Optional = might return null if no user found with that email
    Optional<User> findByEmail(String email);

    // Spring generates: db.users.find({ isActive: true })
    List<User> findByIsActiveTrue();
}
