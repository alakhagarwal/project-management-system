package com.projectmanagement.project_management_system.Repository;

import com.projectmanagement.project_management_system.Entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember,Long> {
}
