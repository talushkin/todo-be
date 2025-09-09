@echo off
REM Set JAVA_HOME and run Spring Boot app automatically
set JAVA_HOME=C:\Program Files\Java\jdk-17
cd /d d:\coding-tal\xplace\todo-be\todo
call mvnw spring-boot:run
