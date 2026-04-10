package com.indiapost.financialneeds.service;

import com.indiapost.financialneeds.dto.VillageRequest;
import com.indiapost.financialneeds.model.Village;
import com.indiapost.financialneeds.repository.VillageRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VillageService {

    private final VillageRepository villageRepository;
    private final RecommendationService recommendationService;

    public VillageService(VillageRepository villageRepository,
                          RecommendationService recommendationService) {
        this.villageRepository = villageRepository;
        this.recommendationService = recommendationService;
    }

    // Filter villages by optional params — all three can be null
    public List<Village> getVillages(String state, String district, String block) {
        if (state != null && district != null && block != null) {
            return villageRepository.findByStateAndDistrictAndBlock(state, district, block);
        } else if (state != null && district != null) {
            return villageRepository.findByStateAndDistrict(state, district);
        } else if (state != null) {
            return villageRepository.findByState(state);
        }
        return villageRepository.findAll();
    }

    public Village getVillageById(String id) {
        return villageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Village not found"));
    }

    // Manual form entry — create one village + trigger recommendation
    public Village createVillage(VillageRequest req, String uploadedByUserId) {
        Village village = Village.builder()
                .villageName(req.getVillageName())
                .block(req.getBlock())
                .district(req.getDistrict())
                .state(req.getState())
                .demographics(Village.Demographics.builder()
                        .popTotal(req.getPopTotal())
                        .popMale(req.getPopMale())
                        .popFemale(req.getPopFemale())
                        .popChildUnder10(req.getPopChildUnder10())
                        .popSenior60Plus(req.getPopSenior60Plus())
                        .popFarmer(req.getPopFarmer())
                        .popSalaried(req.getPopSalaried())
                        .popBusiness(req.getPopBusiness())
                        .build())
                .cropCycle(Village.CropCycle.builder()
                        .type(req.getCropType())
                        .harvestMonths(req.getHarvestMonths())
                        .build())
                .uploadedBy(uploadedByUserId)
                .uploadedAt(LocalDateTime.now())
                .source("MANUAL")
                .build();

        Village saved = villageRepository.save(village);

        // Automatically trigger Python ML scoring after saving
        recommendationService.generateForVillage(saved);

        return saved;
    }
}
