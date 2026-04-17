package com.ommcinvest.api.controller;

import com.ommcinvest.api.dto.MovementDTO;
import com.ommcinvest.api.entity.Movement;
import com.ommcinvest.api.service.MovementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/movements")
public class MovementController {

    @Autowired
    private MovementService service;

    @GetMapping
    public Page<MovementDTO> getAll(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movement> movements = service.findAll(pageable);
        return movements.map(this::toDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovementDTO> getById(@PathVariable UUID id) {
        Movement movement = service.findById(id);
        return ResponseEntity.ok(toDTO(movement));
    }

    @PostMapping
    public ResponseEntity<MovementDTO> create(@Valid @RequestBody MovementDTO dto) {
        Movement movement = toEntity(dto);
        Movement saved = service.save(movement);
        return ResponseEntity.ok(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovementDTO> update(@PathVariable UUID id, @Valid @RequestBody MovementDTO dto) {
        Movement movement = toEntity(dto);
        Movement updated = service.update(id, movement);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private MovementDTO toDTO(Movement movement) {
        return new MovementDTO(movement.getId(), movement.getName(), movement.getDescription(), movement.getData(), movement.getTypeId(), movement.getPrice(), movement.getCategoryId(), movement.getUserId(), movement.getCreatedAt(), movement.getUpdatedAt());
    }

    private Movement toEntity(MovementDTO dto) {
        Movement movement = new Movement();
        movement.setId(dto.getId());
        movement.setName(dto.getName());
        movement.setDescription(dto.getDescription());
        movement.setData(dto.getData());
        movement.setTypeId(dto.getTypeId());
        movement.setPrice(dto.getPrice());
        movement.setCategoryId(dto.getCategoryId());
        movement.setUserId(dto.getUserId());
        movement.setCreatedAt(dto.getCreatedAt());
        movement.setUpdatedAt(dto.getUpdatedAt());
        return movement;
    }
}