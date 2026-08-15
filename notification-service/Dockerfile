# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy parent POM and service POMs
COPY pom.xml .
COPY auth-service/pom.xml auth-service/
COPY account-service/pom.xml account-service/
COPY transaction-service/pom.xml transaction-service/
COPY notification-service/pom.xml notification-service/

# Copy source code for notification-service
COPY notification-service/src notification-service/src

# Package the notification-service jar
RUN mvn clean package -pl notification-service -am -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from stage 1
COPY --from=builder /app/notification-service/target/*.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"]