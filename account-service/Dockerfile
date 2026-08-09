# Stage 1: Build application
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy parent POM and module POM
COPY pom.xml .
COPY account-service/pom.xml account-service/

# Build parent POM dependencies
RUN mvn -N install -DskipTests

# Copy account-service source code
COPY account-service/src account-service/src

# Package the module
RUN mvn clean package -pl account-service -am -DskipTests

# Stage 2: Run application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/account-service/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]