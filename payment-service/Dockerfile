# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy parent POM and all child module POMs for layer caching
COPY pom.xml .
COPY auth-service/pom.xml auth-service/
COPY account-service/pom.xml account-service/
COPY transaction-service/pom.xml transaction-service/
COPY notification-service/pom.xml notification-service/
COPY api-gateway/pom.xml api-gateway/
COPY payment-service/pom.xml payment-service/

# Copy source code for payment-service
COPY payment-service/src payment-service/src

# Package the payment-service jar
RUN mvn clean package -pl payment-service -am -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from stage 1
COPY --from=builder /app/payment-service/target/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]FROM ubuntu:latest
LABEL authors="rishabhverma"

ENTRYPOINT ["top", "-b"]