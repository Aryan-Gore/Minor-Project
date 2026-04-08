package com.indiapost.financialneeds.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "recommendations")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Recommendation {

    @Id
    private String id;

    private String villageId;       // links to village._id
    private LocalDateTime generatedAt;
    private int month;              // month when this was generated

    // List of all 7 schemes sorted by score (highest first)
    private List<SchemeScore> schemes;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SchemeScore {
        private String code;    // "SSA", "MSSC", "SCSS", etc.
        private double score;   // 0.0 to 1.0
        private String reason;  // human-readable explanation
    }
}
