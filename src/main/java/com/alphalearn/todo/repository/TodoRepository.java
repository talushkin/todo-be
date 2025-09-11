package com.alphalearn.todo.repository;

import com.alphalearn.todo.model.Todo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Author: Tal Arnon
 * Date: 07/11/2025
 * Time: 11:24 AM
 */

@Repository
@Transactional
public class TodoRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Todo addNew(Todo todo) {
        return entityManager.merge(todo);
    }

    public Todo update(Todo todo) {
        return entityManager.merge(todo);
    }

    public void deleteById(Long id) throws IllegalArgumentException {
        Todo todoToBeDeleted = findById(id);
        entityManager.remove(todoToBeDeleted);
    }

    public Todo findById(Long id) {
        return entityManager.find(Todo.class, id);
    }

    public List<Todo> fetchAllTodos() {
        TypedQuery<Todo> namedQuery = entityManager.createNamedQuery("fetch_all_todos", Todo.class);
        return namedQuery.getResultList();
    }

    public List<Todo> fetchTodosWithLimitSkip(int limit, int skip) {
        TypedQuery<Todo> namedQuery = entityManager.createNamedQuery("fetch_all_todos", Todo.class);
        namedQuery.setFirstResult(skip);
        namedQuery.setMaxResults(limit);
        return namedQuery.getResultList();
    }
}
