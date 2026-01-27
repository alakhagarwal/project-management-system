package com.projectmanagement.project_management_system.Repository;

import com.projectmanagement.project_management_system.Entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {

}
