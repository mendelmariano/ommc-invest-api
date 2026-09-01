package com.ommcinvest.api.controller;

import com.ommcinvest.api.dto.MonthlyPatrimonyTotalDTO;
import com.ommcinvest.api.dto.PatrimonyDTO;
import com.ommcinvest.api.entity.Patrimony;
import com.ommcinvest.api.service.PatrimonyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import javax.validation.Valid;

@RestController
@RequestMapping("/patrimonies")
public class PatrimonyController {

    @Autowired
    private PatrimonyService service;

    @GetMapping
    public Page<PatrimonyDTO> getAll(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Patrimony> patrimonies = service.findAll(pageable);
        return patrimonies.map(this::toDTO);
    }

    @GetMapping("/forUser/{userId}/untilDate")
    public List<Patrimony> getActiveTotalByUserIdAndUntilDate(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam int year,
            @RequestParam int month
    ) {
        Pageable pageable = PageRequest.of(page, size);

       return service.findByUserIdMonth(userId, month, year, pageable).getContent();
    }

    @GetMapping("/forUser/{userId}")
    public Page<PatrimonyDTO> getByUserId(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam int month,
            @RequestParam int year
    ) {

        Pageable pageable = PageRequest.of(page, size);
        System.out.println("Fetching patrimonies for userId: " + userId + ", year: " + year + ", month: " + month);
        Page<Patrimony> patrimonies =
                service.findByUserIdMonth(userId, month, year, pageable);

        return patrimonies.map(this::toDTO);
    }

    @GetMapping("/forUser/{userId}/latest-by-month")
    public ResponseEntity<BigDecimal> getLatestByUserIdAndMonth(
            @PathVariable UUID userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        BigDecimal patrimonies = service.getActiveTotalByUserIdAndMonth(userId, year, month);
        return ResponseEntity.ok(patrimonies);
    }

    @GetMapping("/forUser/{userId}/total")
    public ResponseEntity<BigDecimal> getActiveTotalByUserIdAndMonth(
            @PathVariable UUID userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        System.out.println("Calculating total for userId: " + userId + ", year: " + year + ", month: " + month);
        BigDecimal total = service.findActivePatrimonyTotalByUserIdAndYearAndMonth(userId, year, month);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/forUser/{userId}/totals-by-month")
    public List<MonthlyPatrimonyTotalDTO> getActiveTotalsByUserIdGroupedByMonth(
            @PathVariable UUID userId
    ) {
        return service.getActiveTotalsByUserIdGroupedByMonth(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatrimonyDTO> getById(@PathVariable Integer id) {
        Patrimony patrimony = service.findById(id);
        return ResponseEntity.ok(toDTO(patrimony));
    }

    @PostMapping
    public ResponseEntity<PatrimonyDTO> create(@Valid @RequestBody PatrimonyDTO dto) {
        Patrimony patrimony = toEntity(dto);
        Patrimony saved = service.save(patrimony);
        return ResponseEntity.ok(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatrimonyDTO> update(@PathVariable Integer id, @Valid @RequestBody PatrimonyDTO dto) {
        Patrimony patrimony = toEntity(dto);
        Patrimony updated = service.update(id, patrimony);
        return ResponseEntity.ok(toDTO(updated));
    }

    @PutMapping("/{id}/price-date")
    public ResponseEntity<PatrimonyDTO> updatePriceAndDate(@PathVariable Integer id, @Valid @RequestBody com.ommcinvest.api.dto.PriceDataUpdateDTO dto) {
        Patrimony updated = service.updatePriceAndData(id, dto.getPrice(), dto.getData());
        return ResponseEntity.ok(toDTO(updated));
    }

    @PostMapping("/{id}/resgatar")
    public ResponseEntity<PatrimonyDTO> resgatar(@PathVariable Integer id) {
        Patrimony updated = service.resgatar(id);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private PatrimonyDTO toDTO(Patrimony patrimony) {
        return new PatrimonyDTO(patrimony.getId(), patrimony.getName(), patrimony.getDescription(), patrimony.getTypeId(), patrimony.getPrice(), patrimony.getData(), patrimony.getCategoryId(), patrimony.getUserId(), patrimony.getStatus(), patrimony.getCreatedAt(), patrimony.getUpdatedAt());
    }

    private Patrimony toEntity(PatrimonyDTO dto) {
        Patrimony patrimony = new Patrimony();
        patrimony.setId(dto.getId());
        patrimony.setName(dto.getName());
        patrimony.setDescription(dto.getDescription());
        patrimony.setTypeId(dto.getTypeId());
        patrimony.setPrice(dto.getPrice());
        patrimony.setData(dto.getData());
        patrimony.setCategoryId(dto.getCategoryId());
        patrimony.setUserId(dto.getUserId());
        patrimony.setStatus(dto.getStatus());
        return patrimony;
    }
}