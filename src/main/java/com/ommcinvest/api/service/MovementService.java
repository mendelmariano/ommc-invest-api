package com.ommcinvest.api.service;

import com.ommcinvest.api.entity.Movement;
import com.ommcinvest.api.entity.User;
import com.ommcinvest.api.repository.MovementRepository;
import com.ommcinvest.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@Service
public class MovementService {

    private static final int RECEITA_TYPE_ID = 1;
    private static final int DESPESA_TYPE_ID = 2;
    private static final DateTimeFormatter[] DATE_TIME_FORMATTERS = new DateTimeFormatter[] {
            DateTimeFormatter.ISO_DATE_TIME,
            DateTimeFormatter.ISO_LOCAL_DATE_TIME,
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
    };

    private static final DateTimeFormatter[] DATE_ONLY_FORMATTERS = new DateTimeFormatter[] {
            DateTimeFormatter.ISO_DATE,
            DateTimeFormatter.ofPattern("dd/MM/yyyy")
    };

    @Autowired
    private MovementRepository repository;

    @Autowired
    private UserRepository userRepository;

    public Page<Movement> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Movement findById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Movement not found"));
    }

    public Movement save(Movement movement) {
        return repository.save(movement);
    }

    public Movement saveReceita(Movement movement) {
        movement.setTypeId(RECEITA_TYPE_ID);
        movement.setUserId(getAuthenticatedUserId());
        return repository.save(movement);
    }

    private LocalDateTime parsePeriod(String value, LocalDateTime fallback, boolean endOfDay) {
        if (value == null || value.isBlank()) {
            return fallback;
        }

        String trimmed = value.trim();
        for (DateTimeFormatter formatter : DATE_ONLY_FORMATTERS) {
            try {
                LocalDate date = LocalDate.parse(trimmed, formatter);
                return endOfDay ? date.atTime(23, 59, 59, 999_999_999) : date.atStartOfDay();
            } catch (DateTimeParseException ignored) {
            }
        }

        for (DateTimeFormatter formatter : DATE_TIME_FORMATTERS) {
            try {
                return LocalDateTime.parse(trimmed, formatter);
            } catch (DateTimeParseException ignored) {
            }
        }

        throw new IllegalArgumentException("Formato de data inválido: '" + value + "'. Use yyyy-MM-dd, yyyy-MM-ddTHH:mm:ss ou dd/MM/yyyy.");
    }

    public Page<Movement> buscarReceitasPorPeriodo(
        Pageable pageable,
        String start,
        String end) {

    UUID userId = getAuthenticatedUserId();

    LocalDate startDate =
            start != null && !start.isBlank()
                    ? LocalDate.parse(start)
                    : LocalDate.of(1970, 1, 1);

    LocalDate endDate =
            end != null && !end.isBlank()
                    ? LocalDate.parse(end)
                    : LocalDate.now();

    return repository.findByTypeIdAndUserIdAndDataBetween(
            pageable,
            RECEITA_TYPE_ID,
            userId,
            startDate,
            endDate
    );
}

        public Page<Movement> buscarDespesasPorPeriodo(
            Pageable pageable,
            String start,
            String end) {

        UUID userId = getAuthenticatedUserId();

        LocalDate startDate =
                start != null && !start.isBlank()
                        ? LocalDate.parse(start)
                        : LocalDate.of(1970, 1, 1);

        LocalDate endDate =
                end != null && !end.isBlank()
                        ? LocalDate.parse(end)
                        : LocalDate.now();

        return repository.findByTypeIdAndUserIdAndDataBetween(
                pageable,
                DESPESA_TYPE_ID,
                userId,
                startDate,
                endDate
        );
    }

    private UUID getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            throw new RuntimeException("Usuário não autenticado");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado"));

        return user.getId();
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