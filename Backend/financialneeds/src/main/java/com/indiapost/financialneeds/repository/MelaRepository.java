package com.indiapost.financialneeds.repository;

import com.indiapost.financialneeds.model.Mela;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MelaRepository extends MongoRepository<Mela, String> {

    List<Mela> findByDistrict(String district);
    List<Mela> findBySchemeCode(String schemeCode);
    List<Mela> findByDistrictAndSchemeCode(String district, String schemeCode);

    // Find all melas ordered by date, newest first
    List<Mela> findAllByOrderByScheduledDateDesc();
}

