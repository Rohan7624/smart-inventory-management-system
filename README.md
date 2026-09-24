# Smart Inventory Management System

A full-stack **Smart Inventory Management System** built with **Java Spring Boot, React, TypeScript, and MySQL**. The system helps businesses manage warehouses, inventory, orders, stock alerts, and demand prediction from a centralized dashboard.

## 🚀 Key Features

### 🏢 Warehouse Management

* Create and manage multiple warehouses
* View warehouse information
* Track inventory across different warehouse locations
* Monitor warehouse stock levels
* Manage warehouse-specific inventory

### 📦 Inventory Management

* Add, update, and delete products
* Track available stock
* Monitor inventory levels
* View inventory by warehouse
* Track stock movement
* Identify low-stock products
* Centralized inventory dashboard

### 🛒 Order Management

* Create and manage orders
* Track order information
* Manage order status
* Connect orders with inventory
* Monitor stock affected by orders

### 🔔 Low Stock Alerts

* Automatically identify products below their reorder level
* Display low-stock products on the dashboard
* Monitor inventory that requires restocking
* Help prevent stock shortages

### 📈 Demand Prediction

* Analyze inventory and order data
* Predict future product demand
* Support inventory planning
* Help identify products that may require additional stock
* Improve restocking decisions using historical data

### 📊 Dashboard

The dashboard provides an overview of the complete inventory system:

* Total products
* Total inventory
* Warehouse overview
* Order overview
* Low-stock alerts
* Demand prediction
* Inventory status
* Stock monitoring

---

## 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* BCrypt password encryption
* Protected REST APIs
* Role-based access control
* Stateless authentication
* CORS configuration
* Secure API communication

---

## 🛠️ Technologies Used

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* HTML5
* CSS3

### Backend

* Java 21
* Spring Boot 3.5.5
* Spring Security
* Spring Data JPA
* Hibernate
* JWT
* Maven

### Database

* MySQL

### Development Tools

* Git
* GitHub
* Postman
* IntelliJ IDEA
* VS Code

---

## 🏗️ System Architecture

The backend follows a layered architecture:

```text
                    React Frontend
                          │
                          ▼
                    REST APIs
                          │
                          ▼
                   Spring Boot
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
        Controllers    Services    Security/JWT
             │            │
             └────────────┤
                          ▼
                     Repositories
                          │
                          ▼
                       MySQL
```

---

## 📂 Project Structure

```text
Smart Inventory Management System/
│
├── invtrack-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── invtrack/
│   │       │           └── backend/
│   │       │               ├── config/
│   │       │               ├── controller/
│   │       │               ├── dto/
│   │       │               ├── entity/
│   │       │               ├── repository/
│   │       │               ├── security/
│   │       │               └── service/
│   │       │
│   │       └── resources/
│   │
│   └── pom.xml
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Rohan7624/smart-inventory-management-system.git
```

Navigate to the project:

```bash
cd smart-inventory-management-system
```

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd invtrack-backend
```

### Create MySQL Database

Create the database:

```sql
CREATE DATABASE invtrack_db;
```

### Configure Application Properties

Create:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/invtrack_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8081

app.jwt.secret=YOUR_JWT_SECRET
```

> **Important:** `application.properties` is intentionally excluded from Git because it contains local database credentials and JWT secrets.

### Run Backend

From the `invtrack-backend` directory:

```bash
mvn spring-boot:run
```

Backend:

```text
http://localhost:8081
```

---

# 💻 Frontend Setup

Open a new terminal and go to the project root:

```bash
cd smart-inventory-management-system
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔑 Authentication

The application uses **JWT authentication** to secure protected APIs.

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

After successful authentication, the server returns a JWT token.

Protected API requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 📡 API Modules

The application is organized around several major modules.

| Module            | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| Authentication    | Registration, login, JWT security                |
| Warehouses        | Manage warehouse locations and stock             |
| Inventory         | Manage products and stock quantities             |
| Orders            | Create and track orders                          |
| Low Stock Alerts  | Identify products requiring restocking           |
| Demand Prediction | Analyze demand and support future stock planning |
| Dashboard         | Centralized system overview                      |

---

# 📦 Inventory Management

The inventory module provides functionality for:

* Product creation
* Product updates
* Product deletion
* Stock quantity tracking
* Warehouse-based inventory
* Stock monitoring
* Low-stock detection

---

# 🏢 Warehouse Management

Warehouse management allows the system to maintain inventory across multiple locations.

The system can be used to:

* Create warehouses
* View warehouse details
* Associate inventory with warehouses
* Monitor stock by warehouse
* Manage warehouse inventory

---

# 🛒 Order Management

The order module helps manage inventory-related orders.

Features include:

* Order creation
* Order tracking
* Order status management
* Inventory integration
* Stock monitoring

Orders can be used as a source of information for inventory analysis and demand prediction.

---

# 🔔 Low Stock Alerts

The system monitors inventory quantities and identifies products that reach or fall below their configured reorder level.

The dashboard can display:

```text
Product → Current Stock → Reorder Level → Alert
```

This helps users identify inventory that may require replenishment.

---

# 📈 Demand Prediction

The Demand Prediction module uses available inventory and order information to support future demand planning.

It can help with:

* Understanding product demand
* Identifying products with increasing demand
* Planning future stock requirements
* Supporting purchasing decisions
* Reducing potential stock shortages

> Demand prediction is intended as a planning/decision-support feature and should be evaluated against actual historical performance before being used for operational decisions.

---

# 📊 Dashboard

The dashboard brings the major system modules together.

### Dashboard Information

* Total products
* Total stock
* Warehouse information
* Order information
* Low-stock products
* Demand prediction
* Inventory status

Example workflow:

```text
              Dashboard
                  │
     ┌────────────┼────────────┐
     ▼            ▼            ▼
 Warehouses    Inventory     Orders
     │            │            │
     └────────────┼────────────┘
                  ▼
           Stock Monitoring
                  │
          ┌───────┴────────┐
          ▼                ▼
    Low Stock Alerts   Demand Prediction
```

---

# 🧪 API Testing

The backend APIs can be tested using **Postman**.

Example:

```http
GET http://localhost:8081/api/products
```

For protected endpoints, include:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 🔒 Security

Security features include:

* JWT authentication
* BCrypt password hashing
* Protected REST endpoints
* Role-based access control
* Stateless sessions
* CORS configuration
* Local secrets excluded from Git

---

# 🔮 Future Improvements

Possible future enhancements include:

* Supplier management
* Purchase management
* Advanced inventory reports
* Stock-in and stock-out history
* Barcode/QR code scanning
* Email notifications
* Advanced demand forecasting
* Sales analytics
* Inventory export to Excel/PDF
* Docker deployment
* Cloud deployment

---

# 👨‍💻 Author

## Jagadish Pradhan

**Java Developer | Full-Stack Developer**

### Technical Skills

* Java
* Spring Boot
* Spring Security
* REST APIs
* Spring Data JPA
* Hibernate
* MySQL
* React
* TypeScript
* Tailwind CSS
* Git
* GitHub
* Postman

---

# 📄 License

This project is licensed under the **MIT License**.
