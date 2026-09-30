# Employee Management System

A full-stack Employee Management System developed as part of the **B.Y.T.E by Arithmatrix Full Stack Development Internship – Task 2**.

The application provides employee CRUD operations with JWT authentication, server-side validation, MySQL persistence, and a hidden audit logging system that records admin UPDATE and DELETE actions.

---

## 📌 Features

- Admin login using JWT authentication
- Employee Create, Read, Update and Delete (CRUD)
- Server-side validation for employee fields
- Protected employee APIs
- Admin authentication for create, update and delete operations
- MySQL database for persistent employee data
- Responsive frontend interface
- Employee search/list management
- Hidden `audit_logs` table
- Automatic audit logging for employee UPDATE and DELETE
- Stores previous employee data before UPDATE/DELETE
- Records admin username and action timestamp
- REST API architecture

---

## 🛠️ Technologies Used

### Frontend

- React.js
- React Router DOM
- Bootstrap
- Axios
- JavaScript

### Backend

- Node.js
- Express.js
- JWT (JSON Web Token)
- bcrypt
- CORS
- dotenv

### Database

- MySQL

### Development Tools

- Visual Studio Code
- MySQL Workbench
- Thunder Client
- Git
- GitHub

---

## 📂 Project Structure

Employee Management System/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   │   └── employeeController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── employeeRoutes.js
│   │   └── authRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
