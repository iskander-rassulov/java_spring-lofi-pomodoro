package com.iskander.lofipomodoro;

import com.iskander.lofipomodoro.TodoistService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;  // Добавьте этот импорт
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.net.URI;
import java.util.Map;

@RestController
public class TodoistAuthController {

    private static final Logger logger = LoggerFactory.getLogger(TodoistAuthController.class);  // Инициализируем логгер

    private final TodoistService todoistService;

    public TodoistAuthController(TodoistService todoistService) {
        this.todoistService = todoistService;
    }

    @GetMapping("/todoist/login")
    public ResponseEntity<Void> loginWithTodoist() {
        String authorizationUrl = todoistService.getAuthorizationUrl();
        logger.info("Redirecting to Todoist login URL: {}", authorizationUrl);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(authorizationUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/todoist/callback")
    public ModelAndView todoistCallback(String code, HttpSession session) {
        try {
            logger.info("Received code from Todoist: {}", code);
            // Обмен кода на access_token
            String accessToken = todoistService.exchangeCodeForAccessToken(code);
            logger.info("Received accessToken: {}", accessToken);
            session.setAttribute("accessToken", accessToken);

            // Получение информации о пользователе
            Map<String, Object> userInfo = todoistService.getUserInfo(accessToken);
            logger.info("User info received: {}", userInfo);

            if (userInfo != null) {
                String fullName = (String) userInfo.get("full_name");
                String avatarBig = (String) userInfo.get("avatar_big");

                session.setAttribute("userName", fullName);
                session.setAttribute("avatarUrl", avatarBig);

                logger.info("User name: {}, Avatar URL: {}", fullName, avatarBig);
            }

            // Перенаправление на главную страницу
            return new ModelAndView("redirect:/");
        } catch (Exception e) {
            logger.error("Error during Todoist callback processing", e);
            return new ModelAndView("error");
        }
    }
}
