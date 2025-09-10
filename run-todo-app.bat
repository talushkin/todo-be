@echo off
REM Set JAVA_HOME and run Spring Boot app automatically
set JAVA_HOME=C:\Program Files\Java\jdk-17
set DB_URL=jdbc:mysql://sql8.freesqldatabase.com:3306/sql8797618
set DB_USERNAME=sql8797618
set DB_PASSWORD=YLCpgqjaWJ
cd /d d:\coding-tal\xplace\todo-be\todo
call mvnw spring-boot:run
if %ERRORLEVEL% neq 0 (
	echo COULD NOT CONNECT TO DB, error %ERRORLEVEL% check your db env URL USERNAME PASSWORD
)
