package com.alphalearn.todo;

import com.alphalearn.todo.model.User;
import com.alphalearn.todo.repository.UserRepository;
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
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void testRegisterUser() throws Exception {
        String userJson = "{" +
                "\"username\":\"testuser\"," +
                "\"password\":\"testpass\"," +
                "\"email\":\"test@example.com\"," +
                "\"role\":\"user\"}";
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isCreated());
    }

    @Test
    void testLoginUser() throws Exception {
        // First, register the user
        String userJson = "{" +
                "\"username\":\"loginuser\"," +
                "\"password\":\"loginpass\"," +
                "\"email\":\"login@example.com\"," +
                "\"role\":\"user\"}";
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isCreated());
        // Then, login
        String loginJson = "{" +
                "\"username\":\"loginuser\"," +
                "\"password\":\"loginpass\"}";
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").exists());
    }
}
