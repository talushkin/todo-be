# Deploying todo-be

## GitHub
1. Ensure secrets are not committed (see .gitignore, .dockerignore). DB creds and JWT secret are read from environment.
2. Initialize git, add remote, and push:
   - origin: https://github.com/talushkin/todo-be.git

## Render
1. Create a new Web Service, select "Docker". Render will use `Dockerfile`.
2. Set environment variables:
   - PORT=8080 (Render will override with dynamic, app supports it)
   - SPRING_DATASOURCE_URL=jdbc:postgresql://YOUR_SUPABASE_HOST:5432/postgres?sslmode=require
   - SPRING_DATASOURCE_USERNAME=postgres
   - SPRING_DATASOURCE_PASSWORD=YOUR_SUPABASE_PASSWORD
   - JWT_SECRET=your-strong-secret-at-least-32-chars
3. Health check path: /actuator/health
4. After deploy, obtain an ADMIN token via /auth/login and call /todos?assignee=... with Authorization: Bearer <token>.
