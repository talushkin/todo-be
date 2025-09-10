package com.alphalearn.todo;

import com.alphalearn.todo.model.Todo;
import com.alphalearn.todo.repository.TodoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@org.springframework.test.context.ActiveProfiles("test")
public class TodoControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetLastTodoId() throws Exception {
        mockMvc.perform(get("/todo/last"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.maxID").exists());
    }

    @Test
    void testCreateAndFetchTodo() throws Exception {
        String todoJson = "{" +
                "\"title\":\"Test Todo\"," +
                "\"description\":\"Test Description\"}";
        mockMvc.perform(post("/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(todoJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Test Todo"));
    }
}
