package com.projectmanagement.project_management_system.DTO;

import com.projectmanagement.project_management_system.Enums.ProjectPriority;
import com.projectmanagement.project_management_system.Enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjDTO {

    private Long organizationId;

    private String name;

    private String description;

    private ProjectStatus projectStatus;

    private ProjectPriority projectPriority;

    private LocalDate startDate;

    private LocalDate endDate;

    private String teamLeadEmail;
}
