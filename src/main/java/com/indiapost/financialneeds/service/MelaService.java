package com.indiapost.financialneeds.service;

import com.indiapost.financialneeds.dto.MelaRequest;
import com.indiapost.financialneeds.model.Mela;
import com.indiapost.financialneeds.model.Village;
import com.indiapost.financialneeds.repository.MelaRepository;
import com.indiapost.financialneeds.repository.VillageRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MelaService {

    private final MelaRepository melaRepository;
    private final VillageRepository villageRepository;

    public MelaService(MelaRepository melaRepository,
                       VillageRepository villageRepository) {
        this.melaRepository = melaRepository;
        this.villageRepository = villageRepository;
    }

    public List<Mela> getMelas(String district, String schemeCode) {
        if (district != null && schemeCode != null) {
            return melaRepository.findByDistrictAndSchemeCode(district, schemeCode);
        } else if (district != null) {
            return melaRepository.findByDistrict(district);
        } else if (schemeCode != null) {
            return melaRepository.findBySchemeCode(schemeCode);
        }
        return melaRepository.findAllByOrderByScheduledDateDesc();
    }

    public Mela createMela(MelaRequest req, String userId) {
        // Fetch village to get name and district for denormalization
        Village village = villageRepository.findById(req.getVillageId())
                .orElseThrow(() -> new RuntimeException("Village not found"));

        Mela mela = Mela.builder()
                .villageId(req.getVillageId())
                .villageName(village.getVillageName())
                .district(village.getDistrict())
                .schemeCode(req.getSchemeCode())
                .scheduledDate(req.getScheduledDate())
                .venue(req.getVenue())
                .createdBy(userId)
                .createdAt(LocalDateTime.now())
                .build();

        return melaRepository.save(mela);
    }
}
