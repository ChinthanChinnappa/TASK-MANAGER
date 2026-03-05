# 🗂️ Task Manager System

A backend-based **Task Management System** built using **Node.js, Prisma ORM, and SQLite**.
The system allows users to **create, manage, update, and track tasks efficiently** while demonstrating modern backend development practices such as **REST APIs, database modeling, and ORM integration**.

This project focuses on **structured backend development and database management using Prisma**.

---

# 🚀 Features

### 📝 Task Management

* Create new tasks
* Update existing tasks
* Delete tasks
* Mark tasks as completed

### 📊 Task Tracking

* View all tasks
* Track task completion status
* Organize tasks efficiently

### 💾 Database Management

* Structured database using **Prisma ORM**
* Persistent storage using **SQLite**

---

# 🏗️ System Architecture

```
Client (API Requests)
        │
        ▼
Node.js Backend
        │
        ▼
Prisma ORM
        │
        ▼
SQLite Database
```

The backend handles **all business logic**, while **Prisma ORM manages database interactions** and schema migrations.

---

# 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* SQLite

### ORM

* Prisma

### Tools

* REST APIs
* Postman for API testing

---

# 📂 Project Structure

```
task-manager
│
├── prisma
│   ├── schema.prisma
│   └── dev.db
│
├── src
│   ├── routes
│   ├── controllers
│   ├── services
│   └── server.js
│
├── package.json
└── README.md
```

---

# ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Database

Run Prisma migration to initialize the database:

```bash
npx prisma migrate dev
```

---

### 4️⃣ Start the Server

```bash
npm start
```

Server runs on:

```
http://localhost:3000
```

---

# 📡 API Endpoints

### Create Task

```
POST /tasks
```

Example Request

```json
{
  "title": "Complete Backend Project",
  "description": "Finish task manager backend using Prisma",
  "status": "pending"
}
```

---

### Get All Tasks

```
GET /tasks
```

---

### Update Task

```
PUT /tasks/:id
```

---

### Delete Task

```
DELETE /tasks/:id
```

---

# 💾 Database Schema

Example Prisma model:

```
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String
  createdAt   DateTime @default(now())
}
```

---

# 🧪 Testing the API

You can test the APIs using:

* **Postman**
* **Thunder Client (VS Code Extension)**
* **cURL**

---

# 📈 Future Improvements

* User authentication
* Task categories
* Due dates and reminders
* Priority-based task management
* Frontend dashboard
* Cloud database (PostgreSQL)

---

# 👨‍💻 Author

**Chinthan Chinnappa P T**
Computer Science Engineering Student

Interested in:

* Backend Development
* Data Engineering
* Scalable Systems

---

# 🎯 Learning Objectives

This project demonstrates:

* Backend API development
* Database schema design
* ORM usage with Prisma
* CRUD operations with REST APIs
* Integration of Node.js with SQLite

---
