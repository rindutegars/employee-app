package com.rindu.testcase3.controller;

import com.rindu.testcase3.dto.request.EmployeeRequestDTO;
import com.rindu.testcase3.dto.response.EmployeeResponseDTO;
import com.rindu.testcase3.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    // http://localhost:8080/api/employees/create (single and multiple)

    @PostMapping("/create")
    public ResponseEntity<List<EmployeeResponseDTO>> createEmployees(
            @RequestBody Object employeeRequestDTO) {
        List<EmployeeResponseDTO> responseDTOs = employeeService.createEmployees(employeeRequestDTO);
        return ResponseEntity.ok(responseDTOs);
    }

    @PutMapping("/update")
    public ResponseEntity<List<EmployeeResponseDTO>> updateEmployees(
            @RequestBody Map<Long, EmployeeRequestDTO> employeeRequestMap) {
        List<EmployeeResponseDTO> responseDTOs = employeeService.updateEmployees(employeeRequestMap);
        return ResponseEntity.ok(responseDTOs);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<EmployeeResponseDTO> updateEmployee(
            @PathVariable Long id, @RequestBody EmployeeRequestDTO employeeRequestDTO) {
        EmployeeResponseDTO responseDTO = employeeService.updateEmployee(id, employeeRequestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteEmployees(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());
        employeeService.deleteEmployees(idList);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<EmployeeResponseDTO> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public EmployeeResponseDTO getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

}
