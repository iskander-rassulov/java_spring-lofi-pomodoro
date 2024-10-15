package com.iskander.lofipomodoro;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.MediaType;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

@RestController
public class LoginController {

    @GetMapping("/login")
    public void loginWithTodoist(HttpServletResponse response) throws IOException {
        String clientId = "26a5d4bcf1794b20bc23d2027d1f92e5";  // Твой Client ID
        String redirectUri = "http://localhost:8080/callback";
        String authUrl = "https://todoist.com/oauth/authorize?client_id=" + clientId + "&scope=data:read_write&state=someRandomString&redirect_uri=" + redirectUri;

        response.sendRedirect(authUrl);
    }

    @GetMapping("/callback")
    public String callback(@RequestParam String code, HttpSession session) {
        String clientId = "26a5d4bcf1794b20bc23d2027d1f92e5";
        String clientSecret = "";
        String redirectUri = "http://localhost:8080/callback";

        WebClient webClient = WebClient.create();
        String token = webClient.post()
                .uri("https://todoist.com/oauth/access_token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("client_id", clientId)
                        .with("client_secret", clientSecret)
                        .with("code", code)
                        .with("redirect_uri", redirectUri))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block()
                .get("access_token")
                .asText();

        // Сохраняем токен в сессии
        if (token != null && !token.isEmpty()) {
            session.setAttribute("accessToken", token);

            // Перенаправляем на /todoist/tasks
            return "redirect:/todoist/tasks";
        } else {
            // Если токен не получен, перенаправляем на страницу с ошибкой
            return "redirect:/error";
        }
    }





}