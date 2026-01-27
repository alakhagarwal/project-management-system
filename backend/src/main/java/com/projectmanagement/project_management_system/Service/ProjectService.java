package com.projectmanagement.project_management_system.Service;

import com.projectmanagement.project_management_system.DTO.CreateProjDTO;
import com.projectmanagement.project_management_system.DTO.ProjResponse;
import com.projectmanagement.project_management_system.Entity.Organization;
import com.projectmanagement.project_management_system.Entity.Project;
import com.projectmanagement.project_management_system.Entity.ProjectMember;
import com.projectmanagement.project_management_system.Entity.User;
import com.projectmanagement.project_management_system.Enums.ProjectRole;
import com.projectmanagement.project_management_system.Repository.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Service
@Data
@AllArgsConstructor
public class ProjectService {

    private ProjectRepository projectRepository;
    private UserRepository userRepository;
    private OrganizationRepository organizationRepository;
    private ProjectMemberRepository projectMemberRepository;

    public ProjResponse save(CreateProjDTO createProjDTO, String creatorEmail) {

        User createdBy = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User teamLead = userRepository.findByEmail(createProjDTO.getTeamLeadEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Organization organization = organizationRepository.findById(createProjDTO.getOrganizationId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        Project project = new Project();
        project.setName(createProjDTO.getName());
        project.setDescription(createProjDTO.getDescription());
        project.setCreatedBy(createdBy);
        project.setProjectStatus(createProjDTO.getProjectStatus());
        project.setProjectPriority(createProjDTO.getProjectPriority());
        project.setOrganization(organization);
        project.setStartDate(createProjDTO.getStartDate());
        project.setEndDate(createProjDTO.getEndDate());
        project.setTeamLead(teamLead);

        Project savedProject = projectRepository.save(project);

        ProjectMember projectMember = new ProjectMember();
        projectMember.setProject(savedProject);
        projectMember.setProjectRole(ProjectRole.LEAD);
        projectMember.setUser(teamLead);

        projectMemberRepository.save(projectMember);


        ProjResponse projResponse = new ProjResponse(
                savedProject.getId(),
                savedProject.getName(),
                savedProject.getDescription(),
                savedProject.getOrganization().getId(),
                savedProject.getCreatedBy().getEmail(),
                savedProject.getTeamLead().getEmail(),
                savedProject.getProjectStatus(),
                savedProject.getProjectPriority(),
                savedProject.getStartDate(),
                savedProject.getEndDate()
        );

        return projResponse;

    }
}
