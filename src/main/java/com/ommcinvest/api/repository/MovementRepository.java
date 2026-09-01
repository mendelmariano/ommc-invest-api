package com.ommcinvest.api.repository;

import com.ommcinvest.api.entity.Movement;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface MovementRepository extends JpaRepository<Movement, UUID> {

    Page<Movement> findByTypeIdAndDataBetween(Pageable pageable, Integer typeId, LocalDate start, LocalDate end);

    Page<Movement> findByTypeIdAndUserIdAndDataBetween(Pageable pageable, Integer typeId, UUID userId, LocalDate start, LocalDate end);
}