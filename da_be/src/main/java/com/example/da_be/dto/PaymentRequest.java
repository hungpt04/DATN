package com.example.da_be.dto;

public class PaymentRequest {
    private long amount;
    private String orderInfo;

    // Getter và Setter
    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }

    public String getOrderInfo() {
        return orderInfo;
    }

    public void setOrderInfo(String orderInfo) {
        this.orderInfo = orderInfo;
    }
}