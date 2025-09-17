// 17-09 updated: Added existsByUsername and existsByEmail for duplicate checks
package com.alphalearn.todo.repository;

import com.alphalearn.todo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
