package com.ommcinvest.api.service;

import com.ommcinvest.api.entity.Patrimony;
import com.ommcinvest.api.repository.PatrimonyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PatrimonyService {

    @Autowired
    private PatrimonyRepository repository;

    public Page<Patrimony> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Patrimony findById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Patrimony not found"));
    }

    public Patrimony save(Patrimony patrimony) {
        return repository.save(patrimony);
    }

    public Patrimony update(Integer id, Patrimony patrimony) {
        Patrimony existing = findById(id);
        existing.setName(patrimony.getName());
        existing.setDescription(patrimony.getDescription());
        existing.setTypeId(patrimony.getTypeId());
        existing.setPrice(patrimony.getPrice());
        existing.setData(patrimony.getData());
        existing.setCategoryId(patrimony.getCategoryId());
        existing.setUserId(patrimony.getUserId());
        existing.setStatus(patrimony.getStatus());
        existing.setCreatedAt(patrimony.getCreatedAt());
        existing.setUpdatedAt(patrimony.getUpdatedAt());
        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}