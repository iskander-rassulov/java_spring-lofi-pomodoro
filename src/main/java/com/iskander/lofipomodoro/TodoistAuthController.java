package com.iskander.lofipomodoro;

import com.iskander.lofipomodoro.TodoistService;
import jakarta.servlet.http.HttpSession;
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

    private final TodoistService todoistService;

    public TodoistAuthController(TodoistService todoistService) {
        this.todoistService = todoistService;
    }

    @GetMapping("/todoist/login")
    public ResponseEntity<Void> loginWithTodoist() {
        String authorizationUrl = todoistService.getAuthorizationUrl();
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(authorizationUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/todoist/callback")
    public ModelAndView todoistCallback(String code, HttpSession session) {
        try {
            // Обмен кода на access_token
            String accessToken = todoistService.exchangeCodeForAccessToken(code);
            session.setAttribute("accessToken", accessToken);

            // Получение информации о пользователе
            Map<String, Object> userInfo = todoistService.getUserInfo(accessToken);
            if (userInfo != null) {
                String fullName = (String) userInfo.get("full_name");
                String avatarBig = (String) userInfo.get("avatar_big");

                session.setAttribute("userName", fullName);
                session.setAttribute("avatarUrl", avatarBig);
            }

            // Перенаправление на главную страницу
            return new ModelAndView("redirect:/");
        } catch (Exception e) {
            e.printStackTrace();
            return new ModelAndView("error");
        }
    }
}
