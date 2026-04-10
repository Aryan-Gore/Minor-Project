package com.indiapost.financialneeds.repository;

import com.indiapost.financialneeds.model.UploadLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UploadRepository extends MongoRepository<UploadLog, String> {

    // Newest uploads first — user sees their latest upload at top
    List<UploadLog> findAllByOrderByUploadedAtDesc();
}
