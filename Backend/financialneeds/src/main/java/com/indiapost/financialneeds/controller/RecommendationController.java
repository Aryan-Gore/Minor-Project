package com.indiapost.financialneeds.controller;

import com.indiapost.financialneeds.model.Recommendation;
import com.indiapost.financialneeds.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService rec) {
        this.recommendationService = rec;
    }

    // GET /api/recommendations — all villages with top scheme (for list table)
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        return ResponseEntity.ok(recommendationService.getAllSummaries());
    }

    // GET /api/recommendations/abc123 — full ranked list for one village
    @GetMapping("/{villageId}")
    public ResponseEntity<Recommendation> getForVillage(
            @PathVariable String villageId) {
        return ResponseEntity.ok(
                recommendationService.getForVillage(villageId));
    }
}
