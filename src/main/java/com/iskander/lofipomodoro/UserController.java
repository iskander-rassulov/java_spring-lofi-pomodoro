package com.iskander.lofipomodoro;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, String>> getUserInfo(HttpSession session) {
        String name = (String) session.getAttribute("userName");
        String avatar = (String) session.getAttribute("avatarUrl");

        if (name != null && avatar != null) {
            return ResponseEntity.ok(Map.of("name", name, "avatar", avatar));
        } else {
            return ResponseEntity.status(401).build();
        }
    }
}
