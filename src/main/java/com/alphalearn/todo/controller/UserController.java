// 17-09 updated: Enforce duplicate username/email checks and return 409
package com.alphalearn.todo.controller;

import com.alphalearn.todo.model.User;
import com.alphalearn.todo.repository.UserRepository;
import com.alphalearn.todo.response.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import org.springframework.beans.factory.annotation.Value;
import java.util.Date;

@RestController
@RequestMapping("/auth")
public class UserController {
        @Value("${jwt.secret}")
        private String jwtSecret;
        private Key getJwtKey() {
            return Keys.hmacShaKeyFor(jwtSecret.getBytes());
        }
        private static final long JWT_EXPIRATION_MS = 86400000; // 1 day
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            return ResponseHandler.buildResponse(false, HttpStatus.BAD_REQUEST, null, "Role is required");
        }
        // Normalize input (trim)
        if (user.getUsername() != null) user.setUsername(user.getUsername().trim());
        if (user.getEmail() != null) user.setEmail(user.getEmail().trim());

        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseHandler.buildResponse(false, HttpStatus.CONFLICT, null, "Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseHandler.buildResponse(false, HttpStatus.CONFLICT, null, "Email already exists");
        }
        userRepository.save(user);
        return ResponseHandler.buildResponse(true, HttpStatus.CREATED, user, null);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.getOrDefault("username", loginRequest.getOrDefault("name", ""));
        String password = loginRequest.get("password");
        User user = userRepository.findByUsername(username);
        if (user == null || !user.getPassword().equals(password)) {
            return ResponseHandler.buildResponse(false, HttpStatus.UNAUTHORIZED, null, "Invalid credentials");
        }
    // Generate JWT token
    String token = Jwts.builder()
        .setSubject(user.getUsername())
        .claim("role", user.getRole())
        .claim("email", user.getEmail())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
        .signWith(getJwtKey())
        .compact();

    java.util.Map<String, Object> responseData = new java.util.HashMap<>();
    responseData.put("user", user);
    responseData.put("token", token);
    return ResponseHandler.buildResponse(true, HttpStatus.OK, responseData, null);
    }
}
