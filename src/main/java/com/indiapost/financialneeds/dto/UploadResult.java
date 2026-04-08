package com.indiapost.financialneeds.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

// Returned to React after CSV or Excel upload
@Data @AllArgsConstructor
public class UploadResult {
    private String uploadId;
    private int totalRows;
    private int importedRows;
    private int failedRows;
    private List<String> errors;  // e.g. ["Row 45: popTotal not a number"]
}
