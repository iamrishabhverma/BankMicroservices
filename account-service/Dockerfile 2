# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy parent POM (needed to resolve com.banking:bank-microservices parent)
COPY pom.xml .

# Copy service files relative to root
COPY account-service/pom.xml ./account-service/
COPY account-service/src ./account-service/src

# Move into account-service folder inside container & build
WORKDIR /app/account-service
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/account-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]