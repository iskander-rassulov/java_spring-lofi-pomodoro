package com.iskander.lofipomodoro;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class TodoistService {

    @Value("${TODOIST_CLIENT_ID}")
    private String clientId;

    @Value("${TODOIST_REDIRECT_URI}")
    private String redirectUri;

    @Value("${TODOIST_CLIENT_SECRET}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    // Получение URL для авторизации
    public String getAuthorizationUrl() {
        return "https://todoist.com/oauth/authorize?client_id=" + clientId +
                "&scope=data:read&state=random_state_string&redirect_uri=" + redirectUri;
    }

    // Обмен кода на access_token
    public String exchangeCodeForAccessToken(String code) {
        String url = "https://todoist.com/oauth/access_token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("code", code);
        body.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> responseEntity = restTemplate.postForEntity(url, request, Map.class);

        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            Map<String, String> responseBody = responseEntity.getBody();
            return responseBody.get("access_token");
        } else {
            throw new RuntimeException("Failed to exchange code for access token");
        }
    }

    // Получение информации о пользователе
    public Map<String, Object> getUserInfo(String accessToken) {
        String userInfoUrl = "https://api.todoist.com/sync/v9/sync";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("sync_token", "*");
        body.add("resource_types", "[\"user\"]");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> responseEntity = restTemplate.postForEntity(userInfoUrl, request, Map.class);

        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = responseEntity.getBody();
            return (Map<String, Object>) responseBody.get("user");
        } else {
            throw new RuntimeException("Failed to retrieve user info");
        }
    }
}
