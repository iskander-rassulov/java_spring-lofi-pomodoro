package com.iskander.lofipomodoro;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

@Service
public class TodoistService {

    @Value("${todoist.client_id}")
    private String clientId;

    @Value("${todoist.client_secret}")
    private String clientSecret;

    public List<Map<String, Object>> getTasks(String accessToken) {
        WebClient webClient = WebClient.create();
        return webClient.get()
                .uri("https://api.todoist.com/rest/v1/tasks")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToFlux(new ParameterizedTypeReference<Map<String, Object>>() {})
                .collectList()
                .block();
    }


    public void addTask(String content, String accessToken) {
        WebClient webClient = WebClient.create();
        webClient.post()
                .uri("https://api.todoist.com/rest/v1/tasks")
                .header("Authorization", "Bearer " + accessToken)
                .body(BodyInserters.fromValue(Map.of("content", content)))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }

    public void deleteTask(Long taskId, String accessToken) {
        WebClient webClient = WebClient.create();
        webClient.delete()
                .uri("https://api.todoist.com/rest/v1/tasks/" + taskId)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    public void completeTask(Long taskId, String accessToken) {
        WebClient webClient = WebClient.create();
        webClient.post()
                .uri("https://api.todoist.com/rest/v1/tasks/" + taskId + "/close")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}
