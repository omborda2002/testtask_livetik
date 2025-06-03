# LiveTik-testtask

This project demonstrates a **modular, event-driven monolithic architecture** using **NestJS** and **Apache Kafka**, with a focus on **hexagonal architecture** and **data sovereignty**.

This is a **test project for LiveTik**.

## 📦 Modules Implemented

* **UserManagementModule**: Handles registration, login, and password change.
* **AuditLogModule**: Listens to password change events and logs audit entries.
* **SecurityDashboardModule**: Maintains and exposes the last password change timestamp per user, updated via Kafka events.

---

## 🚀 Getting Started

### 📦 Install Dependencies

```bash
npm install
```

---

## 🐳 Kafka Setup Using Docker

Ensure Docker is installed, then run:

### ✅ Step 1: Create a `docker-compose.yml`

```yaml
version: '3.8'

services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.3.2
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:7.3.2
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper
```

### ✅ Step 2: Start Kafka

```bash
docker-compose up -d
```

---

## 🧠 Project Structure (Hexagonal Architecture)

```
src/
├── user-management/
│   ├── application/        # Services and DTOs
│   ├── domain/             # Entities and Ports
│   ├── infrastructure/     # In-memory Adapters
│   └── interfaces/         # Controllers
│
├── audit-log/              # Kafka consumer logging password changes
├── security-dashboard/     # Maintains view of password change timestamps
├── app.module.ts
├── main.ts
```

---

## 🧪 Running the App

### ✅ Start NestJS Application

```bash
npm run start:dev
```

It connects to Kafka as both producer and consumer.

### ✅ Available Endpoints

| Endpoint                                        | Method | Description                              |
| ----------------------------------------------- | ------ | ---------------------------------------- |
| `/users/register`                               | POST   | Register new user                        |
| `/users/login`                                  | POST   | Login user                               |
| `/users/change-password`                        | POST   | Change user password (emits Kafka event) |
| `/dashboard/users/:userId/last-password-change` | GET    | Get last password change timestamp       |

---

## 🧪 Run Tests

### ✅ Unit Tests

```bash
npm run test
```

Includes tests for:

* `UserService` (including Kafka event emission)
* `AuditLogService` (Kafka listener logging)
* `SecurityDashboardController` (event listener and HTTP endpoint)

---

## 📬 Postman Collection

🔗 [Postman Collection Link](https://red-resonance-450635.postman.co/workspace/Personal-Workspace~f985e4e0-f03e-440c-9073-7365ff530f0a/collection/18233166-8d426034-0026-4c27-ba16-6c2b42b64dd6?action=share&creator=18233166&active-environment=18233166-299f1299-229f-44af-97f7-3702cafb0b07)

---

## 🗂 Additional Notes

* Kafka topic used: `user.events.auth`
* Uses in-memory data stores (no external DB)
* PDF discussion document is attached in the email and inside the project's workspace.

---

## 👨‍💻 Author

**Om Borda**
