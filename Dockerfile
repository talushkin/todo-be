# 17-09 updated: Multi-stage Dockerfile for Spring Boot + JDK 17

FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests=true clean package

FROM eclipse-temurin:17-jre-jammy AS run
WORKDIR /app
ENV JAVA_OPTS=""
COPY --from=build /app/target/todo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
