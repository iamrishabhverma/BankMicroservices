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
