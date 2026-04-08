package com.indiapost.financialneeds.repository;

import com.indiapost.financialneeds.model.Village;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VillageRepository extends MongoRepository<Village, String> {

    // Spring generates: db.villages.find({ district: district })
    List<Village> findByDistrict(String district);

    // AND condition — Spring reads 'And' in method name
    List<Village> findByStateAndDistrict(String state, String district);

    List<Village> findByStateAndDistrictAndBlock(
            String state, String district, String block);

    // For when only state is provided
    List<Village> findByState(String state);
}
