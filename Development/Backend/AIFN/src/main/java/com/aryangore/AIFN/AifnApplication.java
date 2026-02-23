package com.aryangore.AIFN;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class AifnApplication {

		public static void main(String[] args) {

			SpringApplication.run(AifnApplication.class, args);

			System.out.println(new BCryptPasswordEncoder().encode("admin123"));
		}

	}
