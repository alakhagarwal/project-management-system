package com.projectmanagement.project_management_system.Repository;

import com.projectmanagement.project_management_system.Entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization,Long> {

    boolean existsBySlug(String slug);
}
