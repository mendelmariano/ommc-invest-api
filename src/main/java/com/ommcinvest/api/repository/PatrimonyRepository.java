package com.ommcinvest.api.repository;

import com.ommcinvest.api.entity.Patrimony;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatrimonyRepository extends JpaRepository<Patrimony, Integer> {
}