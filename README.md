# Account Service - Banking Microservice

Spring Boot REST API service for managing banking accounts and user authentication.

## Features

- User registration and login with JWT authentication
- Account management (create, retrieve, update)
- Secure password hashing with BCrypt
- MySQL database integration
- Docker support for easy deployment

## Project Structure

```
account-service/
├── src/main/java/com/banking/account/
│   ├── config/          # Spring configuration
│   ├── controller/      # REST API endpoints
│   ├── dto/            # Data transfer objects
│   ├── model/          # JPA entities
│   ├── repository/     # Data access layer
│   ├── security/       # JWT utilities
│   └── service/        # Business logic
├── src/main/resources/
│   └── application.yml # Application configuration
├── docker-compose.yml  # Docker services setup
└── pom.xml            # Maven dependencies
```

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+ (or use docker-compose)

## Setup & Build

### Local Development

```bash
# Install dependencies
mvn clean install

# Run application
mvn spring-boot:run
```

### Using Docker

```bash
# Build and run services
docker-compose up --build

# Stop services
docker-compose down

#Rebuild and run API Gateway/ any other service
docker compose down
docker compose build --no-cache api-gateway
docker compose up api-gateway

```

## API Endpoints

### Authentication
- `POST /account-service/api/auth/register` - Register new user
- `POST /account-service/api/auth/login` - Login user

### Request/Response Examples

**Register:**
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

## Configuration

Modify `application.yml` for:
- Database connection settings
- JWT secret and expiration
- Server port and context path
- Logging levels

## Database Schema

**Users Table:**
- id (Primary Key)
- email (Unique)
- password (Hashed)
- firstName
- lastName
- phoneNumber
- active
- createdAt
- updatedAt

**Accounts Table:**
- id (Primary Key)
- accountNumber (Unique)
- userId (Foreign Key)
- accountType
- balance
- currency
- active
- createdAt
- updatedAt


## Problems Faced & Troubleshooting

### 1. Database Connection Failure (`FATAL: password authentication failed for user "${DB_USERNAME}"`)

**Issue:**  
During startup, Spring Boot threw a `BeanCreationException` and failed to build the `EntityManagerFactory`. The underlying cause was a PostgreSQL authentication error:
```text
Caused by: org.postgresql.util.PSQLException: FATAL: password authentication failed for user "${DB_USERNAME}"

**FIX**
Ensure the database username and password in `application.yml` match those configured in your PostgreSQL instance.
Pass environment variables correctly if using Docker. For example, in `docker-compose.yml`, set:
```yaml 
Pass environment locally:
  - DB_USERNAME
  - DB_PASSWORD
  - JWT_SECRET
```

### 2. JJWT `parserBuilder()` Compilation Error

**Problem:**
The API Gateway failed to compile with the following error:

```text
cannot find symbol
symbol:   method parserBuilder()
location: class io.jsonwebtoken.Jwts
```

The issue occurred because the project was using JJWT `0.12.x`, where the older `parserBuilder()` API is no longer available.

**Cause:**
The JWT utility class was using the JJWT `0.11.x` API:

```java
Jwts.parserBuilder()
    .setSigningKey(getSignKey())
    .build()
    .parseClaimsJws(token);
```

**Fix:**
Updated the JWT parsing code to use the JJWT `0.12.x` API:

```java
Jwts.parser()
    .verifyWith(getSignKey())
    .build()
    .parseSignedClaims(token);
```

Also updated the signing key method to return a `SecretKey` and used `StandardCharsets.UTF_8` when converting the secret to bytes.

**Result:**
The API Gateway successfully compiled with JJWT `0.12.6`, eliminating the `parserBuilder()` compilation error.
