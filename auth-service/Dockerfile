FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# 1. Copy root parent pom.xml
COPY pom.xml .

# 2. Copy module POM files
COPY account-service/pom.xml account-service/
COPY auth-service/pom.xml auth-service/

# 3. Copy auth-service source code
COPY auth-service/src auth-service/src

# 4. Build only auth-service (without -am unless other modules are needed as dependencies)
RUN mvn clean package -pl auth-service -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/auth-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]