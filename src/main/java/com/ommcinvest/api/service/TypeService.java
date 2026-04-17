package com.ommcinvest.api.service;

import com.ommcinvest.api.entity.Type;
import com.ommcinvest.api.repository.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TypeService {

    @Autowired
    private TypeRepository repository;

    public Page<Type> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Type findById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Type not found"));
    }

    public Type save(Type type) {
        return repository.save(type);
    }

    public Type update(Integer id, Type type) {
        Type existing = findById(id);
        existing.setName(type.getName());
        existing.setCreatedAt(type.getCreatedAt());
        existing.setUpdatedAt(type.getUpdatedAt());
        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}