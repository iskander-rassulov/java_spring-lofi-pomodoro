package com.iskander.lofipomodoro;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/todoist")
public class TodoistAuthController {

    @Value("${TODOIST_CLIENT_ID}")
    private String clientId;

    @Value("${TODOIST_REDIRECT_URI}")
    private String redirectUri;

    @GetMapping("/login")
    public ResponseEntity<Void> loginWithTodoist() {
        String authorizationUrl = "https://todoist.com/oauth/authorize?client_id=" + clientId + "&scope=data:read&state=random_state_string&redirect_uri=" + redirectUri;
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(authorizationUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/callback")
    public ResponseEntity<String> todoistCallback(@RequestParam("code") String code) {
        // Здесь вы можете получить access token с использованием переданного code
        // Логика получения токена будет включать отправку POST-запроса к API Todoist
        return ResponseEntity.ok("Authorization successful! Code: " + code);
    }
}
