package com.ommcinvest.api.controller;

import com.ommcinvest.api.dto.PatrimonyDTO;
import com.ommcinvest.api.entity.Patrimony;
import com.ommcinvest.api.service.PatrimonyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        patrimony.setCreatedAt(dto.getCreatedAt());
        patrimony.setUpdatedAt(dto.getUpdatedAt());
        return patrimony;
    }
}