@echo off
REM 17-09 updated: Switched to Supabase Postgres connection variables (no secrets here)
REM Set JAVA_HOME and DB environment variables before running if not already set in your shell

IF NOT DEFINED JAVA_HOME (
    set JAVA_HOME=C:\Program Files\Java\jdk-17
)

REM Accept environment overrides; provide working defaults for testing
IF NOT DEFINED SPRING_DATASOURCE_URL (
    set SPRING_DATASOURCE_URL=jdbc:postgresql://db.atxcccbzfelpmvbodljk.supabase.co:5432/postgres?sslmode=require
)
IF NOT DEFINED SPRING_DATASOURCE_USERNAME (
    set SPRING_DATASOURCE_USERNAME=postgres
)
IF NOT DEFINED SPRING_DATASOURCE_PASSWORD (
    set SPRING_DATASOURCE_PASSWORD=DqawNBY0joJdC0o9
)
IF NOT DEFINED JWT_SECRET (
    set JWT_SECRET=MySuperSecretKeyForJWTGeneration123456
)

call mvnw spring-boot:run
if %ERRORLEVEL% neq 0 (
    echo COULD NOT CONNECT TO DB, error %ERRORLEVEL% check your SPRING_DATASOURCE_URL SPRING_DATASOURCE_USERNAME SPRING_DATASOURCE_PASSWORD and network
)
