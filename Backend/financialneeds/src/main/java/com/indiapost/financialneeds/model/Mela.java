package com.indiapost.financialneeds.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "melas")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Mela {

    @Id
    private String id;

    private String villageId;
    private String villageName;  // stored for easy display without joining
    private String district;
    private String schemeCode;   // "SSA", "SCSS", etc.
    private LocalDate scheduledDate;
    private String venue;
    private String createdBy;    // user ID
    private LocalDateTime createdAt;
}
