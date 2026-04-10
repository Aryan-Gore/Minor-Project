package com.indiapost.financialneeds.controller;

import com.indiapost.financialneeds.dto.UploadResult;
import com.indiapost.financialneeds.model.UploadLog;
import com.indiapost.financialneeds.repository.UploadRepository;
import com.indiapost.financialneeds.repository.UserRepository;
import com.indiapost.financialneeds.service.UploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UploadController {

    private final UploadService uploadService;
    private final UploadRepository uploadRepository;
    private final UserRepository userRepository;

    public UploadController(UploadService uploadService,
                            UploadRepository uploadRepository,
                            UserRepository userRepository) {
        this.uploadService = uploadService;
        this.uploadRepository = uploadRepository;
        this.userRepository = userRepository;
    }

    // Helper to get current user name for audit log
    private String getCurrentUserId() {
        return SecurityContextHolder.getContext()
                .getAuthentication().getName();
    }

    private String getCurrentUserName(String userId) {
        return userRepository.findById(userId)
                .map(u -> u.getName()).orElse("Unknown");
    }

    // POST /api/upload/csv
    // @RequestParam("file") reads the multipart file from FormData
    @PostMapping("/upload/csv")
    public ResponseEntity<UploadResult> uploadCsv(
            @RequestParam("file") MultipartFile file) throws Exception {
        String userId   = getCurrentUserId();
        String userName = getCurrentUserName(userId);
        return ResponseEntity.ok(
                uploadService.processCSV(file, userId, userName));
    }

    // POST /api/upload/excel
    @PostMapping("/upload/excel")
    public ResponseEntity<UploadResult> uploadExcel(
            @RequestParam("file") MultipartFile file) throws Exception {
        String userId   = getCurrentUserId();
        String userName = getCurrentUserName(userId);
        return ResponseEntity.ok(
                uploadService.processExcel(file, userId, userName));
    }

    // GET /api/uploads — upload history
    @GetMapping("/uploads")
    public ResponseEntity<List<UploadLog>> getUploads() {
        return ResponseEntity.ok(
                uploadRepository.findAllByOrderByUploadedAtDesc());
    }
}
