package com.rindu.testcase3.dto.response;

import lombok.Data;

@Data
public class EmployeeResponseDTO {
    private Long id;
    private String name;
    private String position;
    private Double salary;
}