package com.ommcinvest.api.dto;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PriceDataUpdateDTO {

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotNull(message = "Data is required")
    private LocalDateTime data;

    public PriceDataUpdateDTO() {}

    public PriceDataUpdateDTO(BigDecimal price, LocalDateTime data) {
        this.price = price;
        this.data = data;
    }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }
}