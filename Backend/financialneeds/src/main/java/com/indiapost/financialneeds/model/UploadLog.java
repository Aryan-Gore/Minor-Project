package com.indiapost.financialneeds.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "uploads")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UploadLog {

    @Id
    private String id;

    private String filename;
    private String uploadedBy;      // user ID
    private String uploadedByName;  // user name — stored for display
    private LocalDateTime uploadedAt;
    private String source;          // "CSV" or "EXCEL"
    private int totalRows;
    private int importedRows;
    private int failedRows;
    private List<String> errors;    // e.g. ["Row 45: popTotal not a number"]
}
