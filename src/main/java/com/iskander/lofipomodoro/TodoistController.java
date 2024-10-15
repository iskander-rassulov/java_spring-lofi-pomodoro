package com.iskander.lofipomodoro;

import com.iskander.lofipomodoro.TodoistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/todoist")
public class TodoistController {

    private final TodoistService todoistService;

    public TodoistController(TodoistService todoistService) {
        this.todoistService = todoistService;
    }

    @GetMapping("/tasks")
    public ResponseEntity<String> getTasks() {
        String tasks = todoistService.getTasks();
        return ResponseEntity.ok(tasks);
    }
}

