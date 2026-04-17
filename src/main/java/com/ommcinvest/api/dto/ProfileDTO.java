package com.ommcinvest.api.dto;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class ProfileDTO {

    private Integer id;
    @NotBlank(message = "Name is required")
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProfileDTO() {}

    public ProfileDTO(Integer id, String name, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}