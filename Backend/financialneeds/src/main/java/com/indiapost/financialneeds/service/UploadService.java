package com.indiapost.financialneeds.service;

import com.indiapost.financialneeds.dto.UploadResult;
import com.indiapost.financialneeds.model.*;
import com.indiapost.financialneeds.repository.*;
import com.opencsv.CSVReader;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class UploadService {

    private final VillageRepository villageRepository;
    private final UploadRepository uploadRepository;
    private final RecommendationService recommendationService;

    public UploadService(VillageRepository villageRepository,
                         UploadRepository uploadRepository,
                         RecommendationService recommendationService) {
        this.villageRepository = villageRepository;
        this.uploadRepository = uploadRepository;
        this.recommendationService = recommendationService;
    }

    // Parse CSV file and import all valid rows
    public UploadResult processCSV(MultipartFile file, String userId,
                                   String userName) throws IOException {
        List<String[]> rows = new ArrayList<>();
        try (CSVReader reader = new CSVReader(
                new InputStreamReader(file.getInputStream()))) {

            String[] line;
            boolean isFirst = true;

            while ((line = reader.readNext()) != null) {
                if (isFirst) {
                    isFirst = false; // skip header
                    continue;
                }
                rows.add(line);
            }

        } catch (Exception e) {
            System.out.println("CSV Error: " + e.getMessage());
        }
        return processRows(rows, file.getOriginalFilename(),
                userId, userName, "CSV");
    }

    // Parse Excel file and import all valid rows
    public UploadResult processExcel(MultipartFile file, String userId,
                                     String userName) throws IOException {
        List<String[]> rows = new ArrayList<>();
        // Apache POI reads .xlsx files
        try (Workbook workbook = WorkbookFactory.create(
                file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);  // first sheet
            Iterator<Row> rowIterator = sheet.iterator();
            rowIterator.next(); // skip header row
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                // Read all 14 columns as strings
                String[] values = new String[14];
                for (int i = 0; i < 14; i++) {
                    Cell cell = row.getCell(i);
                    values[i] = cell == null ? "" :
                            cell.getCellType() == CellType.NUMERIC ?
                                    String.valueOf((int) cell.getNumericCellValue()) :
                                    cell.getStringCellValue().trim();
                }
                rows.add(values);
            }
        }
        return processRows(rows, file.getOriginalFilename(),
                userId, userName, "EXCEL");
    }

    // Shared logic for both CSV and Excel — validate + save each row
    private UploadResult processRows(List<String[]> rows, String filename,
                                     String userId, String userName, String source) {
        int imported = 0;
        List<String> errors = new ArrayList<>();

        for (int i = 0; i < rows.size(); i++) {
            String[] cols = rows.get(i);
            int rowNum = i + 2; // +2 because row 1 was the header
            try {
                // Validate required text fields are not empty
                if (cols[0].isBlank()) throw new Exception("villageName is empty");
                if (cols[1].isBlank()) throw new Exception("block is empty");
                if (cols[2].isBlank()) throw new Exception("district is empty");
                if (cols[3].isBlank()) throw new Exception("state is empty");

                // Parse numeric fields — will throw NumberFormatException if bad
                int popTotal = Integer.parseInt(cols[4].trim());
                int popMale  = Integer.parseInt(cols[5].trim());
                int popFem   = Integer.parseInt(cols[6].trim());
                int popChild = Integer.parseInt(cols[7].trim());
                int popSen   = Integer.parseInt(cols[8].trim());
                int popFarm  = Integer.parseInt(cols[9].trim());
                int popSal   = Integer.parseInt(cols[10].trim());
                int popBiz   = Integer.parseInt(cols[11].trim());
                String cropType = cols[12].trim();

                // harvestMonths is comma-separated: "3,4" -> [3, 4]
                List<Integer> harvestMonths = Arrays.stream(
                                cols[13].trim().split(","))
                        .map(s -> Integer.parseInt(s.trim()))
                        .toList();

                // Build and save village
                Village v = Village.builder()
                        .villageName(cols[0].trim())
                        .block(cols[1].trim())
                        .district(cols[2].trim())
                        .state(cols[3].trim())
                        .demographics(Village.Demographics.builder()
                                .popTotal(popTotal).popMale(popMale)
                                .popFemale(popFem).popChildUnder10(popChild)
                                .popSenior60Plus(popSen).popFarmer(popFarm)
                                .popSalaried(popSal).popBusiness(popBiz)
                                .build())
                        .cropCycle(Village.CropCycle.builder()
                                .type(cropType).harvestMonths(harvestMonths)
                                .build())
                        .uploadedBy(userId)
                        .uploadedAt(LocalDateTime.now())
                        .source(source)
                        .build();

                Village saved = villageRepository.save(v);
                // Trigger Python ML for this village
                recommendationService.generateForVillage(saved);
                imported++;

            } catch (Exception e) {
                // Row failed — record the error and continue to next row
                errors.add("Row " + rowNum + ": " + e.getMessage());
            }
        }

        // Save audit log
        UploadLog log = UploadLog.builder()
                .filename(filename)
                .uploadedBy(userId)
                .uploadedByName(userName)
                .uploadedAt(LocalDateTime.now())
                .source(source)
                .totalRows(rows.size())
                .importedRows(imported)
                .failedRows(errors.size())
                .errors(errors)
                .build();
        UploadLog saved = uploadRepository.save(log);

        return new UploadResult(saved.getId(), rows.size(),
                imported, errors.size(), errors);
    }
}
