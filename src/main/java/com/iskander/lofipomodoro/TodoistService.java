package com.iskander.lofipomodoro;

import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class TodoistService {

    private final WebClient webClient;
    private final String API_TOKEN = "3ac25c8a4caeef2577d77673e9b624f64610eeea"; // Добавлен токен

    public TodoistService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.todoist.com/rest/v1").build();
    }

    public List<Map<String, Object>> getTasks() {
        return webClient.get()
                .uri("https://api.todoist.com/rest/v2/tasks")  // Обновлённый URL
                .header("Authorization", "Bearer " + API_TOKEN)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();
    }

    public void addTask(String content) {
        webClient.post()
                .uri("https://api.todoist.com/rest/v2/tasks")  // Обновлённый URL
                .header("Authorization", "Bearer " + API_TOKEN)
                .bodyValue(Map.of("content", content))
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    public void deleteTask(Long taskId) {
        webClient.delete()
                .uri("https://api.todoist.com/rest/v2/tasks/{id}", taskId)  // Обновлённый URL
                .header("Authorization", "Bearer " + API_TOKEN)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    public void completeTask(Long taskId) {
        webClient.post()
                .uri("https://api.todoist.com/rest/v2/tasks/{id}/close", taskId)  // Обновлённый URL
                .header("Authorization", "Bearer " + API_TOKEN)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

}




