package com.alphalearn.todo.controller;

import com.alphalearn.todo.model.Todo;
import com.alphalearn.todo.repository.TodoRepository;
import com.alphalearn.todo.response.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Author: Tal Arnon
 * Date: 07/11/2025
 * Time: 1:01 PM
 */

@RestController
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    @GetMapping("/todos")
    public ResponseEntity<Object> fetchAllTods() {
        List<Todo> todos = todoRepository.fetchAllTodos();
        return ResponseHandler.buildResponse(
                true,
                HttpStatus.OK,
                todos,
                null
        );
    }

    @GetMapping("/todo/{id}")
    public ResponseEntity<Object> fetchTodoById(@PathVariable String id) {
        long todoId = Long.parseLong(id);
        Todo todo = todoRepository.findById(todoId);
        return ResponseHandler.buildResponse(
                true,
                HttpStatus.OK,
                todo,
                null
        );
    }

    @PostMapping("/todos")
    public ResponseEntity<Object> createTodo(@RequestBody Todo todo) {
        Todo createdTodo = todoRepository.addNew(todo);
        return ResponseHandler.buildResponse(
                true,
                HttpStatus.OK,
                createdTodo,
                null
        );
    }

    @PutMapping("/todos")
    public ResponseEntity<Object> updateTodo(@RequestBody Todo todo) {
        Todo updatedTodo = todoRepository.update(todo);
        return ResponseHandler.buildResponse(
                true,
                HttpStatus.OK,
                updatedTodo,
                null
        );
    }

    @DeleteMapping("/todo/{id}")
    public ResponseEntity<Object> deleteTodo(@PathVariable String id) {
        try {
            todoRepository.deleteById(Long.parseLong(id));
            return ResponseHandler.buildResponse(
                    true,
                    HttpStatus.OK,
                    "Todo with " + id + " has been deleted successfully",
                    null
            );
        } catch (IllegalArgumentException illegalArgumentException) {
            return ResponseHandler.buildResponse(
                    false,
                    HttpStatus.BAD_REQUEST,
                    null,
                    illegalArgumentException.getMessage()
            );
        }
    }
}
