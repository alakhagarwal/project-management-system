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
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Service
public class OrganizationService {


    private final OrganizationRepository organizationRepository;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final UserRepository userRepository;

    @Value("${aws.bucket.name}")
    private String bucketName;

    @Value("${aws.region}")
    private String awsRegion;

    public OrganizationService(OrganizationRepository organizationRepository, S3Client s3Client, S3Presigner s3Presigner, UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
        this.userRepository = userRepository;
    }

    @Transactional // ensures if S3 upload fails, database rollback happens
    public OrgResponse createOrganization(String name, String slug, MultipartFile logo, String userEmail) throws IOException {
        User creator = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if slug already exists
        if (organizationRepository.existsBySlug(slug)) {
            throw new RuntimeException("Organization with this slug already exists");
        }

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
        String fileName = String.format("organizations/%s/%s-%s",
                slug,
                UUID.randomUUID().toString(),
                file.getOriginalFilename()
        );

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileName)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        // Return pre-signed URL instead of public URL
        return generatePresignedUrl(fileName);
    }

    // Method to generate pre-signed URL (valid for 7 days)
    public String generatePresignedUrl(String key) {
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofDays(7))  // URL expires in 7 days
                .getObjectRequest(req -> req.bucket(bucketName).key(key))
                .build();

        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);

        return presignedRequest.url().toString();
    }
}