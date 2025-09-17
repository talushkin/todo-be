@echo off
REM 17-09 updated: Switched to Supabase Postgres connection variables (no secrets here)
REM Set JAVA_HOME and DB environment variables before running if not already set in your shell

IF NOT DEFINED JAVA_HOME (
    set JAVA_HOME=C:\Program Files\Java\jdk-17
)

REM Accept environment overrides; provide safe defaults (non-secret)
IF NOT DEFINED DB_URL (
    set DB_URL=jdbc:postgresql://YOUR_SUPABASE_HOST:5432/postgres
)
IF NOT DEFINED DB_USERNAME (
    set DB_USERNAME=postgres
)
IF NOT DEFINED DB_PASSWORD (
    echo DB_PASSWORD is not set. Set it in your environment before running.
)
IF NOT DEFINED JWT_SECRET (
    echo JWT_SECRET is not set. Set it in your environment before running.
)

REM Optional: set DATABASE_URL for tools that expect it (no password here)
IF NOT DEFINED DATABASE_URL (
    set DATABASE_URL=postgresql://%DB_USERNAME%@YOUR_SUPABASE_HOST:5432/postgres
)

call mvnw spring-boot:run
if %ERRORLEVEL% neq 0 (
        echo COULD NOT CONNECT TO DB, error %ERRORLEVEL% check your DB_URL DB_USERNAME DB_PASSWORD and network
)
