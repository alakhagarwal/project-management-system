package com.projectmanagement.project_management_system.DTO;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {

    @NotBlank
    private String email;

    @NotBlank
    private String password;
}

