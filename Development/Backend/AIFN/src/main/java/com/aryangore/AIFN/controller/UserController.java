package com.aryangore.AIFN.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("/dashboard")
    public String userDashboard(){
        return "Welcome User Dashboard";
    }
}