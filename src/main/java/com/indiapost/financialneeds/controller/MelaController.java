package com.indiapost.financialneeds.controller;

import com.indiapost.financialneeds.dto.MelaRequest;
import com.indiapost.financialneeds.model.Mela;
import com.indiapost.financialneeds.service.MelaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/melas")
public class MelaController {

    private final MelaService melaService;

    public MelaController(MelaService melaService) {
        this.melaService = melaService;
    }

    // GET /api/melas?district=Bongaon&schemeCode=SSA
    @GetMapping
    public ResponseEntity<List<Mela>> getMelas(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String schemeCode) {
        return ResponseEntity.ok(melaService.getMelas(district, schemeCode));
    }

    // POST /api/melas — only USER role can create melas
    // @PreAuthorize checks role before the method runs
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Mela> createMela(
            @Valid @RequestBody MelaRequest request) {
        String userId = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ResponseEntity.ok(melaService.createMela(request, userId));
    }
}
