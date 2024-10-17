package com.iskander.lofipomodoro;

import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;  // Добавьте этот импорт
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);  // Инициализируем логгер

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, String>> getUserInfo(HttpSession session) {
        String name = (String) session.getAttribute("userName");
        String avatar = (String) session.getAttribute("avatarUrl");

        logger.info("Fetching user info from session: name={}, avatar={}", name, avatar);

        if (name != null && avatar != null) {
            return ResponseEntity.ok(Map.of("name", name, "avatar", avatar));
        } else {
            return ResponseEntity.status(401).build();
        }
    }
}
