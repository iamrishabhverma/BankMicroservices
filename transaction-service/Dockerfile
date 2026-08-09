# Stage 1: Build application
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy parent POM and module POM
COPY pom.xml .
COPY transaction-service/pom.xml transaction-service/

# Build parent POM dependencies
RUN mvn -N install -DskipTests

# Copy transaction-service source code
COPY transaction-service/src transaction-service/src

# Package the module
RUN mvn clean package -pl transaction-service -am -DskipTests

# Stage 2: Run application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/transaction-service/target/*.jar app.jar

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]