package com.indiapost.financialneeds.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow React dev server
        config.addAllowedOrigin("http://localhost:3000");
        // Allow all HTTP methods: GET, POST, PUT, PATCH, DELETE
        config.addAllowedMethod("*");
        // Allow all headers including Authorization
        config.addAllowedHeader("*");
        // Allow the Authorization header to be sent
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply to all routes
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
