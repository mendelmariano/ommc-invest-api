package com.ommcinvest.api.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ommcinvest.api.entity.User;
import com.ommcinvest.api.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public Page<User> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public User findById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User save(User user) {
        return repository.save(user);
    }

    public User update(UUID id, User user) {
        User existing = findById(id);
        existing.setUuid(user.getUuid());
        existing.setName(user.getName());
        existing.setWhatsapp(user.getWhatsapp());
        existing.setEmail(user.getEmail());
        existing.setPasswordHash(user.getPasswordHash());
        existing.setProfileId(user.getProfileId());
        existing.setCreatedAt(user.getCreatedAt());
        existing.setUpdatedAt(user.getUpdatedAt());
        return repository.save(existing);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public User findByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }
}