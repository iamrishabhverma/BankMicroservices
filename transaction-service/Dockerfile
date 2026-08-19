# Stage 1: Build application
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy parent POM and module POM
COPY pom.xml .
COPY auth-service/pom.xml auth-service/
COPY account-service/pom.xml account-service/
COPY transaction-service/pom.xml transaction-service/
COPY notification-service/pom.xml notification-service/
COPY api-gateway/pom.xml api-gateway/
COPY payment-service/pom.xml payment-service/

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

HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8083/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]