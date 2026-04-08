package com.indiapost.financialneeds.service;

import com.indiapost.financialneeds.model.Recommendation;
import com.indiapost.financialneeds.model.Village;
import com.indiapost.financialneeds.repository.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final VillageRepository villageRepository;
    private final RecommendationRepository recommendationRepository;

    public ReportService(VillageRepository villageRepository,
                         RecommendationRepository recommendationRepository) {
        this.villageRepository = villageRepository;
        this.recommendationRepository = recommendationRepository;
    }

    // Return aggregated scheme stats for one district
    public Map<String, Object> getDistrictReport(String district) {
        List<Village> villages = villageRepository.findByDistrict(district);

        // Count how many villages have each scheme as top recommendation
        Map<String, Long> schemeCounts = new HashMap<>();
        Map<String, List<Double>> schemeScores = new HashMap<>();

        for (Village v : villages) {
            recommendationRepository.findByVillageId(v.getId())
                    .ifPresent(rec -> {
                        if (!rec.getSchemes().isEmpty()) {
                            String topScheme = rec.getSchemes().get(0).getCode();
                            double topScore  = rec.getSchemes().get(0).getScore();
                            schemeCounts.merge(topScheme, 1L, Long::sum);
                            schemeScores.computeIfAbsent(topScheme,
                                    k -> new ArrayList<>()).add(topScore);
                        }
                    });
        }

        // Build response list
        List<Map<String, Object>> schemes = schemeCounts.entrySet().stream()
                .map(e -> {
                    Map<String, Object> s = new HashMap<>();
                    s.put("code", e.getKey());
                    s.put("villageCount", e.getValue());
                    List<Double> scores = schemeScores.get(e.getKey());
                    double avg = scores.stream()
                            .mapToDouble(Double::doubleValue).average().orElse(0);
                    s.put("avgScore", Math.round(avg * 100.0) / 100.0);
                    return s;
                })
                .sorted(Comparator.comparingLong(s -> -(Long)s.get("villageCount")))
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("district", district);
        result.put("totalVillages", villages.size());
        result.put("schemes", schemes);
        return result;
    }

    // Generate PDF using iText and return as byte array
    public byte[] generatePdf(String district) throws Exception {
        Map<String, Object> report = getDistrictReport(district);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document pdf = new Document();
        PdfWriter.getInstance(pdf, out);
        pdf.open();

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
        Font bodyFont  = new Font(Font.FontFamily.HELVETICA, 11);

        pdf.add(new Paragraph("India Post — Scheme Recommendation Report", titleFont));
        pdf.add(new Paragraph("District: " + district, headerFont));
        pdf.add(new Paragraph("Total villages: " + report.get("totalVillages"), bodyFont));
        pdf.add(new Paragraph(" "));

        // Table with scheme stats
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.addCell(new Phrase("Scheme", headerFont));
        table.addCell(new Phrase("Villages", headerFont));
        table.addCell(new Phrase("Avg Score", headerFont));

        List<Map<String, Object>> schemes =
                (List<Map<String, Object>>) report.get("schemes");
        for (Map<String, Object> s : schemes) {
            table.addCell(new Phrase(s.get("code").toString(), bodyFont));
            table.addCell(new Phrase(s.get("villageCount").toString(), bodyFont));
            table.addCell(new Phrase(s.get("avgScore").toString(), bodyFont));
        }
        pdf.add(table);
        pdf.close();
        return out.toByteArray();
    }
}
