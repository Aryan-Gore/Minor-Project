package com.indiapost.financialneeds.controller;

import com.indiapost.financialneeds.dto.VillageRequest;
import com.indiapost.financialneeds.model.Village;
import com.indiapost.financialneeds.service.VillageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/villages")
public class VillageController {

    private final VillageService villageService;

    public VillageController(VillageService villageService) {
        this.villageService = villageService;
    }

    // GET /api/villages?state=WB&district=Bongaon&block=xyz
    // @RequestParam(required=false) = query parameter, optional
    @GetMapping
    public ResponseEntity<List<Village>> getVillages(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String block) {
        return ResponseEntity.ok(
                villageService.getVillages(state, district, block));
    }

    // GET /api/villages/abc123
    // @PathVariable = reads {id} from the URL path
    @GetMapping("/{id}")
    public ResponseEntity<Village> getVillage(@PathVariable String id) {
        return ResponseEntity.ok(villageService.getVillageById(id));
    }

    // POST /api/villages — manual entry
    @PostMapping
    public ResponseEntity<Village> createVillage(
            @Valid @RequestBody VillageRequest request) {
        // Get the logged-in user's ID from the JWT (set by JwtFilter)
        String userId = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ResponseEntity.ok(
                villageService.createVillage(request, userId));
    }
}
