package com.ommcinvest.api.controller;

import com.ommcinvest.api.dto.LoginRequestDTO;
import com.ommcinvest.api.dto.LoginResponseDTO;
import com.ommcinvest.api.dto.UserDTO;
import com.ommcinvest.api.entity.User;
import com.ommcinvest.api.service.JwtService;
import com.ommcinvest.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserDTO userDTO) {
        try {
            // Check if email already exists
            User existingUser = userService.findByEmail(userDTO.getEmail());
            if (existingUser != null) {
                return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already registered");
            }

            // Create new user
            User user = new User();
            user.setName(userDTO.getName());
            user.setEmail(userDTO.getEmail());
            user.setWhatsapp(userDTO.getWhatsapp());
            user.setPasswordHash(passwordEncoder.encode(userDTO.getPasswordHash()));
            user.setProfileId(1); // Default profile
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            User savedUser = userService.save(user);

            // Generate JWT token for immediate login
            String token = jwtService.generateToken(savedUser.getEmail());

            // Build response
            LoginResponseDTO response = new LoginResponseDTO();
            response.setToken(token);
            response.setType("Bearer");
            response.setUserId(savedUser.getId());
            response.setUserName(savedUser.getName());
            response.setUserEmail(savedUser.getEmail());
            response.setProfileId(savedUser.getProfileId());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error during registration: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            // Search for user by email
            User user = userService.findByEmail(loginRequest.getEmail());
            
            if (user == null) {
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
            }

            // Validate password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
            }

            // Generate JWT token
            String token = jwtService.generateToken(user.getEmail());

            // Build response
            LoginResponseDTO response = new LoginResponseDTO();
            response.setToken(token);
            response.setType("Bearer");
            response.setUserId(user.getId());
            response.setUserName(user.getName());
            response.setUserEmail(user.getEmail());
            if (user.getProfileId() != null) {
                response.setProfileId(user.getProfileId());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error during authentication: " + e.getMessage());
        }
    }
}
