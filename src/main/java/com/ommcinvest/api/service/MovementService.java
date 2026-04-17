package com.ommcinvest.api.service;

import com.ommcinvest.api.entity.Movement;
import com.ommcinvest.api.repository.MovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MovementService {

    @Autowired
    private MovementRepository repository;

    public Page<Movement> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Movement findById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Movement not found"));
    }

    public Movement save(Movement movement) {
        return repository.save(movement);
    }

    public Movement update(UUID id, Movement movement) {
        Movement existing = findById(id);
        existing.setName(movement.getName());
        existing.setDescription(movement.getDescription());
        existing.setData(movement.getData());
        existing.setTypeId(movement.getTypeId());
        existing.setPrice(movement.getPrice());
        existing.setCategoryId(movement.getCategoryId());
        existing.setUserId(movement.getUserId());
        existing.setCreatedAt(movement.getCreatedAt());
        existing.setUpdatedAt(movement.getUpdatedAt());
        return repository.save(existing);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}