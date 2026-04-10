package com.indiapost.financialneeds.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MelaRequest {
    @NotBlank private String villageId;
    @NotBlank private String schemeCode;
    @NotNull  private LocalDate scheduledDate;
    @NotBlank private String venue;
}
