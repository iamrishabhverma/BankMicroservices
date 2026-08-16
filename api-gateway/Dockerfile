FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
COPY auth-service/pom.xml auth-service/
COPY account-service/pom.xml account-service/
COPY transaction-service/pom.xml transaction-service/
COPY notification-service/pom.xml notification-service/
COPY api-gateway/pom.xml api-gateway/

COPY api-gateway/src api-gateway/src
RUN mvn clean package -pl api-gateway -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/api-gateway/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]