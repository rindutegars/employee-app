package com.rindu.testcase3.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class EmployeeRequestDTO {
    private String name;
    private String position;
    private Double salary;
}