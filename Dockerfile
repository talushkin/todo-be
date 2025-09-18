# 17-09 updated: Multi-stage Dockerfile for Spring Boot + JDK 17

FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests=true clean package

FROM eclipse-temurin:17-jre-jammy AS run
WORKDIR /app

# Enhanced network configuration for cloud deployment
ENV JAVA_OPTS="-Djava.net.preferIPv4Stack=false \
    -Djava.net.preferIPv6Addresses=true \
    -Djava.net.useSystemProxies=true \
    -Dnetworkaddress.cache.ttl=60 \
    -Dnetworkaddress.cache.negative.ttl=10 \
    -Dsun.net.useExclusiveBind=false \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.datasource.hikari.connection-timeout=60000 \
    -Dspring.datasource.hikari.validation-timeout=5000"

# Install DNS utilities for debugging and test connectivity
RUN apt-get update && apt-get install -y dnsutils iputils-ping curl net-tools && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /app/target/todo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
