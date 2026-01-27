package com.projectmanagement.project_management_system.Repository;

import com.projectmanagement.project_management_system.Entity.OrganizationMember;
import com.projectmanagement.project_management_system.Enums.OrganizationRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationMemberRepository extends JpaRepository<OrganizationMember,Long> {

    // Check if user is a member of organization
    Optional<OrganizationMember> findByUserIdAndOrganizationId(Long userId, Long organizationId);

    // Check if user has specific role in organization
    Optional<OrganizationMember> findByUserIdAndOrganizationIdAndOrganizationRole(
            Long userId,
            Long organizationId,
            OrganizationRole organizationRole
    );
}
