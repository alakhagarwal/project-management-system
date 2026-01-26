package com.projectmanagement.project_management_system.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrgResponse {

    private Long id;
    private String name;
    private String slug;
    private String logoUrl;
}
