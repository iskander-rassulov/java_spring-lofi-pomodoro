package com.iskander.lofipomodoro;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class TodoistAuthController {

    @Value("${TODOIST_CLIENT_ID}")
    private String clientId;

    @Value("${TODOIST_CLIENT_SECRET}")
    private String clientSecret;

    @GetMapping("/login")
    public RedirectView login() {
        String authUrl = "https://todoist.com/oauth/authorize" +
                "?client_id=" + clientId +
                "&scope=data:read_write" +
                "&redirect_uri=http://localhost:8080/callback";
        return new RedirectView(authUrl);
    }

    @GetMapping("/callback")
    public RedirectView callback(@RequestParam("code") String code) {
        // Здесь обработка кода авторизации и получение токена
        // Вы можете создать сервис для взаимодействия с API Todoist

        // После получения токена, можно получить информацию о пользователе
        return new RedirectView("/user-info");
    }
}

