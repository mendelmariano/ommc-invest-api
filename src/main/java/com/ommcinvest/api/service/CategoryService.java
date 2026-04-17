package com.ommcinvest.api.service;

import com.ommcinvest.api.entity.Category;
import com.ommcinvest.api.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    public Page<Category> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Category findById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category save(Category category) {
        return repository.save(category);
    }

    public Category update(Integer id, Category category) {
        Category existing = findById(id);
        existing.setName(category.getName());
        existing.setTypeId(category.getTypeId());
        existing.setCreatedAt(category.getCreatedAt());
        existing.setUpdatedAt(category.getUpdatedAt());
        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}