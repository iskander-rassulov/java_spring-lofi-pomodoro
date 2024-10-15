package com.iskander.lofipomodoro;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;

@Controller
public class LoginController {

    @Value("${todoist.client_id}")
    private String clientId;

    @Value("${todoist.client_secret}")
    private String clientSecret;

    @GetMapping("/callback")
    public String callback(@RequestParam String code, HttpSession session) {
        String redirectUri = "http://localhost:8080/callback";

        WebClient webClient = WebClient.create();
        String token = webClient.post()
                .uri("https://todoist.com/oauth/access_token")
                .body(BodyInserters.fromFormData("client_id", clientId)
                        .with("client_secret", clientSecret)
                        .with("code", code)
                        .with("redirect_uri", redirectUri))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block()
                .get("access_token")
                .asText();

        session.setAttribute("accessToken", token);

        return "redirect:/todoist/tasks";
    }
}
