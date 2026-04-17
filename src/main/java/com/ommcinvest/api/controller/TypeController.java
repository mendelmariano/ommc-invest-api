package com.ommcinvest.api.controller;

import com.ommcinvest.api.dto.TypeDTO;
import com.ommcinvest.api.entity.Type;
import com.ommcinvest.api.service.TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/types")
public class TypeController {

    @Autowired
    private TypeService service;

    @GetMapping
    public Page<TypeDTO> getAll(@RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Type> types = service.findAll(pageable);
        return types.map(this::toDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TypeDTO> getById(@PathVariable Integer id) {
        Type type = service.findById(id);
        return ResponseEntity.ok(toDTO(type));
    }

    @PostMapping
    public ResponseEntity<TypeDTO> create(@Valid @RequestBody TypeDTO dto) {
        Type type = toEntity(dto);
        Type saved = service.save(type);
        return ResponseEntity.ok(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TypeDTO> update(@PathVariable Integer id, @Valid @RequestBody TypeDTO dto) {
        Type type = toEntity(dto);
        Type updated = service.update(id, type);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private TypeDTO toDTO(Type type) {
        return new TypeDTO(type.getId(), type.getName(), type.getCreatedAt(), type.getUpdatedAt());
    }

    private Type toEntity(TypeDTO dto) {
        Type type = new Type();
        type.setId(dto.getId());
        type.setName(dto.getName());
        type.setCreatedAt(dto.getCreatedAt());
        type.setUpdatedAt(dto.getUpdatedAt());
        return type;
    }
}