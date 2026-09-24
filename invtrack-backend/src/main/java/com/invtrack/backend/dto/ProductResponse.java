package com.invtrack.backend.dto;

import java.math.BigDecimal;

public class ProductResponse {

    private Long id;
    private String name;
    private String sku;
    private String brand;
    private String model;
    private BigDecimal price;
    private Integer quantity;
    private String category;
    private String specifications;

    public ProductResponse() {
    }

    public ProductResponse(
            Long id,
            String name,
            String sku,
            String brand,
            String model,
            BigDecimal price,
            Integer quantity,
            String category,
            String specifications) {

        this.id = id;
        this.name = name;
        this.sku = sku;
        this.brand = brand;
        this.model = model;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
        this.specifications = specifications;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSku() {
        return sku;
    }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public String getCategory() {
        return category;
    }

    public String getSpecifications() {
        return specifications;
    }
}