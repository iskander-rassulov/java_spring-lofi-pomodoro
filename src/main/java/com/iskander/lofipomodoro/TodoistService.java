package com.iskander.lofipomodoro;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TodoistService {
    private final String API_URL = "https://api.todoist.com/rest/v1/tasks";
    private final String TOKEN = "your_todoist_token";

    private final RestTemplate restTemplate;

    public TodoistService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getTasks() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(TOKEN);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    // Другие методы для взаимодействия с API (например, добавление задачи)
}
