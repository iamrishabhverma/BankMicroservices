# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy parent POM and all service POMs to leverage Docker layer caching
COPY pom.xml .
COPY auth-service/pom.xml auth-service/
COPY account-service/pom.xml account-service/
COPY transaction-service/pom.xml transaction-service/
COPY notification-service/pom.xml notification-service/

# Copy source code for auth-service
COPY auth-service/src auth-service/src

# Package the auth-service jar
RUN mvn clean package -pl auth-service -am -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from stage 1
COPY --from=builder /app/auth-service/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]