package com.ommcinvest.api.service;

import com.ommcinvest.api.dto.MonthlyPatrimonyTotalDTO;
import com.ommcinvest.api.entity.Patrimony;
import com.ommcinvest.api.repository.PatrimonyRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

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

    public Page<Patrimony> findByUserId(UUID userId, Pageable pageable) {
        return repository.findLatestPatrimoniesByUserId(userId, pageable);
    }

     public Page<Patrimony> findByUserIdMonth(UUID userId, int month, int year, Pageable pageable) {
        LocalDateTime inicioMes = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime fimMes = inicioMes.withDayOfMonth(inicioMes.toLocalDate().lengthOfMonth()).withHour(23).withMinute(59).withSecond(59).withNano(999_999_999);
        return repository.findLatestPatrimoniesByUserIdPeriod(userId, fimMes, pageable);
    }

    public List<Patrimony> findLatestByUserIdAndMonth(UUID userId, int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59, 999_999_999);
        return repository.findLatestPatrimoniesByUserIdUntilDate(userId, end);
    }

    public java.math.BigDecimal getActiveTotalByUserIdAndMonth(UUID userId, int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59, 999_999_999);
        java.util.List<Patrimony> patrimonies = repository.findLatestPatrimoniesByUserIdUntilDate(userId, end);
        return patrimonies.stream()
                .map(Patrimony::getPrice)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public java.math.BigDecimal findActivePatrimonyTotalByUserIdAndYearAndMonth(UUID userId, int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59, 999_999_999);
        BigDecimal total = repository.findActivePatrimonyTotalByUserIdUntilDate(userId, end);
        return total != null ? total : BigDecimal.ZERO;
    }

    public List<MonthlyPatrimonyTotalDTO> getActiveTotalsByUserIdGroupedByMonth(UUID userId) {
        return repository.findActivePatrimonyTotalsByUserIdGroupedByMonth(userId);
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
        return repository.save(existing);
    }

   public Patrimony updatePriceAndData(Integer id, BigDecimal price, LocalDateTime data) {
        Patrimony existing = findById(id);

        Patrimony novo = new Patrimony();

        novo.setName(existing.getName());
        novo.setDescription(existing.getDescription());
        novo.setTypeId(existing.getTypeId());
        novo.setCategoryId(existing.getCategoryId());
        novo.setUserId(existing.getUserId());

        novo.setPrice(price);
        novo.setData(data);
        novo.setStatus(1);

        novo.setCreatedAt(LocalDateTime.now());
        novo.setUpdatedAt(LocalDateTime.now());

        return repository.save(novo);
    }

    public Patrimony resgatar(Integer id) {
        Patrimony existing = findById(id);
        existing.setStatus(0); // marcar como desativado/resgatado
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return repository.save(existing);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}