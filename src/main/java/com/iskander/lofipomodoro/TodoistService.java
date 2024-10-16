package com.iskander.lofipomodoro;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class TodoistService {

    @Value("${TODOIST_CLIENT_ID}")
    private String clientId;

    @Value("${TODOIST_CLIENT_SECRET}")
    private String clientSecret;

    private final WebClient webClient;

    public TodoistService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://todoist.com").build();
    }

    public String getAccessToken(String code) {
        return this.webClient.post()
                .uri("/oauth/access_token")
                .bodyValue("client_id=" + clientId + "&client_secret=" + clientSecret + "&code=" + code)
                .retrieve()
                .bodyToMono(String.class) // Здесь следует парсить ответ JSON
                .block();
    }

    // Добавьте метод для получения профиля пользователя
}

