package com.iskander.lofipomodoro;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/todoist")
public class TodoistController {

    private final TodoistService todoistService;

    public TodoistController(TodoistService todoistService) {
        this.todoistService = todoistService;
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Map<String, Object>>> getTasks(HttpSession session) {
        String accessToken = (String) session.getAttribute("accessToken");
        List<Map<String, Object>> tasks = todoistService.getTasks(accessToken);
        return ResponseEntity.ok(tasks);
    }
}
