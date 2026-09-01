package com.ommcinvest.api.dto;

import java.math.BigDecimal;

public class MonthlyPatrimonyTotalDTO {

    private Integer year;
    private Integer month;
    private BigDecimal total;

    public MonthlyPatrimonyTotalDTO() {}

    public MonthlyPatrimonyTotalDTO(Integer year, Integer month, BigDecimal total) {
        this.year = year;
        this.month = month;
        this.total = total;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
