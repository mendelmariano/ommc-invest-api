package com.ommcinvest.api.service;

import com.ommcinvest.api.entity.Profile;
import com.ommcinvest.api.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository repository;

    public Page<Profile> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Profile findById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public Profile save(Profile profile) {
        return repository.save(profile);
    }

    public Profile update(Integer id, Profile profile) {
        Profile existing = findById(id);
        existing.setName(profile.getName());
        existing.setCreatedAt(profile.getCreatedAt());
        existing.setUpdatedAt(profile.getUpdatedAt());
        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}