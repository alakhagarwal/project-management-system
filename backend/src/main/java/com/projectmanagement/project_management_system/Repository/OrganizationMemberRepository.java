package com.projectmanagement.project_management_system.Repository;

import com.projectmanagement.project_management_system.Entity.OrganizationMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationMemberRepository extends JpaRepository<OrganizationMember,Long> {
}
