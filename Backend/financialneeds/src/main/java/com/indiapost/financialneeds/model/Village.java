package com.indiapost.financialneeds.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "villages")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Village {

    @Id
    private String id;

    private String villageName;
    private String block;
    private String district;
    private String state;

    // Stored as a nested object inside the village document
    // MongoDB: { demographics: { popTotal: 1240, popMale: 580, ... } }
    private Demographics demographics;

    private CropCycle cropCycle;

    private String uploadedBy;    // User ID who uploaded this
    private LocalDateTime uploadedAt;
    private String source;        // "CSV", "EXCEL", or "MANUAL"

    // Inner class — no @Document, lives inside village document
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Demographics {
        private int popTotal;
        private int popMale;
        private int popFemale;
        private int popChildUnder10;
        private int popSenior60Plus;
        private int popFarmer;
        private int popSalaried;
        private int popBusiness;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CropCycle {
        private String type;              // "Rabi", "Kharif", "Both"
        private List<Integer> harvestMonths; // e.g. [3, 4] for March, April
    }
}
