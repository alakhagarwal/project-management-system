package com.projectmanagement.project_management_system.Controller;

import com.projectmanagement.project_management_system.DTO.OrgResponse;
import com.projectmanagement.project_management_system.Service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/org")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("name") String name,
            @RequestParam("slug") String slug,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @AuthenticationPrincipal UserDetails userDetails
    ) throws IOException {
        OrgResponse orgResponse = organizationService.createOrganization(name, slug, logo, userDetails.getUsername());
        return ResponseEntity.ok(orgResponse);
    }


}
