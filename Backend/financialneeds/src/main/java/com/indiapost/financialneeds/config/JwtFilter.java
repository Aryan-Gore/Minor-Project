package com.indiapost.financialneeds.config;

import com.indiapost.financialneeds.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

// OncePerRequestFilter = runs exactly once per HTTP request
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // Constructor injection — Spring automatically provides these
    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        // Read the Authorization header from the request
        String header = request.getHeader("Authorization");

        // If no token or does not start with Bearer, skip authentication
        // The SecurityConfig will block protected routes
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // Remove "Bearer " prefix to get the raw token
        String token = header.substring(7);

        // Validate token — if invalid, skip (SecurityConfig blocks the route)
        if (!jwtUtil.isTokenValid(token)) {
            chain.doFilter(request, response);
            return;
        }

        // Extract user info from token
        String userId = jwtUtil.extractUserId(token);
        String role   = jwtUtil.extractRole(token);

        // Tell Spring Security: this user is authenticated with this role
        // ROLE_ prefix is required by Spring Security convention
        var auth = new UsernamePasswordAuthenticationToken(
                userId, null,
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Continue to the controller
        chain.doFilter(request, response);
    }
}
