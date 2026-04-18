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

        // Allow your Vite frontend
        config.addAllowedOrigin("http://localhost:5173");
        // Also allow port 3000 just in case
        config.addAllowedOrigin("http://localhost:3000");

        //  Allow all HTTP methods
        config.addAllowedMethod("*");

        // Allow all headers including Authorization
        config.addAllowedHeader("*");

        // Allow credentials (needed for Authorization header)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}