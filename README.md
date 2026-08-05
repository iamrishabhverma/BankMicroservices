# 🏦 BankMicroservices

A robust, enterprise-grade banking application built on a microservices architecture using **Spring Boot 3**, **Docker Compose**, **PostgreSQL**, and **Kafka**.

---

## 🏗️ Architecture & Tech Stack

- **Backend Framework:** Spring Boot 3 / Java 17
- **Build Tool:** Apache Maven (Multi-module parent project)
- **Database:** PostgreSQL
- **Messaging / Event Streaming:** Apache Kafka
- **Containerization & Orchestration:** Docker / Docker Compose
- **Security:** Spring Security with JWT Authentication

---

## 🚀 Quick Start Guide

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Java 17 SDK](https://www.adoptium.net/) (for local development outside Docker).
- Git installed.

### 1. Clone the Repository
```bash
git clone https://github.com/iamrishabhverma/BankMicroservices.git
cd BankMicroservices
```

### 2. Configure Environment Variables
Copy the template `.env.example` file to create your local `.env` configuration:

```bash
cp .env.example .env
```

Set appropriate local development values in your `.env` file:
```env
ACCOUNT_SERVICE_PORT=8081
POSTGRES_PORT=5432
POSTGRES_DB=banking_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD= //your_secure_password_here
JWT_SECRET= //your_base64_secret_key_here
JWT_EXPIRATION_MS=86400000
```

> ⚠️ **Security Note:** Not mentioning `.env` or sensitive credentials to source control. Ensure `.env` is listed in your `.gitignore` file.

### 3. Build & Run with Docker Compose
Start all microservices along with PostgreSQL and Kafka:

```bash
docker compose up --build
```

To run in detached mode:
```bash
docker compose up -d --build
```

---

## 🛠️ Troubleshooting & Engineering Lessons

During development and containerized orchestration, several environment, build, and source-control challenges were encountered and resolved. Below are the primary technical issues and their solutions.

---

### 1. Docker Build Failure: Relative Parent POM Resolution
**Problem:**  
When attempting to build `account-service`, Maven threw `UnresolvableModelException` stating it could not find parent POM `com.banking:bank-microservices:1.0.0` in Maven Central.

**Cause:**  
The Docker build context was scoped strictly to `./account-service`. Because Maven was running inside an isolated context, it had no visibility into the parent `pom.xml` located at the root directory.

**Solution:**  
Updated `docker-compose.yml` to set the build context to the root directory (`.`) while specifying the subfolder `Dockerfile` path:

```yaml
account-service:
  build:
    context: .
    dockerfile: account-service/Dockerfile
```
Adjusted `Dockerfile` to copy the parent `pom.xml` first, establishing the root context within the container build sequence.

---

### 2. Spring Boot Bootstrapping Failure: `NumberFormatException`
**Problem:**  
The container started but crashed on initialization with:
`java.lang.NumberFormatException: For input string: "ACCOUNT_SERVICE_PORT"`

**Cause:**  
Spring Boot Spring Cloud Actuator attempted to parse the environment variable designated for the port configuration as a raw literal string `"ACCOUNT_SERVICE_PORT"` instead of resolving its mapped value.

**Solution:**  
Aligned environment variable bindings between the `.env` file, `docker-compose.yml`, and Spring `application.yml` properties. Replaced raw string fallback mappings with proper numeric fallbacks:
```yaml
ports:
  - "${ACCOUNT_SERVICE_PORT:-8081}:8081"
```

---

### 3. Container Startup Race Condition with PostgreSQL
**Problem:**  
`account-service` crashed on startup with JDBC connection refusal errors (`Connection refused: postgres:5432`).

**Cause:**  
Docker's standard `depends_on` only waits for a container to *start*, not for the service inside it to become *ready* to accept network traffic.

**Solution:**  
Configured a PostgreSQL healthcheck and updated `account-service` to wait for explicit service health:

```yaml
postgres:
  image: postgres:15-alpine
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres -d banking_db"]
    interval: 5s
    timeout: 5s
    retries: 5

account-service:
  depends_on:
    postgres:
      condition: service_healthy
```

---

### 4. Host Port Conflict (`8081: Address Already in Use`)
**Problem:**  
Docker daemon failed to bind port `8081` upon `docker compose up`.

**Cause:**  
An active Spring Boot process launched locally via IntelliJ IDEA was still holding port `8081`.

**Solution:**  
Identified and terminated the lingering PID on macOS/Linux:
```bash
# Locate PID
lsof -i :8081

# Terminate process
kill -9 <PID>
```

---

### 5. Git Tracking IDE Files (`.idea/`)
**Problem:**  
Local IntelliJ configuration files (`.idea/`, `*.iml`) continued appearing on GitHub despite being present in `.gitignore`.

**Cause:**  
Files committed to Git prior to adding them to `.gitignore` remain tracked in the index.

**Solution:**  
Purged tracked IDE files from the Git cache without removing them from local storage:
```bash
git rm -r --cached .idea
git commit -m "fix: untrack .idea directory from git index"
git push origin main
```

---

### 6. Secrets Management & Environment Isolation
**Problem:**  
Hardcoded database credentials and JWT secret keys presented security risks and hindered environment portability.

**Solution:**  
Extracted all sensitive runtime variables into a local `.env` file (ignored by Git) and published a sanitized `.env.example` template with dummy values for development setup:

```bash
# .env.example
POSTGRES_DB=banking_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
JWT_SECRET=your_base64_secret_key_here
JWT_EXPIRATION_MS=86400000
```

---

## 💡 Key Engineering Takeaways
* **Docker Context Scope:** Microservices utilizing shared parent POMs or common modules require root-level build context during image assembly.
* **Healthcheck Dependency:** Always decouple container start sequence from application readiness with explicit `service_healthy` conditions.
* **Git Index Management:** Updating `.gitignore` is not retroactive; untrack existing files using `git rm --cached`.
* **Secrets Hygiene:** Keep secrets out of code and README documentation; rely on `.env.example` templates with placeholders.
