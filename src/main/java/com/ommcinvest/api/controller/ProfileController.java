package com.ommcinvest.api.controller;

import com.ommcinvest.api.dto.ProfileDTO;
import com.ommcinvest.api.entity.Profile;
import com.ommcinvest.api.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/profiles")
public class ProfileController {

    @Autowired
    private ProfileService service;

    @GetMapping
    public Page<ProfileDTO> getAll(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Profile> profiles = service.findAll(pageable);
        return profiles.map(this::toDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfileDTO> getById(@PathVariable Integer id) {
        Profile profile = service.findById(id);
        return ResponseEntity.ok(toDTO(profile));
    }

    @PostMapping
    public ResponseEntity<ProfileDTO> create(@Valid @RequestBody ProfileDTO dto) {
        Profile profile = toEntity(dto);
        Profile saved = service.save(profile);
        return ResponseEntity.ok(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfileDTO> update(@PathVariable Integer id, @Valid @RequestBody ProfileDTO dto) {
        Profile profile = toEntity(dto);
        Profile updated = service.update(id, profile);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private ProfileDTO toDTO(Profile profile) {
        return new ProfileDTO(profile.getId(), profile.getName(), profile.getCreatedAt(), profile.getUpdatedAt());
    }

    private Profile toEntity(ProfileDTO dto) {
        Profile profile = new Profile();
        profile.setId(dto.getId());
        profile.setName(dto.getName());
        profile.setCreatedAt(dto.getCreatedAt());
        profile.setUpdatedAt(dto.getUpdatedAt());
        return profile;
    }
}