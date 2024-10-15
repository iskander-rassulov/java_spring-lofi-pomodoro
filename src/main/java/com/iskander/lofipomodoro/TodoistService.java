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

    public TodoistService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.todoist.com/rest/v1").build();
    }

    // Теперь токен передаётся в качестве параметра
    public List<Map<String, Object>> getTasks(String accessToken) {
        return webClient.get()
                .uri("https://api.todoist.com/rest/v2/tasks")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();
    }

    public void addTask(String content, String accessToken) {
        webClient.post()
                .uri("https://api.todoist.com/rest/v2/tasks")
                .header("Authorization", "Bearer " + accessToken)
                .bodyValue(Map.of("content", content))
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    public void deleteTask(Long taskId, String accessToken) {
        webClient.delete()
                .uri("https://api.todoist.com/rest/v2/tasks/{id}", taskId)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    public void completeTask(Long taskId, String accessToken) {
        webClient.post()
                .uri("https://api.todoist.com/rest/v2/tasks/{id}/close", taskId)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}





