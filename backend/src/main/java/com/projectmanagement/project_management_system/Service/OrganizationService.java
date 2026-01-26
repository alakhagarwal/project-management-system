package com.projectmanagement.project_management_system.Service;

import com.projectmanagement.project_management_system.DTO.OrgResponse;
import com.projectmanagement.project_management_system.Entity.Organization;
import com.projectmanagement.project_management_system.Entity.User;
import com.projectmanagement.project_management_system.Repository.OrganizationRepository;
import com.projectmanagement.project_management_system.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class OrganizationService {


    private final OrganizationRepository organizationRepository;
    private final S3Client s3Client;
    private final UserRepository userRepository;

    @Value("${aws.bucket.name}")
    private String bucketName;

    @Value("${aws.region}")
    private String awsRegion;

    public OrganizationService(OrganizationRepository organizationRepository, S3Client s3Client, UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.s3Client = s3Client;
        this.userRepository = userRepository;
    }

    @Transactional // ensures if S3 upload fails, database rollback happens
    public OrgResponse createOrganization(String name, String slug, MultipartFile logo, String userEmail) throws IOException {
        User creator = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 3: Upload logo to S3 (if provided)
        String logoUrl = null;
        if (logo != null && !logo.isEmpty()) {
            logoUrl = uploadToS3(logo, slug);
        }

        // Step 4: Save organization to DB
        Organization organization = new Organization();
        organization.setName(name);
        organization.setSlug(slug);
        organization.setLogoUrl(logoUrl);
        organization.setCreatedBy(creator);


        // Step 5: Save to database
        Organization savedOrg = organizationRepository.save(organization);

        // Step 6: Return response DTO
        return new OrgResponse(
                savedOrg.getId(),
                savedOrg.getName(),
                savedOrg.getSlug(),
                savedOrg.getLogoUrl()
        );


    }

    private String uploadToS3(MultipartFile file, String slug) throws IOException {
        // Create unique filename: organizations/my-org/uuid-logo.png
        String fileName = String.format("organizations/%s/%s-%s",
                slug,
                UUID.randomUUID().toString(),
                file.getOriginalFilename()
        );

        // Upload to S3
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileName)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        // Construct and return public URL
        return String.format("https://%s.s3.%s.amazonaws.com/%s",
                bucketName,
                awsRegion,
                fileName
        );
    }


}
