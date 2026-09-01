package com.ommcinvest.api.repository;

import com.ommcinvest.api.dto.MonthlyPatrimonyTotalDTO;
import com.ommcinvest.api.entity.Patrimony;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface PatrimonyRepository extends JpaRepository<Patrimony, Integer> {

    @Query("SELECT p FROM Patrimony p WHERE p.userId = :userId AND p.status = 1 AND p.data = (SELECT MAX(p2.data) FROM Patrimony p2 WHERE p2.name = p.name AND p2.userId = p.userId AND p2.status = 1)")
    Page<Patrimony> findLatestPatrimoniesByUserId(
            @Param("userId") UUID userId,
            Pageable pageable
    );

    @Query("SELECT p " +
        "FROM Patrimony p " +
        "WHERE p.userId = :userId " +
        "  AND p.status = 1 " +
        "  AND p.updatedAt = ( " +
        "        SELECT MAX(p2.updatedAt) " +
        "        FROM Patrimony p2 " +
        "        WHERE p2.name = p.name " +
        "          AND p2.userId = p.userId " +
        "          AND p2.status = 1 " +
        "          AND p2.updatedAt <= :fimMes " +
        "  ) " +
        "  AND NOT EXISTS ( " +
        "        SELECT 1 " +
        "        FROM Patrimony p3 " +
        "        WHERE p3.userId = p.userId " +
        "          AND p3.name = p.name " +
        "          AND p3.status = 0 " +
        "          AND p3.updatedAt <= :fimMes " +
        "  )")
Page<Patrimony> findLatestPatrimoniesByUserIdPeriod(
        @Param("userId") UUID userId,
        @Param("fimMes") LocalDateTime fimMes,
        Pageable pageable
);

    @Query("SELECT COALESCE(SUM(p.price), 0) FROM Patrimony p WHERE p.userId = :userId AND p.status = 1 AND YEAR(p.data) = :year AND MONTH(p.data) = :month AND p.data = (SELECT MAX(p2.data) FROM Patrimony p2 WHERE p2.name = p.name AND p2.userId = p.userId AND p2.status = 1)")
    BigDecimal findActivePatrimonyTotalByUserIdAndYearAndMonth(
            @Param("userId") UUID userId,
            @Param("year") int year,
            @Param("month") int month
    );

    @Query("SELECT COALESCE(SUM(p.price), 0)\n" + //
                "    FROM Patrimony p\n" + //
                "    WHERE p.userId = :userId\n" + //
                "    AND p.status = 1\n" + //
                "    AND p.data <= :end\n" + //
                "    AND p.data = (\n" + //
                "        SELECT MAX(p2.data)\n" + //
                "        FROM Patrimony p2\n" + //
                "        WHERE p2.name = p.name\n" + //
                "        AND p2.userId = p.userId\n" + //
                "        AND p2.status = 1\n" + //
                "        AND p2.data <= :end\n" + //
                "    )")
    BigDecimal findActivePatrimonyTotalByUserIdUntilDate(
            @Param("userId") UUID userId,
            @Param("end") LocalDateTime end
    );
    

    @Query("SELECT p FROM Patrimony p WHERE p.userId = :userId AND p.status = 1 AND p.data <= :end AND p.data = (SELECT MAX(p2.data) FROM Patrimony p2 WHERE p2.name = p.name AND p2.userId = p.userId AND p2.status = 1 AND p2.data <= :end)")
    List<Patrimony> findLatestPatrimoniesByUserIdUntilDate(
            @Param("userId") UUID userId,
            @Param("end") LocalDateTime end
    );

    @Query("SELECT new com.ommcinvest.api.dto.MonthlyPatrimonyTotalDTO(YEAR(p.data), MONTH(p.data), SUM(p.price)) FROM Patrimony p WHERE p.userId = :userId AND p.status = 1 AND p.data = (SELECT MAX(p2.data) FROM Patrimony p2 WHERE p2.name = p.name AND p2.userId = p.userId AND p2.status = 1) GROUP BY YEAR(p.data), MONTH(p.data) ORDER BY YEAR(p.data), MONTH(p.data)")
    List<MonthlyPatrimonyTotalDTO> findActivePatrimonyTotalsByUserIdGroupedByMonth(
            @Param("userId") UUID userId
    );
}