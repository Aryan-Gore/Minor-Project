package com.indiapost.financialneeds.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class VillageRequest {

    @NotBlank(message = "Village name is required")
    private String villageName;

    @NotBlank private String block;
    @NotBlank private String district;
    @NotBlank private String state;

    @Min(value = 1, message = "Total population must be at least 1")
    private int popTotal;

    @Min(0) private int popMale;
    @Min(0) private int popFemale;
    @Min(0) private int popChildUnder10;
    @Min(0) private int popSenior60Plus;
    @Min(0) private int popFarmer;
    @Min(0) private int popSalaried;
    @Min(0) private int popBusiness;

    @NotBlank(message = "Crop type required: Rabi, Kharif, or Both")
    private String cropType;

    @NotEmpty(message = "Harvest months required")
    private List<Integer> harvestMonths;
}
