package com.rindu.testcase3.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rindu.testcase3.dto.request.EmployeeRequestDTO;
import com.rindu.testcase3.dto.response.EmployeeResponseDTO;
import com.rindu.testcase3.model.Employee;
import com.rindu.testcase3.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<EmployeeResponseDTO> createEmployees(Object employeeRequestDTO) {
        List<Employee> employees = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();

        if (employeeRequestDTO instanceof List) {
            List<?> requestList = (List<?>) employeeRequestDTO;
            employees = requestList.stream()
                    .map(item -> objectMapper.convertValue(item, EmployeeRequestDTO.class))
                    .map(dto -> {
                        Employee employee = new Employee();
                        employee.setName(dto.getName());
                        employee.setPosition(dto.getPosition());
                        employee.setSalary(dto.getSalary());
                        return employee;
                    })
                    .collect(Collectors.toList());
        } else {
            EmployeeRequestDTO dto = objectMapper.convertValue(employeeRequestDTO, EmployeeRequestDTO.class);
            Employee employee = new Employee();
            employee.setName(dto.getName());
            employee.setPosition(dto.getPosition());
            employee.setSalary(dto.getSalary());
            employees.add(employee);
        }

        employees = employeeRepository.saveAll(employees);
        return employees.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    public List<EmployeeResponseDTO> updateEmployees(Map<Long, EmployeeRequestDTO> employeeRequestMap) {
        List<Employee> employeesToUpdate = employeeRequestMap.entrySet().stream()
                .map(entry -> {
                    Long id = entry.getKey();
                    EmployeeRequestDTO dto = entry.getValue();
                    Employee employee = employeeRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Employee not found"));
                    employee.setName(dto.getName());
                    employee.setPosition(dto.getPosition());
                    employee.setSalary(dto.getSalary());
                    return employee;
                })
                .collect(Collectors.toList());

        employeesToUpdate = employeeRepository.saveAll(employeesToUpdate);
        return employeesToUpdate.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO employeeRequestDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        employee.setName(employeeRequestDTO.getName());
        employee.setPosition(employeeRequestDTO.getPosition());
        employee.setSalary(employeeRequestDTO.getSalary());
        employee = employeeRepository.save(employee);
        return mapToResponseDTO(employee);
    }

    public void deleteEmployees(List<Long> ids) {
        List<Employee> employeesToDelete = ids.stream()
                .map(id -> employeeRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Employee not found")))
                .collect(Collectors.toList());
        employeeRepository.deleteAll(employeesToDelete);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        employeeRepository.delete(employee);
    }

    // Private method untuk mapping dari entity ke response DTO
    private EmployeeResponseDTO mapToResponseDTO(Employee employee) {
        EmployeeResponseDTO responseDTO = new EmployeeResponseDTO();
        responseDTO.setId(employee.getId());
        responseDTO.setName(employee.getName());
        responseDTO.setPosition(employee.getPosition());
        responseDTO.setSalary(employee.getSalary());
        return responseDTO;
    }

    public List<EmployeeResponseDTO> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return mapToResponseDTO(employee);
    }
}
