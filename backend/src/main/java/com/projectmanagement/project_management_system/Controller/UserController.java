package com.projectmanagement.project_management_system.Controller;

import com.projectmanagement.project_management_system.DTO.RegisterRequestDTO;
import com.projectmanagement.project_management_system.DTO.UserResponseDTO;
import com.projectmanagement.project_management_system.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            userService.loadUserByUsername(request.getEmail());
            return ResponseEntity.badRequest().body("User already exists with email: " + request.getEmail());
        } catch (UsernameNotFoundException e) {
            UserResponseDTO userResponseDTO = userService.saveUser(request);
            return ResponseEntity.status(201).body(userResponseDTO);
        }
    }
}
