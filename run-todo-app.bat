@echo off
REM Set JAVA_HOME and DB environment variables, then run Spring Boot app
set JAVA_HOME=C:\Program Files\Java\jdk-17
set DB_URL=jdbc:postgresql://db.atxcccbzfelpmvbodljk.supabase.co:5432/postgres
set DB_USERNAME=postgres
set DB_PASSWORD="X_Tkj9GRY$*P@vy"
set DATABASE_URL=postgresql://postgres:X_Tkj9GRY$*P@vy@db.atxcccbzfelpmvbodljk.supabase.co:5432/postgres
call mvnw spring-boot:run
if %ERRORLEVEL% neq 0 (
    echo COULD NOT CONNECT TO DB, error %ERRORLEVEL% check your db env URL USERNAME PASSWORD
)
