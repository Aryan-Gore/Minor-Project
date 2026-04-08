package com.indiapost.financialneeds.repository;

import com.indiapost.financialneeds.model.Recommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface RecommendationRepository
        extends MongoRepository<Recommendation, String> {

    // Find recommendation for one specific village
    Optional<Recommendation> findByVillageId(String villageId);

    // Check if recommendation already exists before creating
    boolean existsByVillageId(String villageId);
}
