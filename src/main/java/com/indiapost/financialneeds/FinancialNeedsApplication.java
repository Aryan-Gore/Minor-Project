package com.indiapost.financialneeds;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan
// This tells Spring to scan all classes in this package and set everything up
@SpringBootApplication
public class FinancialNeedsApplication {

	public static void main(String[] args) {
		// This one line starts the entire Spring Boot application
		SpringApplication.run(FinancialNeedsApplication.class, args);
	}
}
