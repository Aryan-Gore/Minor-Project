package com.indiapost.financialneeds.service;

import com.indiapost.financialneeds.model.*;
import com.indiapost.financialneeds.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final VillageRepository villageRepository;
    private final RestTemplate restTemplate;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public RecommendationService(
            RecommendationRepository recommendationRepository,
            VillageRepository villageRepository) {
        this.recommendationRepository = recommendationRepository;
        this.villageRepository = villageRepository;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(5000);
        this.restTemplate = new RestTemplate(factory);
    }

    public void generateForVillage(Village village) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("villageId",       village.getId());
            payload.put("popTotal",        village.getDemographics().getPopTotal());
            payload.put("popMale",         village.getDemographics().getPopMale());
            payload.put("popFemale",       village.getDemographics().getPopFemale());
            payload.put("popChildUnder10", village.getDemographics().getPopChildUnder10());
            payload.put("popSenior60Plus", village.getDemographics().getPopSenior60Plus());
            payload.put("popFarmer",       village.getDemographics().getPopFarmer());
            payload.put("popSalaried",     village.getDemographics().getPopSalaried());
            payload.put("popBusiness",     village.getDemographics().getPopBusiness());
            payload.put("cropType",        village.getCropCycle().getType());
            payload.put("harvestMonths",   village.getCropCycle().getHarvestMonths());
            payload.put("currentMonth",    LocalDateTime.now().getMonthValue());

            Map response = restTemplate.postForObject(
                    mlServiceUrl + "/recommend", payload, Map.class);

            List<Map<String, Object>> schemeList =
                    (List<Map<String, Object>>) response.get("schemes");

            List<Recommendation.SchemeScore> schemes = schemeList.stream()
                    .map(s -> Recommendation.SchemeScore.builder()
                            .code((String) s.get("code"))
                            .score(((Number) s.get("score")).doubleValue())
                            .reason((String) s.get("reason"))
                            .build())
                    .toList();

            recommendationRepository.findByVillageId(village.getId())
                    .ifPresent(r -> recommendationRepository.delete(r));

            Recommendation rec = Recommendation.builder()
                    .villageId(village.getId())
                    .generatedAt(LocalDateTime.now())
                    .month(LocalDateTime.now().getMonthValue())
                    .schemes(schemes)
                    .build();

            recommendationRepository.save(rec);

        } catch (Exception e) {
            System.err.println("ML service error for village " +
                    village.getId() + ": " + e.getMessage());
        }
    }

    public Recommendation getForVillage(String villageId) {
        return recommendationRepository.findByVillageId(villageId)
                .orElseThrow(() -> new RuntimeException("No recommendation found"));
    }

    public List<Map<String, Object>> getAllSummaries() {
        return recommendationRepository.findAll().stream().map(rec -> {
            Map<String, Object> summary = new HashMap<>();
            summary.put("villageId", rec.getVillageId());
            summary.put("month",     rec.getMonth());
            if (!rec.getSchemes().isEmpty()) {
                summary.put("topScheme", rec.getSchemes().get(0).getCode());
                summary.put("topScore",  rec.getSchemes().get(0).getScore());
            }
            return summary;
        }).toList();
    }
}