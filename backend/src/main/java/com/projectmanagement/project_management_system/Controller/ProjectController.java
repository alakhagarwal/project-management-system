package com.projectmanagement.project_management_system.Controller;

import com.projectmanagement.project_management_system.DTO.CreateProjDTO;
import com.projectmanagement.project_management_system.Entity.Project;
import com.projectmanagement.project_management_system.Service.ProjectService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/proj")
public class ProjectController {

    private ProjectService projectService;

    public ProjectController(@Autowired ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProject(@RequestBody CreateProjDTO createProjDTO,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        Project project = projectService.save(createProjDTO, userDetails.getUsername());
        return ResponseEntity.ok(project);

    }
}
