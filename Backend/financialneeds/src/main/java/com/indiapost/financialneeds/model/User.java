package com.indiapost.financialneeds.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

// @Document = this class maps to the 'users' collection in MongoDB
@Document(collection = "users")
// @Data = Lombok generates getters, setters, toString, equals for all fields
@Data
// @Builder = lets you write: User.builder().name("x").email("y").build()
@Builder
@NoArgsConstructor   // generates: public User() {}
@AllArgsConstructor  // generates: public User(id, name, email, ...all fields) {}
public class User {

    @Id  // MongoDB primary key — auto-generated ObjectId stored as String
    private String id;

    private String name;

    @Indexed(unique = true)  // MongoDB unique index — no two users same email
    private String email;

    private String passwordHash;  // NEVER store plain passwords

    private String role;  // "USER" or "ADMIN" — only these two values

    private boolean isActive;  // false = deactivated, cannot login

    private LocalDateTime createdAt;

    private String createdBy;  // ID of admin who created this account
}
