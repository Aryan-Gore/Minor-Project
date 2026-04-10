package com.indiapost.financialneeds.controller;

import com.indiapost.financialneeds.service.ReportService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // GET /api/reports/district/Bongaon
    @GetMapping("/district/{district}")
    public ResponseEntity<Map<String, Object>> getReport(
            @PathVariable String district) {
        return ResponseEntity.ok(reportService.getDistrictReport(district));
    }

    // GET /api/reports/export/Bongaon — returns PDF binary
    @GetMapping("/export/{district}")
    public ResponseEntity<byte[]> exportPdf(
            @PathVariable String district) throws Exception {
        byte[] pdf = reportService.generatePdf(district);
        return ResponseEntity.ok()
                // Tell the browser this is a downloadable PDF
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=report-" + district + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
